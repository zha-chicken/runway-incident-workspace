import type {NextConfig} from 'next';
const config: NextConfig = {
  output: 'standalone',
  turbopack: {root: process.cwd()},
  outputFileTracingExcludes: {'/*': ['./.env*', './runtime/**', './output/**', './evals/results/private/**']},
  serverExternalPackages: ['better-sqlite3'],
  poweredByHeader: false
};
export default config;
