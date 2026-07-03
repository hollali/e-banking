import { pgTable, text, timestamp, integer, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(createId),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  address: text('address'),
  city: text('city'),
  postalCode: text('postal_code'),
  dateOfBirth: text('date_of_birth'),
  ssn: text('ssn'),
  paystackCustomerCode: text('paystack_customer_code'),
  balance: numeric('balance').default('0').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const bankAccounts = pgTable('bank_accounts', {
  id: text('id').primaryKey().$defaultFn(createId),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  recipientCode: text('recipient_code').notNull(),
  virtualAccountNumber: text('virtual_account_number').notNull(),
  virtualBankName: text('virtual_bank_name').notNull(),
  sharableId: text('sharable_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey().$defaultFn(createId),
  name: text('name').notNull(),
  amount: text('amount').notNull(),
  senderId: text('sender_id').notNull(),
  senderBankId: text('sender_bank_id').notNull().references(() => bankAccounts.id),
  receiverId: text('receiver_id').notNull(),
  receiverBankId: text('receiver_bank_id').notNull().references(() => bankAccounts.id),
  email: text('email').notNull(),
  status: text('status').default('pending').notNull(),
  paystackReference: text('paystack_reference'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  bankAccounts: many(bankAccounts),
}));

export const bankAccountsRelations = relations(bankAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [bankAccounts.userId],
    references: [users.id],
  }),
  sentTransactions: many(transactions, { relationName: 'sentTransactions' }),
  receivedTransactions: many(transactions, { relationName: 'receivedTransactions' }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  senderBank: one(bankAccounts, {
    fields: [transactions.senderBankId],
    references: [bankAccounts.id],
    relationName: 'sentTransactions',
  }),
  receiverBank: one(bankAccounts, {
    fields: [transactions.receiverBankId],
    references: [bankAccounts.id],
    relationName: 'receivedTransactions',
  }),
}));
