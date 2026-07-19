'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from './ui/input';
import TransactionTable from './TransactionTable';
import Pagination from './Pagination';

const TransactionHistoryTable = ({ transactions, page }: TransactionHistoryTableProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams();
    if (value) params.set('query', value);
    params.set('page', '1');
    router.push(`/transaction-history?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <span className="text-14 text-gray-500">
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found
        </span>
      </div>
      <TransactionTable transactions={currentTransactions} />
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
};

export default TransactionHistoryTable;
