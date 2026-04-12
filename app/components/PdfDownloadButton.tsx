'use client';

import { useState } from 'react';

type Props = {
  /** Same-origin PDF URL (e.g. `/api/pdf/Booking-….pdf` or with `?download=1`). */
  href: string;
  /** Suggested filename for the saved file (e.g. `Booking-abc.pdf`). */
  fileName: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Fetches the PDF as a blob and triggers a file download. Mobile Safari often
 * ignores `<a download>` for navigations; saving a blob avoids opening the in-app PDF viewer.
 */
export default function PdfDownloadButton({
  href,
  fileName,
  className,
  children,
}: Props) {
  const [busy, setBusy] = useState(false);

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const safeName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    try {
      const res = await fetch(href, { credentials: 'same-origin', cache: 'no-store' });
      if (!res.ok) {
        window.location.href = href.includes('?') ? href : `${href}?download=1`;
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = safeName;
      a.rel = 'noopener';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.location.href = href.includes('?') ? href : `${href}?download=1`;
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={busy} className={className}>
      {children}
    </button>
  );
}
