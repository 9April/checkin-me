// app/success/page.tsx
export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ pdf?: string }>;
}) {
  const params = await searchParams;
  const pdfUrl = params.pdf ? `/pdfs/${params.pdf}` : '#';

  return (
    <main className="p-8 max-w-xl mx-auto text-center space-y-6">
      <h1 className="text-2xl font-bold text-green-700">Check-in completed ✅</h1>
      <p className="text-gray-600">
        Your signed agreement has been generated. Tap the button below to download it.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={pdfUrl}
          target="_blank"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
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
          className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-2xl font-bold transition-all active:scale-[0.98]"
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