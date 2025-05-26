CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_name" varchar(50),
	"email" varchar(100) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
