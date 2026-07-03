'use server';

import {
  createCustomer,
  createDedicatedVirtualAccount,
  createTransferRecipient,
  initiateTransfer as paystackInitiateTransfer,
  initializePayment,
  verifyPayment,
  listBanks,
} from '@/lib/paystack';

export async function createPaystackCustomer(email: string, firstName: string, lastName: string) {
  try {
    return await createCustomer(email, firstName, lastName);
  } catch (error) {
    console.error('Error creating Paystack customer:', error);
    return null;
  }
}

export async function createDedicatedVirtualAccountFn(customerCode: string, preferredBank?: string) {
  try {
    return await createDedicatedVirtualAccount(customerCode, preferredBank);
  } catch (error) {
    console.error('Error creating dedicated virtual account:', error);
    return null;
  }
}

export async function createTransferRecipientFn(name: string, accountNumber: string, bankCode: string) {
  try {
    return await createTransferRecipient(name, accountNumber, bankCode);
  } catch (error) {
    console.error('Error creating transfer recipient:', error);
    return null;
  }
}

export async function initiateTransfer(recipientCode: string, amountInKobo: number, reason?: string) {
  try {
    return await paystackInitiateTransfer(recipientCode, amountInKobo, reason);
  } catch (error) {
    console.error('Error initiating transfer:', error);
    return null;
  }
}

export async function initiatePayment(email: string, amountInKobo: number, reference: string, metadata?: Record<string, any>) {
  try {
    return await initializePayment(email, amountInKobo, reference);
  } catch (error) {
    console.error('Error initiating payment:', error);
    return null;
  }
}

export async function verifyPaymentFn(reference: string) {
  try {
    return await verifyPayment(reference);
  } catch (error) {
    console.error('Error verifying payment:', error);
    return null;
  }
}

export async function listBanksFn(perPage = 100) {
  try {
    return await listBanks(perPage);
  } catch (error) {
    console.error('Error listing banks:', error);
    return null;
  }
}
