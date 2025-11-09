
-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS laporan_penjualan_detail CASCADE;
DROP TABLE IF EXISTS laporan_penjualan CASCADE;
DROP TABLE IF EXISTS conversion_requests CASCADE;
DROP TABLE IF EXISTS bottle_collections CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS payment_method CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM types for PostgreSQL
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE payment_type AS ENUM ('cash', 'dana', 'ovo', 'gopay');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected', 'paid');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit');

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role user_role NOT NULL DEFAULT 'user',
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(150),
    email VARCHAR(150),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Rooms Table
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100),
    location VARCHAR(255),
    supervisor_id INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supervisor_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_rooms_supervisor ON rooms(supervisor_id);
CREATE INDEX idx_rooms_code ON rooms(code);

-- Payment Method Table
CREATE TABLE payment_method (
    id SERIAL PRIMARY KEY,
    method_name VARCHAR(100) NOT NULL,
    type payment_type NOT NULL,
    account_number VARCHAR(50),
    account_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_method_type ON payment_method(type);

-- Wallets Table
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    points_balance INTEGER DEFAULT 0 CHECK (points_balance >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_wallets_user ON wallets(user_id);

-- Bottle Collections Table
CREATE TABLE bottle_collections (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    total_bottles INTEGER NOT NULL CHECK (total_bottles > 0),
    points_awarded INTEGER NOT NULL CHECK (points_awarded >= 0),
    verified BOOLEAN DEFAULT FALSE,
    verified_by INTEGER,
    verified_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_bottle_collections_user ON bottle_collections(user_id);
CREATE INDEX idx_bottle_collections_room ON bottle_collections(room_id);
CREATE INDEX idx_bottle_collections_verified ON bottle_collections(verified);
CREATE INDEX idx_bottle_collections_date ON bottle_collections(created_at);

-- Conversion Requests Table
CREATE TABLE conversion_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    method_id INTEGER NOT NULL,
    points_amount INTEGER NOT NULL CHECK (points_amount > 0),
    money_amount DECIMAL(12,2) NOT NULL CHECK (money_amount > 0),
    status request_status DEFAULT 'pending',
    account_number VARCHAR(100),
    account_name VARCHAR(150),
    notes TEXT,
    processed_by INTEGER,
    processed_at TIMESTAMP,
    request_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (method_id) REFERENCES payment_method(id) ON DELETE RESTRICT,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_conversion_requests_user ON conversion_requests(user_id);
CREATE INDEX idx_conversion_requests_status ON conversion_requests(status);
CREATE INDEX idx_conversion_requests_date ON conversion_requests(request_at);

-- Wallet Transactions Table
CREATE TABLE wallet_transactions (
    id BIGSERIAL PRIMARY KEY,
    wallet_id INTEGER NOT NULL,
    change_amount INTEGER NOT NULL,
    type transaction_type NOT NULL,
    ref_id BIGINT,
    ref_table VARCHAR(50),
    description TEXT,
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
);

CREATE INDEX idx_wallet_transactions_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX idx_wallet_transactions_date ON wallet_transactions(created_at);
CREATE INDEX idx_wallet_transactions_ref ON wallet_transactions(ref_id, ref_table);

-- Laporan Penjualan Table
CREATE TABLE laporan_penjualan (
    id BIGSERIAL PRIMARY KEY,
    sale_date DATE NOT NULL,
    total_bottles INTEGER NOT NULL CHECK (total_bottles > 0),
    total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount > 0),
    admin_id INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_laporan_penjualan_date ON laporan_penjualan(sale_date);
CREATE INDEX idx_laporan_penjualan_admin ON laporan_penjualan(admin_id);

-- Laporan Penjualan Detail Table
CREATE TABLE laporan_penjualan_detail (
    id BIGSERIAL PRIMARY KEY,
    laporan_id BIGINT NOT NULL,
    bottle_type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_per_bottle DECIMAL(10,2) NOT NULL CHECK (price_per_bottle > 0),
    subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal > 0),
    FOREIGN KEY (laporan_id) REFERENCES laporan_penjualan(id) ON DELETE CASCADE
);

CREATE INDEX idx_laporan_detail_laporan ON laporan_penjualan_detail(laporan_id);
CREATE INDEX idx_laporan_detail_type ON laporan_penjualan_detail(bottle_type);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_method_updated_at BEFORE UPDATE ON payment_method
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create wallet automatically when user is created
CREATE OR REPLACE FUNCTION create_wallet_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO wallets (user_id, points_balance)
    VALUES (NEW.id, 0);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_create_wallet_for_user
    AFTER INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION create_wallet_for_new_user();

-- Comments for documentation
COMMENT ON TABLE users IS 'Stores user information including admin, supervisor, and regular users';
COMMENT ON TABLE rooms IS 'Stores room/location information for bottle collection';
COMMENT ON TABLE wallets IS 'Stores point balance for each user';
COMMENT ON TABLE bottle_collections IS 'Records bottle collection transactions';
COMMENT ON TABLE conversion_requests IS 'Handles point to money conversion requests';
COMMENT ON TABLE wallet_transactions IS 'Logs all wallet balance changes';
COMMENT ON TABLE laporan_penjualan IS 'Sales report master table';
COMMENT ON TABLE laporan_penjualan_detail IS 'Sales report detail by bottle type';

-- Sample data for testing (optional)
-- INSERT INTO users (role, username, password, fullname, email) VALUES
-- ('admin', 'admin', '$2y$10$...', 'Administrator', 'admin@banksampah.com');

COMMENT ON COLUMN users.role IS 'User role: admin, supervisor, or user';
COMMENT ON COLUMN bottle_collections.verified IS 'Whether collection has been verified by supervisor';
COMMENT ON COLUMN conversion_requests.status IS 'Request status: pending, approved, rejected, or paid';
COMMENT ON COLUMN wallet_transactions.type IS 'Transaction type: credit (add points) or debit (deduct points)';
COMMENT ON COLUMN wallet_transactions.balance_after IS 'Balance after this transaction for audit trail';