import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  // definições de tabelas do DB
  schema: 'src/db/schema/*',
  out: 'src/db/migrations',
  // deixa todas as tabelas do banco e um padrão
  casing: 'snake_case',
})