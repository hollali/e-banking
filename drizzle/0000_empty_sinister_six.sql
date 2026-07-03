CREATE TABLE "bank_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"recipient_code" text NOT NULL,
	"virtual_account_number" text NOT NULL,
	"virtual_bank_name" text NOT NULL,
	"sharable_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"amount" text NOT NULL,
	"sender_id" text NOT NULL,
	"sender_bank_id" text NOT NULL,
	"receiver_id" text NOT NULL,
	"receiver_bank_id" text NOT NULL,
	"email" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"paystack_reference" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"address" text,
	"city" text,
	"postal_code" text,
	"date_of_birth" text,
	"ssn" text,
	"paystack_customer_code" text,
	"balance" numeric DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sender_bank_id_bank_accounts_id_fk" FOREIGN KEY ("sender_bank_id") REFERENCES "public"."bank_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_receiver_bank_id_bank_accounts_id_fk" FOREIGN KEY ("receiver_bank_id") REFERENCES "public"."bank_accounts"("id") ON DELETE no action ON UPDATE no action;