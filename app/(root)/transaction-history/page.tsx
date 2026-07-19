import HeaderBox from '@/components/headerBox';
import TransactionHistoryTable from '@/components/TransactionHistoryTable';
import { getLoggedInUser } from '@/lib/actions/auth.actions';
import { getTransactionsByUserId } from '@/lib/actions/bank.actions';

const TransactionHistory = async ({ searchParams }: { searchParams: { page?: string; query?: string } }) => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    return (
      <section className="transactions">
        <HeaderBox title="Transaction History" subtext="Please sign in to view your transaction history." />
      </section>
    );
  }

  const page = Number(searchParams.page) || 1;
  const query = searchParams.query || '';

  let transactions: Transaction[] = await getTransactionsByUserId({ userId: loggedIn.$id });

  if (query) {
    const lowerQuery = query.toLowerCase();
    transactions = transactions.filter(
      (t) =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.category.toLowerCase().includes(lowerQuery)
    );
  }

  return (
    <section className="transactions">
      <HeaderBox title="Transaction History" subtext="View all your transactions across all accounts." />

      <TransactionHistoryTable transactions={transactions} page={page} />
    </section>
  );
};

export default TransactionHistory;
