import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { queryOne } from './lib/db';
import { env } from './lib/env';
import type { User, Workspace, WorkspaceMember } from './types/db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        const user = await queryOne<User>(
          'SELECT * FROM users WHERE email = $1',
          [email]
        );

        if (!user) return null;

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return null;

        const membership = await queryOne<WorkspaceMember & { workspace: Workspace }>(
          `SELECT wm.*, w.id as workspace_id, w.name as workspace_name, w.owner_id, w.plan
           FROM workspace_members wm
           JOIN workspaces w ON w.id = wm.workspace_id
           WHERE wm.user_id = $1
           LIMIT 1`,
          [user.id]
        );

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: null,
          workspaceId: membership?.workspace_id ?? '',
          role: membership?.role ?? 'owner',
        } as any;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.email = (user as any).email;
        token.name = (user as any).name;
        token.workspaceId = (user as any).workspaceId;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string | null,
          emailVerified: null,
          workspaceId: token.workspaceId as string,
          role: token.role as string,
        };
      }
      return session;
    },
  },
  secret: env.AUTH_SECRET,
});
