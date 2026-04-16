// app/success/page.tsx

import PdfDownloadButton from '@/app/components/PdfDownloadButton';
import Link from 'next/link';

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ pdf?: string; mailError?: string; emailSent?: string }>;
}) {
  const params = await searchParams;
  const pdfUrl = params.pdf
    ? `/api/pdf/${encodeURIComponent(params.pdf)}`
    : '#';
  /** Present when email could not be sent (value may be `1` or legacy long messages). */
  const emailFailed = Boolean(params.mailError);
  const emailSent = params.emailSent === '1';
  const emailStatusUnknown = !emailSent && !emailFailed && !!params.pdf;

  return (
    <main className="min-h-screen bg-[#F7F7F7] font-sans text-[#222222] py-10 px-4 sm:px-6 flex flex-col items-center justify-start">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E8E8E8] shadow-xl shadow-gray-300/20 p-8 sm:p-10 text-center space-y-6">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl sm:text-3xl font-semibold text-[#222222] tracking-tight">Check-in completed</h1>
      <p className="text-[#717171] text-base leading-relaxed max-w-md mx-auto">
        Your signed agreement is ready. Use the buttons below to view or save a copy.
      </p>

      {emailSent && (
        <div
          role="status"
          className="bg-emerald-50 border-2 border-emerald-300 p-5 rounded-2xl text-left shadow-sm"
        >
          <h3 className="text-emerald-900 font-bold text-base mb-2 flex items-center gap-2">
            <svg
              className="w-6 h-6 shrink-0 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Confirmation sent
          </h3>
          <p className="text-emerald-900 text-sm leading-relaxed">
            We&apos;ve sent a confirmation to the email you provided. Check your inbox or spam folder.
          </p>
        </div>
      )}

      {emailFailed && (
        <div
          role="alert"
          className="bg-amber-50 border-2 border-amber-400 p-5 rounded-2xl text-left shadow-sm"
        >
          <h3 className="text-amber-900 font-bold text-base mb-2 flex items-center gap-2">
            <svg
              className="w-6 h-6 shrink-0 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Email not sent
          </h3>
          <p className="text-amber-900 text-sm leading-relaxed">
            Your check-in was saved successfully. We couldn&apos;t send a confirmation email right
            now — you can still view or download your copy below.
          </p>
        </div>
      )}

      {emailStatusUnknown && (
        <p className="text-gray-500 text-sm text-left bg-gray-50 border border-gray-200 rounded-xl p-4">
          If you expected a confirmation email, check your spam folder. Your registration is still
          saved.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-4 rounded-lg font-semibold shadow-md transition-all active:scale-[0.98]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Signed Copy
        </a>

        {params.pdf ? (
          <PdfDownloadButton
            href={pdfUrl}
            fileName={params.pdf}
            className="inline-flex items-center justify-center gap-2 bg-white border border-[#222222] text-[#222222] hover:bg-[#F7F7F7] px-6 py-4 rounded-lg font-semibold transition-all active:scale-[0.98] disabled:opacity-60"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </PdfDownloadButton>
        ) : null}

        {params.pdf ? (
          <Link
            href={`/agreement/${params.pdf.replace('Booking-', '').replace('.pdf', '')}`}
            className="inline-flex items-center justify-center gap-2 bg-[#FCFBF9] border border-[#A8987E] text-[#1A1A1A] hover:bg-[#F4F1EA] px-6 py-4 rounded-lg font-semibold transition-all active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Luxury Agreement
          </Link>
        ) : null}
      </div>

      <p className="text-sm text-[#717171]">
        You can close this page. A copy has been saved for the host.
      </p>
      </div>
    </main>
  );
}
