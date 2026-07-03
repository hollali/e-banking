import { formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from '@/lib/utils'
import CategoryBadge from './CategoryBadge'

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left text-14 font-medium text-gray-500 py-3 px-2">Transaction</th>
            <th className="text-left text-14 font-medium text-gray-500 py-3 px-2">Amount</th>
            <th className="text-left text-14 font-medium text-gray-500 py-3 px-2">Status</th>
            <th className="text-left text-14 font-medium text-gray-500 py-3 px-2">Date</th>
            <th className="text-left text-14 font-medium text-gray-500 py-3 px-2 max-md:hidden">Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t: Transaction) => {
            const status = getTransactionStatus(new Date(t.date))
            const amount = formatAmount(t.amount)

            const isDebit = t.type === 'debit'

            return (
              <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-12 font-semibold text-gray-600">
                        {t.name ? t.name[0].toUpperCase() : 'T'}
                      </span>
                    </div>
                    <div>
                      <p className="text-14 font-medium text-gray-900 truncate max-w-[200px]">
                        {t.name}
                      </p>
                      <p className="text-12 text-gray-500 md:hidden">{formatDateTime(new Date(t.date)).dateOnly}</p>
                    </div>
                  </div>
                </td>
                <td className={`py-4 px-2 text-14 font-semibold ${isDebit ? 'text-red-600' : 'text-green-600'}`}>
                  {isDebit ? `-${amount}` : amount}
                </td>
                <td className="py-4 px-2">
                  <CategoryBadge category={status} />
                </td>
                <td className="py-4 px-2 text-14 text-gray-600 max-md:hidden">
                  {formatDateTime(new Date(t.date)).dateOnly}
                </td>
                <td className="py-4 px-2 max-md:hidden">
                  <CategoryBadge category={t.category || 'Other'} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionTable
