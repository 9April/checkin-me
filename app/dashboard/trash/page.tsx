import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { 
  Trash2, 
  ChevronLeft,
  Info,
  History
} from 'lucide-react';
import TrashAction from "../components/TrashAction";

export default async function TrashPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const property = await prisma.property.findFirst({
    where: { hostId: session.user.id }
  });

  const deletedBookings = await prisma.booking.findMany({
    where: { 
      propertyId: property?.id || '',
      deletedAt: { not: null }
    },
    orderBy: { deletedAt: 'desc' },
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
          <h2 className="text-2xl font-bold text-[#111827]">Trash</h2>
        </div>
        <div className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
          {deletedBookings.length} items in trash
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-4">
        <div className="text-blue-500 pt-0.5"><Info size={20} /></div>
        <p className="text-sm text-blue-800 leading-relaxed">
          Items in the trash are hidden from your main dashboard but not deleted. You can **Restore** them at any time or **Delete Permanently** if you no longer need them.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F9FAFB] text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Deleted On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {deletedBookings.length > 0 ? deletedBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-red-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#111827]">{booking.guestName}</div>
                    <div className="text-xs text-[#6B7280]">{booking.guestEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#6B7280]">
                    {booking.deletedAt ? new Date(booking.deletedAt!).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <TrashAction bookingId={booking.id} mode="restore" />
                      <div className="w-px h-4 bg-gray-200" />
                      <TrashAction bookingId={booking.id} mode="permanent" />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center text-[#6B7280]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <Trash2 size={32} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-500">Your trash is empty</p>
                        <p className="text-sm">Deleted submissions will appear here.</p>
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
