import { prisma } from "@/lib/prisma";
import { getHostUserId } from "@/lib/session-host-id";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { 
  ChevronLeft,
  Info
} from 'lucide-react';
import TrashList from "../components/TrashList";

export default async function TrashPage() {
  const hostId = await getHostUserId();
  if (!hostId) {
    redirect("/login");
  }

  const property = await prisma.property.findFirst({
    where: { hostId },
  });

  const deletedBookings = property
    ? await prisma.booking.findMany({
        where: {
          propertyId: property.id,
          deletedAt: { not: null },
        },
        orderBy: { deletedAt: 'desc' },
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

      <TrashList initialBookings={deletedBookings as any} />
    </div>
  );
}
