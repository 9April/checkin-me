import { prisma } from "@/lib/prisma";
import { getHostUserId } from "@/lib/session-host-id";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  ExternalLink,
  ChevronLeft,
  Trash2,
  Printer
} from 'lucide-react';
import TrashAction from "../components/TrashAction";
import { formatSubmittedAt } from "@/lib/format-submitted-at";

export default async function BookingsPage() {
  const hostId = await getHostUserId();
  if (!hostId) {
    redirect("/login");
  }

  const property = await prisma.property.findFirst({
    where: { hostId },
  });

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
          >
            <ChevronLeft size={24} />
          </Link>
          <h2 className="text-2xl font-bold text-[#111827]">All Submissions</h2>
        </div>
        <div className="text-sm text-gray-500 font-medium">
          Total: {bookings.length}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden min-w-0">
        <div className="md:hidden divide-y divide-[#E5E7EB]">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="p-4 space-y-3 min-w-0">
                <div className="min-w-0">
                  <div className="font-bold text-[#111827] break-words">{booking.guestName}</div>
                  <div className="text-xs text-[#6B7280] break-all">{booking.guestEmail}</div>
                </div>
                <div className="text-sm text-[#374151]">
                  {booking.checkin} → {booking.checkout}
                </div>
                <div className="text-xs text-[#6B7280]">
                  Submitted {formatSubmittedAt(new Date(booking.createdAt))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {booking.travelers.length} persons
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Link
                    href={`/agreement/${booking.id}`}
                    target="_blank"
                    className="text-sm font-bold text-blue-600 flex items-center gap-1"
                  >
                    View
                  </Link>
                  <Link 
                    href={`/agreement/${booking.id}`} 
                    target="_blank" 
                    className="text-sm text-gray-600 inline-flex items-center gap-1"
                  >
                    <Printer size={16} /> Print
                  </Link>
                  <Link
                    href={`/agreement/${booking.id}?download=1`}
                    target="_blank"
                    className="text-sm text-gray-500 font-medium"
                  >
                    Download
                  </Link>
                  <TrashAction bookingId={booking.id} mode="soft" />
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-12 text-center text-[#6B7280]">
              <div className="flex flex-col items-center gap-3">
                <FileText size={48} className="text-gray-200" />
                <div>
                  <p className="font-bold">No submissions found</p>
                  <p className="text-sm">Once guests fill out your form, they will appear here.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead className="bg-[#F9FAFB] text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Travelers</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {bookings.length > 0 ? bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-[#F9FAFB] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#111827]">{booking.guestName}</div>
                    <div className="text-xs text-[#6B7280]">{booking.guestEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-[#374151]">
                      {booking.checkin}
                    </div>
                    <div className="text-xs text-[#9CA3AF]">
                      to {booking.checkout}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {booking.travelers.length} persons
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#6B7280] whitespace-nowrap">
                    {formatSubmittedAt(new Date(booking.createdAt))}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 text-sm font-medium">
                      <Link
                        href={`/agreement/${booking.id}`}
                        target="_blank"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                        title='View Agreement'
                      >
                        <ExternalLink size={18} />
                        View
                      </Link>
                      <Link
                        href={`/agreement/${booking.id}`}
                        target="_blank"
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1"
                        title='Print Agreement'
                      >
                        <Printer size={18} />
                        Print
                      </Link>
                      <Link
                        href={`/agreement/${booking.id}?download=1`}
                        target="_blank"
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                        title='Download Agreement'
                      >
                        <Download size={18} />
                        Download
                      </Link>
                      <TrashAction bookingId={booking.id} mode="soft" />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#6B7280]">
                    <div className="flex flex-col items-center gap-3">
                      <FileText size={48} className="text-gray-200" />
                      <div>
                        <p className="font-bold">No submissions found</p>
                        <p className="text-sm">Once guests fill out your form, they will appear here.</p>
                      </div>
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
