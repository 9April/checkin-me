import { prisma } from "@/lib/prisma";
import { getHostUserId } from "@/lib/session-host-id";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import SubmissionsList from "../components/SubmissionsList";
import { getActiveProperty } from "@/lib/active-property";

export default async function BookingsPage() {
  const hostId = await getHostUserId();
  if (!hostId) {
    redirect("/login");
  }

  const property = await getActiveProperty(hostId);

  const bookings = property
    ? await prisma.booking.findMany({
        where: {
          propertyId: property.id,
          deletedAt: null,
        },
        orderBy: { createdAt: 'desc' },
        include: { travelers: true },
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard" 
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
        >
          <ChevronLeft size={24} />
        </Link>
        <h2 className="text-2xl font-bold text-[#111827]">All Submissions</h2>
      </div>

      <SubmissionsList 
        initialBookings={bookings as any} 
        title="All Property Submissions" 
      />
    </div>
  );
}
