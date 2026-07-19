import { verifyPaymentFn } from '@/lib/actions/paystack.actions';
import { getLoggedInUser } from '@/lib/actions/auth.actions';
import Link from 'next/link';

const PaymentCallback = async ({ searchParams }: { searchParams: { reference?: string; trxref?: string } }) => {
  const reference = searchParams.reference || searchParams.trxref;
  const loggedIn = await getLoggedInUser();

  if (!reference) {
    return (
      <section className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-24 font-semibold text-gray-900 mb-4">Invalid Payment</h1>
          <p className="text-16 text-gray-600 mb-8">No payment reference found.</p>
          <Link href="/" className="form-btn">Return to Dashboard</Link>
        </div>
      </section>
    );
  }

  const result = await verifyPaymentFn(reference);

  if (result && result.status === 'success') {
    return (
      <section className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-32 text-green-600">✓</span>
          </div>
          <h1 className="text-24 font-semibold text-gray-900 mb-2">Payment Successful</h1>
          <p className="text-16 text-gray-600 mb-2">
            Your account has been funded with {result.amount ? `₦${(result.amount / 100).toLocaleString()}` : 'the deposited amount'}.
          </p>
          <p className="text-14 text-gray-500 mb-8">Reference: {reference}</p>
          <Link href="/" className="form-btn">Return to Dashboard</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-32 text-red-600">✕</span>
        </div>
        <h1 className="text-24 font-semibold text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-16 text-gray-600 mb-8">
          Your payment could not be verified. Please try again or contact support.
        </p>
        <Link href="/deposit" className="form-btn">Try Again</Link>
      </div>
    </section>
  );
};

export default PaymentCallback;
