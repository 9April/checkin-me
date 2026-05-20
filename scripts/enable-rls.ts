import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Enabling Row-Level Security (RLS) on all public tables ---')
  
  await prisma.$executeRawUnsafe(`
    DO $$ 
    DECLARE 
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'ALTER TABLE "' || r.tablename || '" ENABLE ROW LEVEL SECURITY;';
            RAISE NOTICE 'Enabled RLS on table %', r.tablename;
        END LOOP;
    END $$;
  `)
  
  console.log('Successfully enabled RLS on all tables in the public schema!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error enabling RLS:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
