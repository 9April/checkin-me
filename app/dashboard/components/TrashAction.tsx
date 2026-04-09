'use client';

import { useState } from 'react';
import { Trash2, RotateCcw, Trash } from 'lucide-react';
import { softDeleteBooking, restoreBooking, permanentlyDeleteBooking } from '../trash/actions';

interface TrashActionProps {
  bookingId: string;
  mode?: 'soft' | 'restore' | 'permanent';
  onAction?: () => void;
}

export default function TrashAction({ bookingId, mode = 'soft', onAction }: TrashActionProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleAction() {
    if (mode === 'permanent' && !confirm('Are you sure you want to permanently delete this submission? This cannot be undone.')) {
      return;
    }

    setIsPending(true);
    try {
      if (mode === 'soft') await softDeleteBooking(bookingId);
      if (mode === 'restore') await restoreBooking(bookingId);
      if (mode === 'permanent') await permanentlyDeleteBooking(bookingId);
      
      if (onAction) onAction();
    } catch (error) {
      console.error('Trash action failed:', error);
      alert('Failed to perform action. Please try again.');
    } finally {
      setIsPending(false);
    }
  }

  if (mode === 'soft') {
    return (
      <button 
        onClick={handleAction}
        disabled={isPending}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors title='Move to Trash'"
        title="Move to Trash"
      >
        <Trash2 size={18} className={isPending ? 'animate-pulse' : ''} />
      </button>
    );
  }

  if (mode === 'restore') {
    return (
      <button 
        onClick={handleAction}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-green-600 hover:bg-green-50 rounded-lg transition-colors"
      >
        <RotateCcw size={14} className={isPending ? 'animate-spin' : ''} />
        Restore
      </button>
    );
  }

  return (
    <button 
      onClick={handleAction}
      disabled={isPending}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    >
      <Trash size={14} className={isPending ? 'animate-pulse' : ''} />
      Delete Permanently
    </button>
  );
}
