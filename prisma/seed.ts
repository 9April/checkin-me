import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const host = await prisma.user.upsert({
    where: { email: 'host@example.com' },
    update: {},
    create: {
      email: 'host@example.com',
      name: 'Test Host',
      password: 'password123', // In real app, hash this
    },
  })

  const property = await prisma.property.upsert({
    where: { id: 'test-property-1' },
    update: {},
    create: {
      id: 'test-property-1',
      name: 'Luxury Villa Test',
      hostId: host.id,
      houseRules: JSON.stringify([
        "1. No loud music after 10PM",
        "2. No smoking inside",
        "3. Pets allowed on request"
      ]),
      checkinTime: "15:00",
      checkoutTime: "11:00",
    },
  })

  console.log({ host, property })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
