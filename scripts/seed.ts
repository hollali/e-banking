import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users, bankAccounts, transactions } from '../lib/db/schema';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seed() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  const [user1] = await db.insert(users).values({
    email: 'john@example.com',
    password: hashedPassword,
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main Street',
    city: 'Accra',
    postalCode: 'GA100',
    dateOfBirth: '1990-01-15',
    ssn: 'GHA-123456789-0',
  }).returning();

  const [user2] = await db.insert(users).values({
    email: 'jane@example.com',
    password: hashedPassword,
    firstName: 'Jane',
    lastName: 'Smith',
    address: '456 Oak Avenue',
    city: 'Lagos',
    postalCode: '100001',
    dateOfBirth: '1985-06-20',
    ssn: 'GHA-987654321-0',
  }).returning();

  console.log('Created users:', user1.email, user2.email);

  const [bank1] = await db.insert(bankAccounts).values({
    userId: user1.id,
    recipientCode: 'RCP_demo_recipient_1',
    virtualAccountNumber: '1234567890',
    virtualBankName: 'Wema Bank',
    sharableId: 'demo-sharable-1',
  }).returning();

  const [bank2] = await db.insert(bankAccounts).values({
    userId: user2.id,
    recipientCode: 'RCP_demo_recipient_2',
    virtualAccountNumber: '0987654321',
    virtualBankName: 'Wema Bank',
    sharableId: 'demo-sharable-2',
  }).returning();

  console.log('Created bank accounts');

  await db.insert(transactions).values([
    {
      name: 'Payment from Jane',
      amount: '5000.00',
      senderId: user2.id,
      senderBankId: bank2.id,
      receiverId: user1.id,
      receiverBankId: bank1.id,
      email: user2.email,
      status: 'success',
    },
    {
      name: 'Transfer to John',
      amount: '2500.00',
      senderId: user2.id,
      senderBankId: bank2.id,
      receiverId: user1.id,
      receiverBankId: bank1.id,
      email: user2.email,
      status: 'success',
    },
    {
      name: 'Payment from John',
      amount: '1000.00',
      senderId: user1.id,
      senderBankId: bank1.id,
      receiverId: user2.id,
      receiverBankId: bank2.id,
      email: user1.email,
      status: 'pending',
    },
  ]);

  console.log('Created transactions');
  console.log('Seed completed successfully!');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
