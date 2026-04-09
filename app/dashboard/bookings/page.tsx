import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  ExternalLink,
  ChevronLeft,
  Trash2
} from 'lucide-react';
import TrashAction from "../components/TrashAction";

export default async function BookingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const property = await prisma.property.findFirst({
    where: { hostId: session.user.id }
  });

  const bookings = await prisma.booking.findMany({
    where: { 
      propertyId: property?.id || '',
      deletedAt: null
    },
    orderBy: { createdAt: 'desc' },
    include: { travelers: true }
  });

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

      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
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
                  <td className="px-6 py-4 text-xs text-[#6B7280]">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {booking.pdfUrl ? (
                         <>
                          <Link
                            href={`/pdfs/${booking.pdfUrl}`}
                            target="_blank"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title='View PDF'
                          >
                            <ExternalLink size={18} />
                          </Link>
                          <a
                            href={`/pdfs/${booking.pdfUrl}`}
                            download
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border-r pr-2 py-2"
                            title="Download PDF"
                          >
                            <Download size={18} />
                          </a>
                         </>
                      ) : (
                        <span className="text-xs italic text-gray-400 mr-2">PDF Missing</span>
                      )}
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
