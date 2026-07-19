'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-64 font-bold text-gray-200 mb-4">404</h2>
        <h1 className="text-24 font-semibold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-16 text-gray-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="form-btn">
          Return to Dashboard
        </Link>
      </div>
    </section>
  );
}
