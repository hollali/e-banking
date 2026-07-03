import HeaderBox from '@/components/headerBox';
import TotalBalanceBox from '@/components/totalBalanceBox';
import RightSidebar from '@/components/rightSidebar';
import RecentTransactions from '@/components/RecentTransactions';
import { getLoggedInUser } from '@/lib/actions/auth.actions';
import { getAccounts } from '@/lib/actions/bank.actions';

const Home = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    const guestUser: User = { firstName: 'Guest', lastName: '', email: '', $id: '0', id: '0', address: '', city: '', postalCode: '', dateOfBirth: '', ssn: '' };
    return (
      <section className="home">
        <div className="home-content">
          <header className="home-header">
            <HeaderBox type="greeting" title="Welcome" user="Guest" subtext="Please sign in to access your account and transactions." />
          </header>
        </div>
      </section>
    );
  }

  const accountsData = await getAccounts({ userId: loggedIn.$id });
  const accounts = accountsData?.data || [];
  const transactions: Transaction[] = [];

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn.firstName || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />
          <TotalBalanceBox
            accounts={accounts}
            totalBanks={accountsData?.totalBanks || 0}
            totalCurrentBalance={accountsData?.totalCurrentBalance || 0}
          />
        </header>
        <RecentTransactions
          accounts={accounts}
          transactions={transactions}
          appwriteItemId={accounts[0]?.appwriteItemId || ''}
          page={1}
        />
      </div>
      <RightSidebar user={loggedIn} transactions={transactions} banks={accounts} />
    </section>
  );
};

export default Home;
