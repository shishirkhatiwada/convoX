CREATE TABLE "chatbot_metadata" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_email" text NOT NULL,
	"color" text DEFAULT '#000000',
	"welcome_messasge" text DEFAULT 'Welcome to our chatbot! How can I help you today?',
	"created_at" timestamp DEFAULT now()
);
