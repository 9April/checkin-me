// app/success/page.tsx

import Link from 'next/link';

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; mailError?: string; emailSent?: string }>;
}) {
  const params = await searchParams;
  const bookingId = params.id;
  
  const emailFailed = Boolean(params.mailError);
  const emailSent = params.emailSent === '1';

  return (
    <main className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A1A1A] py-10 px-4 sm:px-6 flex flex-col items-center justify-start">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/10 p-8 sm:p-12 text-center space-y-8 mt-12">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mx-auto">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-serif tracking-tight text-[#1A1A1A]">Check-in completed</h1>
          <p className="text-[#6B7280] text-base leading-relaxed max-w-sm mx-auto">
            Your registration has been successfully saved. You can now view and print your luxury stay agreement.
          </p>
        </div>

        {emailSent && (
          <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-left flex gap-4">
            <svg className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-emerald-900 text-sm leading-relaxed">
              We&apos;ve sent a digital copy to your inbox. Please check your spam folder if you don&apos;t see it.
            </p>
          </div>
        )}

        {emailFailed && (
          <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl text-left flex gap-4">
            <svg className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-amber-900 text-sm leading-relaxed">
              Registration saved, but we couldn&apos;t send the confirmation email. You can still access your agreement below.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {bookingId ? (
            <Link
              href={`/agreement/${bookingId}`}
              className="inline-flex items-center justify-center gap-3 bg-[#1A1A1A] text-white px-8 py-5 rounded-xl font-medium shadow-lg transition-all active:scale-[0.98] hover:bg-black"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              View & Print Agreement
            </Link>
          ) : (
             <p className="text-red-500 text-sm">Agreement ID missing. Please contact host.</p>
          )}
          
          <Link
            href="/"
            className="text-sm font-medium text-gray-400 hover:text-gray-800 transition-colors py-2"
          >
            Close and return home
          </Link>
        </div>

        <p className="text-xs text-[#9CA3AF] pt-4">
          © 2026 Mamounia 08 | Secure Digital Registration
        </p>
      </div>
    </main>
  );
}
