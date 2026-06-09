'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import BeamButton from '@/components/ui/BeamButton';

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push(next);
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[360px]">
      <h1 className="font-display text-2xl font-bold text-charcoal mb-8">Sign in</h1>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-burgundy/10 border border-burgundy/20 text-burgundy text-sm">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm text-fog mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal placeholder:text-fog/50 focus:border-gold focus:outline-none transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-fog mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal placeholder:text-fog/50 focus:border-gold focus:outline-none transition-colors"
            placeholder="Enter your password"
          />
        </div>

        <BeamButton type="submit" loading={loading} className="w-full">
          Sign in
        </BeamButton>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-mist" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-ivory px-3 text-fog italic">or</span>
          </div>
        </div>

        <p className="text-center text-sm text-fog">
          Don&apos;t have an account?{' '}
          <a href="/sign-up" className="text-gold hover:text-gold-hover transition-colors">
            Create your studio
          </a>
        </p>
      </div>
    </form>
  );
}
