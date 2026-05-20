import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Revoking API access to all public tables for anon and authenticated roles ---')
  
  await prisma.$executeRawUnsafe(`
    DO $$ 
    DECLARE 
        r RECORD;
    BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'REVOKE ALL ON TABLE "' || r.tablename || '" FROM anon, authenticated, public;';
            RAISE NOTICE 'Revoked permissions on table %', r.tablename;
        END LOOP;
    END $$;
  `)
  
  console.log('Successfully secured all public tables from anonymous API exposure!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error securing tables:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
