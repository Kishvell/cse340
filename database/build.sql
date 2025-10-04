-- build.sql (account table)
CREATE TABLE IF NOT EXISTS account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(50),
    account_lastname VARCHAR(50),
    account_email VARCHAR(100) UNIQUE NOT NULL,
    account_password TEXT NOT NULL,
    account_type VARCHAR(25) DEFAULT 'Client' NOT NULL
);