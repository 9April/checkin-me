'use client';

import { useState, useEffect } from 'react';
import { 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  X
} from 'lucide-react';
import TrashAction from './TrashAction';

interface DeletedBooking {
  id: string;
  guestName: string;
  guestEmail: string;
  deletedAt: Date | string | null;
}

interface TrashListProps {
  initialBookings: DeletedBooking[];
}

export default function TrashList({ initialBookings }: TrashListProps) {
  const [bookings, setBookings] = useState<DeletedBooking[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state if initialBookings changes
  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  // Handle local delete/restore action success
  const handleActionSuccess = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  // Filter bookings based on query
  const filteredBookings = bookings.filter(booking => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const guestName = (booking.guestName || '').toLowerCase();
    const guestEmail = (booking.guestEmail || '').toLowerCase();

    return guestName.includes(term) || guestEmail.includes(term);
  });

  // Pagination calculations
  const itemsPerPage = 5;
  const totalItems = filteredBookings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Auto-correct page if search narrows list
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="text-sm font-semibold text-gray-500">
          Showing <span className="text-gray-900 font-bold">{filteredBookings.length}</span> of <span className="text-gray-900 font-bold">{bookings.length}</span> trashed items
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-80 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search trash by guest..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5E7EB] hover:border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 rounded-2xl text-sm outline-none transition-all text-[#111827]"
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
        
        {/* Mobile card layout */}
        <div className="md:hidden divide-y divide-[#E5E7EB]">
          {paginatedBookings.length > 0 ? (
            paginatedBookings.map((booking) => (
              <div key={booking.id} className="p-4 space-y-3 min-w-0 animate-in fade-in duration-200">
                <div className="min-w-0">
                  <div className="font-bold text-[#111827] break-words">{booking.guestName}</div>
                  <div className="text-xs text-[#6B7280] break-all">{booking.guestEmail}</div>
                </div>
                <div className="text-xs text-[#6B7280]">
                  Deleted {booking.deletedAt ? new Date(booking.deletedAt).toLocaleString() : 'N/A'}
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-50">
                  <TrashAction 
                    bookingId={booking.id} 
                    mode="restore" 
                    onAction={() => handleActionSuccess(booking.id)} 
                  />
                  <div className="w-px h-4 bg-gray-200" />
                  <TrashAction 
                    bookingId={booking.id} 
                    mode="permanent" 
                    onAction={() => handleActionSuccess(booking.id)} 
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-16 text-center text-[#6B7280]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <Trash2 size={32} />
                </div>
                <div>
                  <p className="font-bold text-gray-500">No trashed items found</p>
                  <p className="text-sm mt-1">Try resetting your search query.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop table layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left min-w-[520px]">
            <thead className="bg-[#F9FAFB] text-xs font-bold text-[#6B7280] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Deleted On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-red-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#111827]">{booking.guestName}</div>
                      <div className="text-xs text-[#6B7280]">{booking.guestEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#6B7280]">
                      {booking.deletedAt ? new Date(booking.deletedAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <TrashAction 
                          bookingId={booking.id} 
                          mode="restore" 
                          onAction={() => handleActionSuccess(booking.id)} 
                        />
                        <div className="w-px h-4 bg-gray-200" />
                        <TrashAction 
                          bookingId={booking.id} 
                          mode="permanent" 
                          onAction={() => handleActionSuccess(booking.id)} 
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center text-[#6B7280]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <Trash2 size={32} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-500">No trashed items found</p>
                        <p className="text-sm mt-1">Try resetting your search query.</p>
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
            Showing <span className="text-gray-900 font-bold">{startIndex + 1}</span> to <span className="text-gray-900 font-bold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="text-gray-900 font-bold">{totalItems}</span> trashed items
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>

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
                        ? 'bg-red-500 text-white shadow-md shadow-red-100' 
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
