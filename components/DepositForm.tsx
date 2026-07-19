'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { initiatePayment } from '@/lib/actions/paystack.actions';
import { getBank } from '@/lib/actions/user.actions';

import BankDropdown from './BankDropdown';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';

const formSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Amount must be greater than 0'
  ),
  senderBank: z.string().min(1, 'Please select a bank account'),
});

const DepositForm = ({ accounts, userEmail }: { accounts: Account[]; userEmail: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      senderBank: '',
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const amountInKobo = Math.round(parseFloat(data.amount) * 100);
      const reference = `deposit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      const result = await initiatePayment(userEmail, amountInKobo, reference);

      if (result && result.authorization_url) {
        window.location.href = result.authorization_url;
      }
    } catch (error) {
      console.error('Deposit initiation failed:', error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        <FormField
          control={form.control}
          name="senderBank"
          render={() => (
            <FormItem className="payment-transfer_form-item">
              <div className="payment-transfer_form-content">
                <FormLabel className="text-14 font-medium text-gray-700">
                  Select Bank Account
                </FormLabel>
                <FormDescription className="text-12 font-normal text-gray-600">
                  Select the bank account to fund
                </FormDescription>
              </div>
              <div className="flex w-full flex-col">
                <FormControl>
                  <BankDropdown accounts={accounts} setValue={form.setValue} otherStyles="!w-full" />
                </FormControl>
                <FormMessage className="text-12 text-red-500" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="payment-transfer_form-item">
              <div className="payment-transfer_form-content">
                <FormLabel className="text-14 font-medium text-gray-700">
                  Amount
                </FormLabel>
                <FormDescription className="text-12 font-normal text-gray-600">
                  Enter the amount you want to deposit
                </FormDescription>
              </div>
              <div className="flex w-full flex-col">
                <FormControl>
                  <Input placeholder="e.g., 10000.00" className="input-class" {...field} />
                </FormControl>
                <FormMessage className="text-12 text-red-500" />
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_btn-box">
          <Button type="submit" disabled={isLoading} className="payment-transfer_btn">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Processing...
              </>
            ) : (
              'Fund Account'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DepositForm;
