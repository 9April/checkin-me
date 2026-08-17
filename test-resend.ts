const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { resendBookingEmailsAction } = require('./.next/server/app/dashboard/components/actions.js') || {};

async function test() {
  const booking = await prisma.booking.findFirst({
    orderBy: { createdAt: 'desc' }
  });
  if (!booking) {
    console.log("No bookings found");
    return;
  }
  console.log("Found booking:", booking.id);
  // We cannot easily run a server action outside of next.js context if it imports next headers etc.
  // Wait, getHostUserId() uses auth(). auth() relies on Next.js headers. So it will throw if run in node script!
}
test();
