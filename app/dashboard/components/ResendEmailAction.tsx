'use client';

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { resendBookingEmailsAction } from './actions';

export default function ResendEmailAction({ bookingId }: { bookingId: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleResend() {
    if (status === 'loading') return;
    setStatus('loading');
    try {
      const res = await resendBookingEmailsAction(bookingId);
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

  if (status === 'success') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-green-600 px-2 py-2">
        <CheckCircle size={18} /> <span className="hidden md:inline">Sent</span>
      </span>
    );
  }

  if (status === 'error') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-red-600 px-2 py-2">
        <AlertCircle size={18} /> <span className="hidden md:inline">Failed</span>
      </span>
    );
  }

  return (
    <button 
      onClick={handleResend}
      disabled={status === 'loading'}
      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
      title="Resend confirmation emails"
    >
      <Mail size={18} className={status === 'loading' ? 'animate-pulse' : ''} />
      <span className={status === 'loading' ? 'hidden md:inline' : 'hidden md:inline'}>
        {status === 'loading' ? 'Sending...' : 'Resend'}
      </span>
    </button>
  );
}
