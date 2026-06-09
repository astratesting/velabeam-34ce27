import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      emailVerified: Date | null;
      workspaceId: string;
      role: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    emailVerified: Date | null;
    workspaceId: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string | null;
    workspaceId: string;
    role: string;
  }
}
