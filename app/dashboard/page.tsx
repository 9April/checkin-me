import { prisma } from "@/lib/prisma";
import { getHostUserId } from "@/lib/session-host-id";
import {
  attachSlugToNewProperty,
  publicCheckInPath,
} from "@/lib/property-slug";
import {
  Users,
  ClipboardCheck,
  History,
  ArrowUpRight,
  UserPlus,
  Printer
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from "next/navigation";
import SubmissionsList from "./components/SubmissionsList";

export default async function DashboardPage() {
  const hostId = await getHostUserId();
  if (!hostId) {
    redirect("/login");
  }

  // Verify the user exists in the database to avoid P2003 (FK constraint violation)
  const user = await prisma.user.findUnique({
    where: { id: hostId }
  });

  if (!user) {
    // If user doesn't exist in DB but has a session, they are in a stale state
    redirect("/login");
  }

  let property = await prisma.property.findFirst({
    where: { hostId }
  });

  // Auto-initialize a property if none exists
  if (!property) {
    const created = await prisma.property.create({
      data: {
        name: "My Property",
        hostId,
        checkinTime: "15:00",
        checkoutTime: "11:00",
        houseRules: JSON.stringify([
          "1. No loud music after 10PM",
          "2. No smoking inside",
          "3. Pets allowed on request"
        ])
      }
    });
    property = await attachSlugToNewProperty(prisma, created.id, created.name);
  } else if (!property.slug) {
    property = await attachSlugToNewProperty(prisma, property.id, property.name);
  }

  const bookings = await prisma.booking.findMany({
    where: {
      propertyId: property.id,
      deletedAt: null,
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { travelers: true }
  });

  const totalBookings = await prisma.booking.count({
    where: {
      propertyId: property.id,
      deletedAt: null,
    },
  });

  const stats = [
    { name: 'Total Bookings', value: totalBookings, icon: ClipboardCheck, color: 'bg-blue-500' },
    { name: 'Recent Activity', value: bookings.length, icon: History, color: 'bg-purple-500' },
    { name: 'Properties', value: property ? 1 : 0, icon: ArrowUpRight, color: 'bg-green-500' },
  ];

  // We'll use a relative path for the frontend link to ensure it works on any host (localhost, ngrok, local IP)
  const checkInPath = property ? publicCheckInPath(property) : "/check-in";

  return (
    <div className="space-y-8 min-w-0 max-w-full">
      {/* Property Link Card */}
      <div className="bg-[#FEF2F2] p-4 sm:p-6 rounded-3xl border border-[#FEE2E2] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-6 min-w-0">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#EF4444] shadow-sm">
            <UserPlus size={24} />
          </div>
          <div>
            <h3 className="font-bold text-[#111827]">Fast Check-in Link</h3>
            <p className="text-sm text-[#6B7280]">Share this link with your guests before they arrive.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto overflow-hidden">
          <code className="bg-white px-4 py-2 rounded-xl text-xs sm:text-sm border border-[#E5E7EB] text-[#EF4444] font-mono flex-1 md:flex-none truncate">
            {checkInPath}
          </code>
          <Link
            href={checkInPath}
            target="_blank"
            className="px-4 py-2 bg-[#EF4444] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#DC2626] transition-colors"
          >
            Open Form
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E5E7EB] shadow-sm flex items-center gap-4 sm:gap-6">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-200 shrink-0`}>
              <stat.icon size={24} className="sm:size-[28px]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-[#6B7280] truncate">{stat.name}</p>
              <p className="text-xl sm:text-2xl font-bold text-[#111827]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Submissions client-side component */}
      <SubmissionsList 
        initialBookings={bookings as any} 
        title="Recent Submissions" 
        viewAllLink={true}
      />
    </div>
  );
}
