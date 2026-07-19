'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send, User, Mail, Hash, DollarSign, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { createTransaction } from '@/lib/actions/transaction.actions';
import { getBank, getBankByAccountId } from '@/lib/actions/user.actions';
import { initiateTransfer } from '@/lib/actions/paystack.actions';
import { decryptId, formatAmount } from '@/lib/utils';

import BankDropdown from './BankDropdown';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
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
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Amount must be greater than 0'
  ),
  senderBank: z.string().min(1, 'Please select a valid bank account'),
  sharableId: z.string().min(8, 'Please enter a valid sharable ID'),
});

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState(false);

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

  const watchAmount = form.watch('amount');
  const parsedAmount = watchAmount && !isNaN(parseFloat(watchAmount)) ? parseFloat(watchAmount) : 0;

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setTransferError(null);
    setTransferSuccess(false);

    try {
      const receiverAccountId = decryptId(data.sharableId);
      const receiverBank = await getBankByAccountId({ accountId: receiverAccountId });
      const senderBank = await getBank({ documentId: data.senderBank });

      if (!receiverBank || !senderBank) {
        setTransferError('Bank account not found. Please check the recipient details.');
        setIsLoading(false);
        return;
      }

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
          setTransferSuccess(true);
          setTimeout(() => {
            form.reset();
            router.push('/');
          }, 2000);
        }
      } else {
        setTransferError('Transfer failed. Please check your balance and try again.');
      }
    } catch (error) {
      setTransferError('An error occurred during the transfer. Please try again.');
    }

    setIsLoading(false);
  };

  if (transferSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h3 className="text-18 font-semibold text-gray-900 mb-1">Transfer Successful!</h3>
        <p className="text-14 text-gray-500">Redirecting you to the dashboard...</p>
        <Loader2 size={20} className="animate-spin mt-4 text-gray-400" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        {/* Error banner */}
        {transferError && (
          <div className="mx-6 mt-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-sm font-bold">!</span>
            </div>
            <p className="text-14 text-red-700">{transferError}</p>
          </div>
        )}

        {/* Source Bank Section */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
              <Send size={14} className="text-blue-600" />
            </div>
            <h3 className="text-15 font-semibold text-gray-900">From</h3>
          </div>
          <FormField
            control={form.control}
            name="senderBank"
            render={() => (
              <FormItem>
                <FormLabel className="text-13 font-medium text-gray-500">
                  Source Account
                </FormLabel>
                <FormControl>
                  <BankDropdown accounts={accounts} setValue={form.setValue} otherStyles="!w-full !h-12 !rounded-xl" />
                </FormControl>
                <FormMessage className="text-12" />
              </FormItem>
            )}
          />
        </div>

        <div className="mx-6 border-t border-gray-100" />

        {/* Amount Section */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign size={14} className="text-green-600" />
            </div>
            <h3 className="text-15 font-semibold text-gray-900">Amount</h3>
          </div>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-13 font-medium text-gray-500">
                  Transfer Amount
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                    <Input
                      placeholder="0.00"
                      className="!h-12 !rounded-xl pl-8 text-lg font-semibold"
                      {...field}
                    />
                  </div>
                </FormControl>
                {parsedAmount > 0 && (
                  <p className="text-12 text-gray-400 mt-1">
                    You will send {formatAmount(parsedAmount)}
                  </p>
                )}
                <FormMessage className="text-12" />
              </FormItem>
            )}
          />
        </div>

        <div className="mx-6 border-t border-gray-100" />

        {/* Recipient Section */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
              <User size={14} className="text-purple-600" />
            </div>
            <h3 className="text-15 font-semibold text-gray-900">Recipient</h3>
          </div>

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="sharableId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-13 font-medium text-gray-500">
                    Sharable ID
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Paste the recipient's sharable ID"
                        className="!h-12 !rounded-xl pl-11"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-12" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-13 font-medium text-gray-500">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="recipient@email.com"
                        className="!h-12 !rounded-xl pl-11"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-12" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="mx-6 border-t border-gray-100" />

        {/* Note Section */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <FileText size={14} className="text-amber-600" />
            </div>
            <h3 className="text-15 font-semibold text-gray-900">Note</h3>
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-13 font-medium text-gray-500">
                  Transfer Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What is this transfer for?"
                    className="!rounded-xl min-h-[80px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-12" />
              </FormItem>
            )}
          />
        </div>

        {/* Submit */}
        <div className="px-6 pb-6 pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full !h-13 !rounded-xl text-15 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-200 transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 size={20} className="animate-spin" />
                Processing Transfer...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send size={18} />
                Send {parsedAmount > 0 ? formatAmount(parsedAmount) : 'Money'}
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentTransferForm;
