import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/tenant/schema.prisma',
  migrations: {
    path: 'prisma/tenant/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
