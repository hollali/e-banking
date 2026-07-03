'use server';

import { getDb } from '@/lib/db';
import { transactions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { parseStringify } from '@/lib/utils';

function mapTransaction(txn: typeof transactions.$inferSelect) {
  return { ...txn, $id: txn.id, $createdAt: txn.createdAt.toISOString() };
}

export const createTransaction = async (transactionData: CreateTransactionProps) => {
  try {
    const [transaction] = await getDb().insert(transactions).values({
      name: transactionData.name,
      amount: transactionData.amount,
      senderId: transactionData.senderId,
      senderBankId: transactionData.senderBankId,
      receiverId: transactionData.receiverId,
      receiverBankId: transactionData.receiverBankId,
      email: transactionData.email,
    }).returning();

    return parseStringify(mapTransaction(transaction));
  } catch (error) {
    console.error('Error creating transaction:', error);
    return null;
  }
};

export const getTransactionsByBankId = async ({ bankId }: getTransactionsByBankIdProps) => {
  try {
    const result = await getDb().select()
      .from(transactions)
      .where(eq(transactions.senderBankId, bankId));

    return { documents: parseStringify(result.map(mapTransaction)) };
  } catch (error) {
    console.error('Error getting transactions by bank id:', error);
    return { documents: [] };
  }
};
