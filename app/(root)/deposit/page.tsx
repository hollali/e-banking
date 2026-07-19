import HeaderBox from '@/components/headerBox';
import DepositForm from '@/components/DepositForm';
import { getLoggedInUser } from '@/lib/actions/auth.actions';
import { getAccounts } from '@/lib/actions/bank.actions';

const Deposit = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    return (
      <section className="payment-transfer">
        <HeaderBox title="Fund Account" subtext="Please sign in to fund your account." />
      </section>
    );
  }

  const accountsData = await getAccounts({ userId: loggedIn.$id });
  const accounts = accountsData?.data || [];

  return (
    <section className="payment-transfer">
      <HeaderBox
        title="Fund Account"
        subtext="Deposit funds into your account via Paystack."
      />

      <section className="size-full pt-5">
        <DepositForm accounts={accounts} userEmail={loggedIn.email} />
      </section>
    </section>
  );
};

export default Deposit;
