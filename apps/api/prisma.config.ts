import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/master/schema.prisma',
  migrations: {
    path: 'prisma/master/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
