import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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
import TrashAction from "./components/TrashAction";
import { formatSubmittedAt } from "@/lib/format-submitted-at";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Verify the user exists in the database to avoid P2003 (FK constraint violation)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    // If user doesn't exist in DB but has a session, they are in a stale state
    redirect("/login");
  }

  let property = await prisma.property.findFirst({
    where: { hostId: session.user.id }
  });

  // Auto-initialize a property if none exists
  if (!property) {
    const created = await prisma.property.create({
      data: {
        name: "My Property",
        hostId: session.user.id,
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
      propertyId: property?.id || '',
      deletedAt: null
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { travelers: true }
  });

  const totalBookings = await prisma.booking.count({
    where: { 
      propertyId: property?.id || '',
      deletedAt: null
    }
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

      {/* Recent Bookings — cards on small screens (no horizontal table scroll) */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden min-w-0">
        <div className="p-4 sm:p-6 border-b border-[#E5E7EB] flex items-center justify-between gap-3 min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-[#111827] truncate">Recent Submissions</h2>
          <Link href="/dashboard/bookings" className="text-sm font-medium text-[#EF4444] hover:underline shrink-0">
            View all
          </Link>
        </div>

        <div className="md:hidden divide-y divide-[#E5E7EB]">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="p-4 space-y-3 min-w-0">
                <div className="min-w-0">
                  <div className="font-medium text-[#111827] break-words">{booking.guestName}</div>
                  <div className="text-xs text-[#6B7280] break-all">{booking.guestEmail}</div>
                </div>
                <div className="text-sm text-[#374151]">
                  <span className="text-[#6B7280]">Stay </span>
                  {booking.checkin} → {booking.checkout}
                </div>
                <div className="text-xs text-[#6B7280]">
                  Submitted {formatSubmittedAt(new Date(booking.createdAt))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-50 text-green-600 border border-green-100">
                    COMPLETED
                  </span>
                  <span className="text-xs text-[#6B7280]">{booking.travelers.length} travelers</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
                  {booking.pdfUrl ? (
                    <>
                      <Link
                        href={`/api/pdf/${encodeURIComponent(booking.pdfUrl)}`}
                        target="_blank"
                        className="text-[#EF4444] hover:underline text-sm font-bold"
                      >
                        View PDF
                      </Link>
                      <Link
                        href={`/api/pdf/${encodeURIComponent(booking.pdfUrl)}`}
                        target="_blank"
                        className="text-gray-600 hover:text-gray-900 text-sm inline-flex items-center gap-1"
                        title="Print PDF"
                      >
                        <Printer size={16} />
                        Print
                      </Link>
                      <a
                        href={`/api/pdf/${encodeURIComponent(booking.pdfUrl)}?download=1`}
                        download={booking.pdfUrl}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                      >
                        Download
                      </a>
                    </>
                  ) : (
                    <span className="text-[#9CA3AF] text-sm italic">No PDF</span>
                  )}
                  <TrashAction bookingId={booking.id} mode="soft" />
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-12 text-center text-[#6B7280]">
              No bookings found yet.
              <div className="mt-2 text-sm">Share your check-in link to get started!</div>
            </div>
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead className="bg-[#F9FAFB] text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Check-in / Out</th>
                <th className="px-6 py-4">Travelers</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {bookings.length > 0 ? bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#111827]">{booking.guestName}</div>
                    <div className="text-xs text-[#6B7280]">{booking.guestEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#374151]">
                    {booking.checkin} - {booking.checkout}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#374151]">
                    {booking.travelers.length} persons
                  </td>
                  <td className="px-6 py-4 text-xs text-[#6B7280] whitespace-nowrap">
                    {formatSubmittedAt(new Date(booking.createdAt))}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-50 text-green-600 border border-green-100">
                      COMPLETED
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {booking.pdfUrl ? (
                        <>
                          <Link
                            href={`/api/pdf/${encodeURIComponent(booking.pdfUrl)}`}
                            target="_blank"
                            className="text-[#EF4444] hover:underline text-sm font-bold"
                          >
                            View
                          </Link>
                          <span className="text-gray-300">|</span>
                          <Link
                            href={`/api/pdf/${encodeURIComponent(booking.pdfUrl)}`}
                            target="_blank"
                            className="text-gray-600 hover:text-gray-900"
                            title="Print PDF"
                          >
                            <Printer size={16} />
                          </Link>
                          <span className="text-gray-300">|</span>
                          <a
                            href={`/api/pdf/${encodeURIComponent(booking.pdfUrl)}?download=1`}
                            download={booking.pdfUrl}
                            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                          >
                            Download
                          </a>
                        </>
                      ) : (
                        <span className="text-[#9CA3AF] text-sm italic mr-4">No PDF</span>
                      )}
                      <div className="border-l border-gray-100 pl-3">
                        <TrashAction bookingId={booking.id} mode="soft" />
                      </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6B7280]">
                    No bookings found yet.
                    <div className="mt-2 text-sm">
                      Share your check-in link to get started!
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
