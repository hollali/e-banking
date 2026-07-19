import BankCard from '@/components/bankCard';
import HeaderBox from '@/components/headerBox';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/auth.actions';
import BankActions from '@/components/BankActions';

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    return (
      <section className="my-banks">
        <HeaderBox title="My Bank Accounts" subtext="Please sign in to view your bank accounts." />
      </section>
    );
  }

  const accountsData = await getAccounts({ userId: loggedIn.$id });
  const accounts = accountsData?.data || [];

  return (
    <section className="my-banks">
      <HeaderBox title="My Bank Accounts" subtext="Manage your linked bank accounts." />

      <div className="space-y-4">
        <h2 className="header-2">Your Virtual Accounts</h2>
        <p className="text-14 text-gray-600">
          These are your Paystack virtual accounts. Use them to receive payments directly.
        </p>

        <div className="flex flex-wrap gap-6">
          {accounts.map((account: Account) => (
            <div key={account.appwriteItemId} className="flex flex-col gap-2">
              <BankCard account={account} userName={loggedIn.firstName} showBalance={true} />
              <BankActions bankId={account.appwriteItemId} userId={loggedIn.$id} />
            </div>
          ))}
        </div>

        {accounts.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-12">
            <p className="text-16 text-gray-500">No bank accounts linked yet.</p>
            <p className="text-14 text-gray-400">
              Sign up and connect a virtual account to get started.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBanks;
