'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  ExternalLink,
  Printer,
  ChevronLeft,
  ChevronRight,
  Search,
  X
} from 'lucide-react';
import { formatSubmittedAt } from '@/lib/format-submitted-at';
import { motion, AnimatePresence } from 'framer-motion';
import { updateGuestEmail } from './actions';
import ResendEmailAction from './ResendEmailAction';
import TrashAction from './TrashAction';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  checkin: string;
  checkout: string;
  createdAt: Date | string;
  travelers: Array<{
    id: string;
    name: string;
    country: string;
  }>;
}

interface SubmissionsListProps {
  initialBookings: Booking[];
  title?: string;
  viewAllLink?: boolean;
}

export default function SubmissionsList({ 
  initialBookings, 
  title = "Submissions",
  viewAllLink = false
}: SubmissionsListProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state if initialBookings changes (e.g. when database revalidates)
  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  // Handle local deletion so it instantly updates in the UI
  const handleDeleteSuccess = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const handleEditEmail = async (bookingId: string, currentEmail: string) => {
    const newEmail = window.prompt("Enter correct email address:", currentEmail);
    if (!newEmail || newEmail === currentEmail) return;
    
    // Optimistic update
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, guestEmail: newEmail } : b));
    
    const res = await updateGuestEmail(bookingId, newEmail);
    if (!res.success) {
      alert("Failed to update email: " + res.error);
      // Revert on failure
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, guestEmail: currentEmail } : b));
    }
  };

  const getWhatsAppLink = (booking: Booking) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cervice.online';
    const message = `Hello ${booking.guestName}, here is your digital check-in agreement: ${baseUrl}/agreement/${booking.id}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  // Filter logic
  const filteredBookings = bookings.filter(booking => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const guestName = (booking.guestName || '').toLowerCase();
    const guestEmail = (booking.guestEmail || '').toLowerCase();
    const checkin = (booking.checkin || '').toLowerCase();
    const checkout = (booking.checkout || '').toLowerCase();
    const travelersCount = booking.travelers.length.toString();

    return guestName.includes(term) ||
           guestEmail.includes(term) ||
           checkin.includes(term) ||
           checkout.includes(term) ||
           travelersCount.includes(term);
  });

  // Pagination calculations
  const itemsPerPage = 5;
  const totalItems = filteredBookings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Auto-correct page if search narrows the list
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <h2 className="text-base sm:text-lg font-bold text-[#111827]">{title}</h2>
          {viewAllLink && (
            <Link href="/dashboard/bookings" className="text-sm font-bold text-[#EF4444] hover:underline shrink-0">
              View all
            </Link>
          )}
        </div>

        {/* Beautiful Search/Filter Input */}
        <div className="relative w-full sm:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#EF4444] transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by guest, dates..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page to 1 when searching
            }}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5E7EB] hover:border-gray-300 focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/10 rounded-2xl text-sm outline-none transition-all text-[#111827]"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden min-w-0">
        <div className="md:hidden divide-y divide-[#E5E7EB]">
          <AnimatePresence>
            {paginatedBookings.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col"
              >
                {paginatedBookings.map((booking) => (
                  <motion.div 
                    key={booking.id} 
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 space-y-3 min-w-0"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-[#111827] break-words">{booking.guestName}</div>
                      <div className="text-xs text-[#6B7280] break-all flex items-center gap-2">
                        {booking.guestEmail}
                        <button 
                          onClick={() => handleEditEmail(booking.id, booking.guestEmail)}
                          className="text-blue-500 hover:text-blue-700 underline"
                          title="Edit Email"
                        >
                          Edit
                        </button>
                      </div>
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
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 border-t border-gray-50">
                      <Link
                        href={`/agreement/${booking.id}`}
                        target="_blank"
                        className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline"
                      >
                        View
                      </Link>
                      <ResendEmailAction bookingId={booking.id} />
                      <a 
                        href={getWhatsAppLink(booking)}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-green-600 inline-flex items-center gap-1 hover:text-green-800 transition-colors font-medium"
                      >
                        WhatsApp
                      </a>
                      <Link 
                        href={`/agreement/${booking.id}`} 
                        target="_blank" 
                        className="text-sm text-gray-600 inline-flex items-center gap-1 hover:text-gray-950 transition-colors"
                      >
                        <Printer size={16} /> Print
                      </Link>
                      <Link
                        href={`/agreement/${booking.id}?download=1`}
                        target="_blank"
                        className="text-sm text-gray-500 font-medium hover:text-gray-800 transition-colors"
                      >
                        Download
                      </Link>
                      <div className="ml-auto">
                        <TrashAction 
                          bookingId={booking.id} 
                          mode="soft" 
                          onAction={() => handleDeleteSuccess(booking.id)} 
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
            <div className="px-4 py-12 text-center text-[#6B7280]">
              <div className="flex flex-col items-center gap-3">
                <FileText size={48} className="text-gray-200" />
                <div>
                  <p className="font-bold">No submissions found</p>
                  <p className="text-xs mt-1">Try resetting your search filters or check-in forms.</p>
                </div>
              </div>
            </div>
          )}
          </AnimatePresence>
        </div>

        {/* Desktop tabular layout */}
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
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#F9FAFB] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#111827]">{booking.guestName}</div>
                      <div className="text-xs text-[#6B7280] flex items-center gap-2">
                        {booking.guestEmail}
                        <button 
                          onClick={() => handleEditEmail(booking.id, booking.guestEmail)}
                          className="text-blue-500 hover:text-blue-700 underline text-[10px]"
                          title="Edit Email"
                        >
                          Edit
                        </button>
                      </div>
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
                          <ResendEmailAction bookingId={booking.id} />
                          <a 
                            href={getWhatsAppLink(booking)}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-green-600 inline-flex items-center gap-1 hover:text-green-800 transition-colors font-medium"
                          >
                            WhatsApp
                          </a>
                          <Link 
                            href={`/agreement/${booking.id}`} 
                            target="_blank" 
                            className="text-[#6B7280] hover:text-[#111827] transition-colors p-1"
                            title="Print Agreement"
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
                        <TrashAction 
                          bookingId={booking.id} 
                          mode="soft" 
                          onAction={() => handleDeleteSuccess(booking.id)} 
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#6B7280]">
                    <div className="flex flex-col items-center gap-3">
                      <FileText size={48} className="text-gray-200" />
                      <div>
                        <p className="font-bold">No submissions found</p>
                        <p className="text-xs mt-1">Try resetting your search filters or check-in forms.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-[#E5E7EB] shadow-sm select-none">
          <div className="text-xs font-semibold text-gray-500">
            Showing <span className="text-gray-900 font-bold">{startIndex + 1}</span> to <span className="text-gray-900 font-bold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="text-gray-900 font-bold">{totalItems}</span> submissions
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page bubbles */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const isSelected = p === currentPage;
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                      isSelected 
                        ? 'bg-[#EF4444] text-white shadow-md shadow-red-100' 
                        : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
