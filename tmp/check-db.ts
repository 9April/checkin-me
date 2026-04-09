import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const property = await prisma.property.findFirst();
  console.log('Property Fields:', Object.keys(property || {}));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
