import HeaderBox from '@/components/headerBox';
import PaymentTransferForm from '@/components/PaymentTransferForm';
import { getLoggedInUser } from '@/lib/actions/auth.actions';
import { getAccounts } from '@/lib/actions/bank.actions';
import Image from 'next/image';

const Transfer = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    return (
      <section className="payment-transfer">
        <HeaderBox title="Payment Transfer" subtext="Please sign in to make a transfer." />
      </section>
    );
  }

  const accountsData = await getAccounts({ userId: loggedIn.$id });
  const accounts = accountsData?.data || [];

  return (
    <section className="payment-transfer">
      <HeaderBox
        title="Payment Transfer"
        subtext="Send money to other Horizon users instantly."
      />

      <div className="size-full pt-5 flex flex-col gap-6 max-w-[900px]">
        {/* Info banner */}
        <div className="flex items-start gap-4 rounded-xl bg-blue-50 border border-blue-100 p-5">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Image src="/icons/money-send.svg" width={20} height={20} alt="transfer" className="opacity-80" />
          </div>
          <div>
            <h3 className="text-14 font-semibold text-blue-900">How it works</h3>
            <p className="text-13 text-blue-700 mt-1">
              Enter the recipient&apos;s sharable ID and email address. The transfer will be processed
              through Paystack and the funds will arrive instantly.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <PaymentTransferForm accounts={accounts} />
        </div>
      </div>
    </section>
  );
};

export default Transfer;
