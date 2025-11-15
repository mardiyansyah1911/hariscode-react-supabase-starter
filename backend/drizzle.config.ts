import type { Config } from 'drizzle-kit';

export default {
  schema: './src/models/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgresql://hariscode:password@localhost:5432/hariscode',
  },
  verbose: true,
  strict: true,
} satisfies Config;