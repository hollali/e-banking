'use server';

import { eq, or, desc } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { bankAccounts, transactions as transactionsSchema } from '@/lib/db/schema';
import { parseStringify } from '@/lib/utils';
import { getBanks, getBank } from './user.actions';

export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    const banks = await getBanks({ userId });

    const accounts = banks?.map((bank: Bank) => ({
      id: bank.accountId,
      availableBalance: 0,
      currentBalance: 0,
      institutionId: bank.bankId,
      name: bank.virtualBankName || 'Paystack Account',
      officialName: `${bank.virtualBankName} - ${bank.virtualAccountNumber}`,
      mask: bank.virtualAccountNumber?.slice(-4),
      type: 'depository',
      subtype: 'checking',
      appwriteItemId: bank.$id,
      sharableId: bank.sharableId,
    })) || [];

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total: number, account: Account) => total + account.currentBalance, 0);

    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error('Error getting accounts:', error);
    return null;
  }
};

export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    const bank = await getBank({ documentId: appwriteItemId });

    const transferTransactionsData = await getDb().select()
      .from(transactionsSchema)
      .where(
        or(
          eq(transactionsSchema.senderBankId, bank.id),
          eq(transactionsSchema.receiverBankId, bank.id)
        )
      )
      .orderBy(desc(transactionsSchema.createdAt));

    const transferTransactions = transferTransactionsData.map(
      (transferData) => ({
        id: transferData.id,
        $id: transferData.id,
        name: transferData.name,
        amount: parseFloat(transferData.amount),
        date: transferData.createdAt.toISOString(),
        paymentChannel: 'transfer',
        category: 'Transfer',
        type: transferData.senderBankId === bank.id ? 'debit' : 'credit',
        $createdAt: transferData.createdAt.toISOString(),
        channel: 'transfer',
        senderBankId: transferData.senderBankId,
        receiverBankId: transferData.receiverBankId,
        pending: transferData.status === 'pending',
        accountId: transferData.senderBankId === bank.id ? transferData.senderBankId : transferData.receiverBankId,
        image: '',
      })
    );

    const account = {
      id: bank.accountId,
      availableBalance: 0,
      currentBalance: 0,
      institutionId: bank.bankId,
      name: bank.virtualBankName || 'Paystack Account',
      officialName: `${bank.virtualBankName} - ${bank.virtualAccountNumber}`,
      mask: bank.virtualAccountNumber?.slice(-4),
      type: 'depository' as const,
      subtype: 'checking' as const,
      appwriteItemId: bank.id,
    };

    return parseStringify({
      data: account,
      transactions: transferTransactions,
    });
  } catch (error) {
    console.error('Error getting account:', error);
    return null;
  }
};

export const getTransactionsByUserId = async ({ userId }: { userId: string }) => {
  try {
    const userBanks = await getDb().select()
      .from(bankAccounts)
      .where(eq(bankAccounts.userId, userId));

    if (!userBanks.length) return parseStringify([]);

    const bankIds = userBanks.map((b) => b.id);

    const transactionsData = await getDb().select()
      .from(transactionsSchema)
      .where(
        or(
          ...bankIds.map((id) => eq(transactionsSchema.senderBankId, id)),
          ...bankIds.map((id) => eq(transactionsSchema.receiverBankId, id))
        )
      )
      .orderBy(desc(transactionsSchema.createdAt));

    const transactions = transactionsData.map((txn) => ({
      id: txn.id,
      $id: txn.id,
      name: txn.name,
      amount: parseFloat(txn.amount),
      date: txn.createdAt.toISOString(),
      paymentChannel: 'transfer',
      category: 'Transfer',
      type: bankIds.includes(txn.senderBankId) ? 'debit' : 'credit',
      $createdAt: txn.createdAt.toISOString(),
      channel: 'transfer',
      senderBankId: txn.senderBankId,
      receiverBankId: txn.receiverBankId,
      pending: txn.status === 'pending',
      accountId: bankIds.includes(txn.senderBankId) ? txn.senderBankId : txn.receiverBankId,
      image: '',
    }));

    return parseStringify(transactions);
  } catch (error) {
    console.error('Error getting transactions by user id:', error);
    return [];
  }
};
