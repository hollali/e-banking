import HeaderBox from '@/components/headerBox';
import PaymentTransferForm from '@/components/PaymentTransferForm';
import { getLoggedInUser } from '@/lib/actions/auth.actions';
import { getAccounts } from '@/lib/actions/bank.actions';

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
        subtext="Send money to other Horizon users through their sharable ID."
      />

      <section className="size-full pt-5">
        <PaymentTransferForm accounts={accounts} />
      </section>
    </section>
  );
};

export default Transfer;
