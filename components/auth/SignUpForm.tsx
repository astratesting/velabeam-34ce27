'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BeamButton from '@/components/ui/BeamButton';

export default function SignUpForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: email.toLowerCase().trim(),
          password,
          workspaceName: workspaceName || `${name}'s Studio`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      // Auto sign-in after registration
      const result = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created but sign-in failed. Please go to sign-in.');
      } else {
        router.push('/onboarding');
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
      <h1 className="font-display text-2xl font-bold text-charcoal mb-8">Create your studio</h1>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-burgundy/10 border border-burgundy/20 text-burgundy text-sm">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm text-fog mb-1">
            Your name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal placeholder:text-fog/50 focus:border-gold focus:outline-none transition-colors"
            placeholder="Jane Smith"
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-sm text-fog mb-1">
            Email
          </label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password" className="block text-sm text-fog mb-1">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal placeholder:text-fog/50 focus:border-gold focus:outline-none transition-colors"
            placeholder="Minimum 8 characters"
          />
        </div>

        <div>
          <label htmlFor="workspace" className="block text-sm text-fog mb-1">
            Studio name
          </label>
          <input
            id="workspace"
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal placeholder:text-fog/50 focus:border-gold focus:outline-none transition-colors"
            placeholder="Your agency name"
          />
        </div>

        <BeamButton type="submit" loading={loading} className="w-full">
          Create account
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
          Already have an account?{' '}
          <a href="/sign-in" className="text-gold hover:text-gold-hover transition-colors">
            Sign in
          </a>
        </p>
      </div>
    </form>
  );
}
