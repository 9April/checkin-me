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
      await resendBookingEmailsAction(bookingId);
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
      <span className="flex items-center gap-1 text-xs font-medium text-green-600 px-2 py-1">
        <CheckCircle size={14} /> Sent
      </span>
    );
  }

  if (status === 'error') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-red-600 px-2 py-1">
        <AlertCircle size={14} /> Failed
      </span>
    );
  }

  return (
    <button 
      onClick={handleResend}
      disabled={status === 'loading'}
      className="text-sm font-medium text-blue-600 flex items-center gap-1 hover:underline disabled:opacity-50"
      title="Resend confirmation emails"
    >
      <Mail size={16} className={status === 'loading' ? 'animate-pulse' : ''} />
      {status === 'loading' ? 'Sending...' : 'Resend Email'}
    </button>
  );
}
