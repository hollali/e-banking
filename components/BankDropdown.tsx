'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { formatAmount, formUrlQuery } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BankDropdown = ({ accounts = [], setValue, otherStyles }: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState(accounts[0] || null);

  const handleBankChange = (id: string) => {
    const account = accounts.find((account) => account.appwriteItemId === id);
    if (account) setSelected(account);

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'id',
      value: id,
    });
    router.push(newUrl, { scroll: false });

    if (setValue) setValue('senderBank', id);
  };

  return (
    <Select onValueChange={handleBankChange} defaultValue={selected?.appwriteItemId}>
      <SelectTrigger className={`w-full bg-white ${otherStyles}`}>
        <SelectValue placeholder="Select a bank" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectGroup>
          <SelectLabel className="text-14 text-gray-500">Select a bank to transfer from</SelectLabel>
          {accounts.map((account: Account) => (
            <SelectItem key={account.appwriteItemId} value={account.appwriteItemId} className="cursor-pointer">
              <div className="flex items-center gap-2">
                <Image src="/icons/connect-bank.svg" width={20} height={20} alt={account.name} />
                <div>
                  <p className="text-14 font-medium text-gray-900">{account.name}</p>
                  <p className="text-12 text-gray-500">{formatAmount(account.currentBalance)}</p>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default BankDropdown;
