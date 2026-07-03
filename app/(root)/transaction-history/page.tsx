import HeaderBox from '@/components/headerBox';
import TransactionHistoryTable from '@/components/TransactionHistoryTable';
import { getLoggedInUser } from '@/lib/actions/auth.actions';
import { getAccount } from '@/lib/actions/bank.actions';

const TransactionHistory = async ({ searchParams }: { searchParams: { id?: string; page?: string } }) => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    return (
      <section className="transactions">
        <HeaderBox title="Transaction History" subtext="Please sign in to view your transaction history." />
      </section>
    );
  }

  const appwriteItemId = searchParams.id || '';
  const page = Number(searchParams.page) || 1;

  let transactions: Transaction[] = [];

  if (appwriteItemId) {
    const accountData = await getAccount({ appwriteItemId });
    transactions = accountData?.transactions || [];
  }

  return (
    <section className="transactions">
      <HeaderBox title="Transaction History" subtext="View all your transactions across all accounts." />

      <TransactionHistoryTable transactions={transactions} page={page} />
    </section>
  );
};

export default TransactionHistory;
