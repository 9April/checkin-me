// app/success/page.tsx

function decodeParam(s: string | undefined): string | undefined {
  if (!s) return undefined;
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ pdf?: string; mailError?: string; emailSent?: string }>;
}) {
  const params = await searchParams;
  const pdfUrl = params.pdf ? `/api/pdf/${params.pdf}` : '#';
  const mailError = decodeParam(params.mailError);
  const emailSent = params.emailSent === '1';
  const emailStatusUnknown = !emailSent && !mailError && !!params.pdf;

  return (
    <main className="p-8 max-w-xl mx-auto text-center space-y-6 text-[#222222] font-sans">
      <h1 className="text-2xl font-semibold text-[#222222]">Check-in completed</h1>
      <p className="text-[#717171]">
        Your signed agreement has been generated. Tap the button below to download it.
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
            Email sent
          </h3>
          <p className="text-emerald-900 text-sm leading-relaxed">
            Confirmation emails were delivered: one to the address you entered on the form, and one
            to the property admin (or the host account email if no admin email is set in the
            dashboard).
          </p>
          <p className="text-emerald-800/80 text-xs mt-2">
            Check your inbox and spam folder. If nothing appears, the host should verify SMTP
            settings in Vercel.
          </p>
        </div>
      )}

      {mailError && (
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
            Email could not be sent
          </h3>
          <p className="text-amber-900 text-sm font-medium">
            Your check-in was saved, but sending email failed:
          </p>
          <code className="block mt-3 font-mono text-xs bg-white p-3 border border-amber-200 rounded-lg text-amber-950 overflow-auto whitespace-pre-wrap break-words">
            {mailError}
          </code>
          <p className="text-amber-800 text-xs mt-3 leading-relaxed">
            Add <strong>SMTP_HOST</strong>, <strong>SMTP_USER</strong>, and <strong>SMTP_PASS</strong>{' '}
            in Vercel → Project → Settings → Environment Variables, then redeploy.
          </p>
        </div>
      )}

      {emailStatusUnknown && (
        <p className="text-gray-500 text-sm text-left bg-gray-50 border border-gray-200 rounded-xl p-4">
          Email delivery status isn&apos;t shown for this link. New submissions show a green
          &quot;Email sent&quot; notice when the server confirms delivery.
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

        <a
          href={pdfUrl}
          download
          className="inline-flex items-center justify-center gap-2 bg-white border border-[#222222] text-[#222222] hover:bg-[#F7F7F7] px-6 py-4 rounded-lg font-semibold transition-all active:scale-[0.98]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </a>
      </div>

      <p className="text-sm text-gray-500">
        You can close this page. A copy has been saved for the host.
      </p>
    </main>
  );
}
