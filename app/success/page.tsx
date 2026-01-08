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

      <a
        href={pdfUrl}
        download
        className="inline-flex items-center gap-2 btn bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m6 3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Download PDF
      </a>

      <p className="text-sm text-gray-500">
        You can close this page. A copy has been saved for the host.
      </p>
    </main>
  );
}