import TransactionTable from './TransactionTable'
import Pagination from './Pagination'

const TransactionHistoryTable = ({ transactions, page }: TransactionHistoryTableProps) => {
  const rowsPerPage = 10
  const totalPages = Math.ceil(transactions.length / rowsPerPage)
  const indexOfLastTransaction = page * rowsPerPage
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction)

  return (
    <div className="flex flex-col gap-6">
      <TransactionTable transactions={currentTransactions} />
      <Pagination page={page} totalPages={totalPages} />
    </div>
  )
}

export default TransactionHistoryTable
