const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const BASE_URL = 'https://api.paystack.co';

async function paystackFetch(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    console.error('Paystack API error:', data);
    throw new Error(data.message || 'Paystack API error');
  }
  return data;
}

export async function createCustomer(email: string, firstName: string, lastName: string) {
  const data = await paystackFetch('/customer', {
    method: 'POST',
    body: JSON.stringify({ email, first_name: firstName, last_name: lastName }),
  });
  return data.data;
}

export async function createDedicatedVirtualAccount(customerCode: string, preferredBank = 'wema-bank') {
  const data = await paystackFetch('/dedicated_account', {
    method: 'POST',
    body: JSON.stringify({ customer: customerCode, preferred_bank: preferredBank }),
  });
  return data.data;
}

export async function createTransferRecipient(name: string, accountNumber: string, bankCode: string) {
  const data = await paystackFetch('/transferrecipient', {
    method: 'POST',
    body: JSON.stringify({
      type: 'nuban',
      name,
      account_number: accountNumber,
      bank_code: bankCode,
      currency: 'NGN',
    }),
  });
  return data.data;
}

export async function initiateTransfer(recipientCode: string, amountInKobo: number, reason?: string) {
  const data = await paystackFetch('/transfer', {
    method: 'POST',
    body: JSON.stringify({
      source: 'balance',
      amount: amountInKobo,
      recipient: recipientCode,
      reason: reason || 'Transfer from Horizon',
    }),
  });
  return data.data;
}

export async function initializePayment(email: string, amountInKobo: number, reference: string, callbackUrl?: string) {
  const data = await paystackFetch('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email,
      amount: amountInKobo,
      reference,
      callback_url: callbackUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/payment/callback`,
    }),
  });
  return data.data;
}

export async function verifyPayment(reference: string) {
  const data = await paystackFetch(`/transaction/verify/${encodeURIComponent(reference)}`);
  return data.data;
}

export async function listBanks(perPage = 100) {
  const data = await paystackFetch(`/bank?perPage=${perPage}`);
  return data.data;
}
