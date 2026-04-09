import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetTemplates() {
  await prisma.property.updateMany({
    data: {
      pdfTemplate: null,
    }
  });
  console.log("PDF Templates Reset Successfully!");
}

resetTemplates().catch(console.error).finally(() => prisma.$disconnect());
