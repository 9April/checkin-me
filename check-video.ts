const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  const property = await prisma.property.findUnique({ where: { slug: 'khouzama07' } })
  console.log('Video URL:', property?.mediaVideoUrl)
}
main().finally(() => prisma.$disconnect())
