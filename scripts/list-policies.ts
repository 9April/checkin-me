import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Current RLS Policies in public schema ---')
  
  const policies = await prisma.$queryRawUnsafe(`
    SELECT tablename, policyname, cmd, roles, qual, with_check 
    FROM pg_policies 
    WHERE schemaname = 'public';
  `)
  
  console.log(JSON.stringify(policies, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error listing policies:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
