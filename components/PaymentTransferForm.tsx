'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { createTransaction } from '@/lib/actions/transaction.actions';
import { getBank, getBankByAccountId } from '@/lib/actions/user.actions';
import { initiateTransfer } from '@/lib/actions/paystack.actions';
import { decryptId } from '@/lib/utils';

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
import { Textarea } from './ui/textarea';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(4, 'Transfer note is too short'),
  amount: z.string().min(1, 'Amount is required'),
  senderBank: z.string().min(1, 'Please select a valid bank account'),
  sharableId: z.string().min(8, 'Please select a valid sharable Id'),
});

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      amount: '',
      senderBank: '',
      sharableId: '',
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const receiverAccountId = decryptId(data.sharableId);
      const receiverBank = await getBankByAccountId({ accountId: receiverAccountId });
      const senderBank = await getBank({ documentId: data.senderBank });

      if (!receiverBank || !senderBank) throw new Error('Bank account not found');

      const amountInKobo = Math.round(parseFloat(data.amount) * 100);

      const transfer = await initiateTransfer(
        receiverBank.recipientCode,
        amountInKobo,
        data.name
      );

      if (transfer) {
        const transaction = {
          name: data.name,
          amount: data.amount,
          senderId: senderBank.userId,
          senderBankId: senderBank.$id,
          receiverId: receiverBank.userId,
          receiverBankId: receiverBank.$id,
          email: data.email,
        };

        const newTransaction = await createTransaction(transaction);

        if (newTransaction) {
          form.reset();
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Submitting create transfer request failed: ', error);
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
                  Select Source Bank
                </FormLabel>
                <FormDescription className="text-12 font-normal text-gray-600">
                  Select the bank account you want to transfer from
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
          name="name"
          render={({ field }) => (
            <FormItem className="payment-transfer_form-item">
              <div className="payment-transfer_form-content">
                <FormLabel className="text-14 font-medium text-gray-700">
                  Transfer Note
                </FormLabel>
                <FormDescription className="text-12 font-normal text-gray-600">
                  Please provide a short description of the transfer
                </FormDescription>
              </div>
              <div className="flex w-full flex-col">
                <FormControl>
                  <Textarea
                    placeholder="Write a short note here"
                    className="input-class"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-12 text-red-500" />
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">Bank account details</h2>
          <p className="text-16 font-normal text-gray-600">
            Enter the bank account details of the recipient
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="payment-transfer_form-item">
              <div className="payment-transfer_form-content">
                <FormLabel className="text-14 font-medium text-gray-700">
                  Recipient&apos;s Email Address
                </FormLabel>
                <FormDescription className="text-12 font-normal text-gray-600">
                  Enter the email address of the recipient
                </FormDescription>
              </div>
              <div className="flex w-full flex-col">
                <FormControl>
                  <Input placeholder="example@email.com" className="input-class" {...field} />
                </FormControl>
                <FormMessage className="text-12 text-red-500" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sharableId"
          render={({ field }) => (
            <FormItem className="payment-transfer_form-item">
              <div className="payment-transfer_form-content">
                <FormLabel className="text-14 font-medium text-gray-700">
                  Recipient&apos;s Sharable ID
                </FormLabel>
                <FormDescription className="text-12 font-normal text-gray-600">
                  Enter the sharable ID of the recipient
                </FormDescription>
              </div>
              <div className="flex w-full flex-col">
                <FormControl>
                  <Input placeholder="Enter the sharable ID" className="input-class" {...field} />
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
                  Enter the amount you want to transfer
                </FormDescription>
              </div>
              <div className="flex w-full flex-col">
                <FormControl>
                  <Input placeholder="e.g., 100.00" className="input-class" {...field} />
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
                <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
              </>
            ) : (
              'Transfer Funds'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentTransferForm;
