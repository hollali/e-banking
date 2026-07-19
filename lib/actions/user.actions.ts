'use server';

import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { users, bankAccounts } from '@/lib/db/schema';
import { parseStringify, encryptId } from '@/lib/utils';
import { createPaystackCustomer, createDedicatedVirtualAccountFn, createTransferRecipientFn } from './paystack.actions';

function mapUser(user: typeof users.$inferSelect) {
  return { ...user, $id: user.id };
}

function mapBank(bank: typeof bankAccounts.$inferSelect) {
  return { ...bank, $id: bank.id, accessToken: bank.recipientCode, accountId: bank.virtualAccountNumber, bankId: bank.virtualBankName, fundingSourceUrl: bank.recipientCode };
}

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const [user] = await getDb().select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return null;
    return parseStringify(mapUser(user));
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

export const setupPaystackAccount = async (user: { id: string; email: string; firstName: string; lastName: string }) => {
  try {
    const customer = await createPaystackCustomer(user.email, user.firstName, user.lastName);
    if (!customer) throw new Error('Failed to create Paystack customer');

    const virtualAccount = await createDedicatedVirtualAccountFn(customer.customer_code);
    if (!virtualAccount) throw new Error('Failed to create virtual account');

    const recipient = await createTransferRecipientFn(
      `${user.firstName} ${user.lastName}`,
      virtualAccount.account_number,
      virtualAccount.bank.slug || 'wema-bank'
    );
    if (!recipient) throw new Error('Failed to create transfer recipient');

    await getDb().update(users).set({ paystackCustomerCode: customer.customer_code }).where(eq(users.id, user.id));

    const sharableId = encryptId(user.id);

    const [bankAccount] = await getDb().insert(bankAccounts).values({
      userId: user.id,
      recipientCode: recipient.recipient_code,
      virtualAccountNumber: virtualAccount.account_number,
      virtualBankName: virtualAccount.bank.name,
      sharableId,
    }).returning();

    return parseStringify(mapBank(bankAccount));
  } catch (error) {
    console.error('Error setting up Paystack account:', error);
    return null;
  }
};

export const createBankAccount = async ({
  accessToken: recipientCode,
  userId,
  accountId: virtualAccountNumber,
  bankId: virtualBankName,
  fundingSourceUrl,
  sharableId,
}: any) => {
  try {
    const [bankAccount] = await getDb().insert(bankAccounts).values({
      userId,
      recipientCode,
      virtualAccountNumber,
      virtualBankName,
      sharableId,
    }).returning();

    return parseStringify(mapBank(bankAccount));
  } catch (error) {
    console.error('Error creating bank account:', error);
    return null;
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const result = await getDb().select().from(bankAccounts).where(eq(bankAccounts.userId, userId));
    return parseStringify(result.map(mapBank));
  } catch (error) {
    console.error('Error getting banks:', error);
    return null;
  }
};

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const [bank] = await getDb().select().from(bankAccounts).where(eq(bankAccounts.id, documentId)).limit(1);
    if (!bank) return null;
    return parseStringify(mapBank(bank));
  } catch (error) {
    console.error('Error getting bank:', error);
    return null;
  }
};

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {
    const [bank] = await getDb().select().from(bankAccounts).where(eq(bankAccounts.virtualAccountNumber, accountId)).limit(1);
    if (!bank) return null;
    return parseStringify(mapBank(bank));
  } catch (error) {
    console.error('Error getting bank by account id:', error);
    return null;
  }
};

export const unlinkBankAccount = async ({ bankId, userId }: { bankId: string; userId: string }) => {
  try {
    const [bank] = await getDb().select().from(bankAccounts).where(eq(bankAccounts.id, bankId)).limit(1);
    if (!bank) return { error: 'Bank account not found.' };
    if (bank.userId !== userId) return { error: 'Unauthorized.' };

    await getDb().delete(bankAccounts).where(eq(bankAccounts.id, bankId));
    return { success: true };
  } catch (error) {
    console.error('Error unlinking bank account:', error);
    return { error: 'Failed to unlink bank account.' };
  }
};
