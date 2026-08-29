'use client';

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, X } from 'lucide-react';
import { resendBookingEmailsAction } from './actions';

interface ResendEmailActionProps {
  bookingId: string;
  initialGuestName: string;
  initialGuestEmail: string;
  initialCheckin: string;
  initialCheckout: string;
  initialWhatsapp?: string | null;
}

export default function ResendEmailAction({ 
  bookingId,
  initialGuestName,
  initialGuestEmail,
  initialCheckin,
  initialCheckout,
  initialWhatsapp
}: ResendEmailActionProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [guestName, setGuestName] = useState(initialGuestName);
  const [guestEmail, setGuestEmail] = useState(initialGuestEmail);
  const [checkin, setCheckin] = useState(initialCheckin);
  const [checkout, setCheckout] = useState(initialCheckout);
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp || '');

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setIsOpen(false);
    
    try {
      const res = await resendBookingEmailsAction(bookingId, {
        guestName,
        guestEmail,
        checkin,
        checkout,
        whatsapp: whatsapp || null
      });
      
      if (res && !res.success) {
        console.error("Resend failed:", res.error);
        alert(`Failed to resend: ${res.error}`);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
        return;
      }
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (e) {
      console.error(e);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  return (
    <>
      {status === 'success' && (
        <span className="flex items-center gap-1 text-xs font-medium text-green-600 px-2 py-2">
          <CheckCircle size={18} /> <span className="hidden md:inline">Sent</span>
        </span>
      )}

      {status === 'error' && (
        <span className="flex items-center gap-1 text-xs font-medium text-red-600 px-2 py-2">
          <AlertCircle size={18} /> <span className="hidden md:inline">Failed</span>
        </span>
      )}

      {status === 'idle' && (
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
          title="Resend confirmation emails"
        >
          <Mail size={18} />
          <span className="hidden md:inline">Resend</span>
        </button>
      )}

      {status === 'loading' && (
        <span className="flex items-center gap-1 text-xs font-medium text-gray-500 px-2 py-2">
          <svg className="animate-spin h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="hidden md:inline">Sending...</span>
        </span>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Verify Guest Details</h3>
                <p className="text-xs text-gray-500 mt-0.5">Edit information below before resending emails.</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleResend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Guest Name</label>
                <input 
                  type="text" 
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-600 outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Guest Email</label>
                <input 
                  type="email" 
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-600 outline-none transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Check-in Date</label>
                  <input 
                    type="text" 
                    value={checkin}
                    onChange={(e) => setCheckin(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-600 outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Checkout Date</label>
                  <input 
                    type="text" 
                    value={checkout}
                    onChange={(e) => setCheckout(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-600 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">WhatsApp Number</label>
                <input 
                  type="text" 
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+212..."
                  className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-600 outline-none transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 py-3.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 py-3.5 rounded-xl shadow-md transition-colors"
                >
                  Confirm & Resend
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
