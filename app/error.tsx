'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-24 font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-16 text-gray-600 mb-8">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button onClick={reset} className="form-btn">
          Try Again
        </button>
      </div>
    </section>
  );
}
