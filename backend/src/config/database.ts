import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import env from './env';

// Create postgres client
const connectionString = env.DATABASE_URL;
const client = postgres(connectionString, {
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle instance
export const db = drizzle(client);

// Export for migration usage
export { client };

export default db;