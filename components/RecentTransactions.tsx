import Link from 'next/link'
import TransactionTable from './TransactionTable'

const RecentTransactions = ({ accounts, transactions, appwriteItemId, page }: RecentTransactionsProps) => {
  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link href="/transaction-history" className="view-all-btn">
          View all
        </Link>
      </header>
      <TransactionTable transactions={transactions.slice(0, 5)} />
    </section>
  )
}

export default RecentTransactions
