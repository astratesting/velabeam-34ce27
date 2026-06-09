function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value && !fallback) {
    return '';
  }
  return value!;
}

export const env = {
  DATABASE_URL: getEnv('DATABASE_URL', 'postgresql://user:pass@localhost:5432/velabeam'),
  AUTH_SECRET: getEnv('AUTH_SECRET', 'dev-secret-change-in-production'),
  NEXTAUTH_URL: getEnv('NEXTAUTH_URL', 'http://localhost:3000'),
  STRIPE_SECRET_KEY: getEnv('STRIPE_SECRET_KEY'),
  STRIPE_WEBHOOK_SECRET: getEnv('STRIPE_WEBHOOK_SECRET'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: getEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  GOOGLE_PLACES_API_KEY: getEnv('GOOGLE_PLACES_API_KEY'),
  OPENAI_API_KEY: getEnv('OPENAI_API_KEY'),
  NEXT_PUBLIC_MAP_TILE_URL: getEnv('NEXT_PUBLIC_MAP_TILE_URL', 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'),
};
