import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Dropping all dynamic RLS policies in public schema ---')
  
  await prisma.$executeRawUnsafe(`
    DO $$ 
    DECLARE 
        pol RECORD;
    BEGIN
        FOR pol IN (
            SELECT policyname, tablename 
            FROM pg_policies 
            WHERE schemaname = 'public'
        ) LOOP
            EXECUTE 'DROP POLICY "' || pol.policyname || '" ON "' || pol.tablename || '"';
            RAISE NOTICE 'Dropped policy % on table %', pol.policyname, pol.tablename;
        END LOOP;
    END $$;
  `)
  
  console.log('Successfully dropped all public schema RLS policies!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error dropping policies:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
