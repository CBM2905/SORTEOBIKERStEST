-- Tabla de clientes
CREATE TABLE customers (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  cedula VARCHAR(20) UNIQUE,
  cedula_type VARCHAR(10) CHECK (cedula_type IN ('CC', 'PA', 'CE')), -- CC=Cédula Colombiana, PA=Pasaporte, CE=Cédula Extranjera
  city VARCHAR(100),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de transacciones (actualizada)
CREATE TABLE transactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  
  -- Identificadores
  reference VARCHAR(255) UNIQUE NOT NULL,
  wompi_transaction_id VARCHAR(255),
  
  -- Relación con cliente
  customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  
  -- Información del pago
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'approved', 'declined', 'voided')),
  amount_in_cents BIGINT NOT NULL,
  currency VARCHAR(3) DEFAULT 'COP',
  
  -- Datos de la compra
  items_data JSONB NOT NULL,
  description TEXT,
  
  -- Webhook
  webhook_received_at TIMESTAMP WITH TIME ZONE,
  webhook_data JSONB,
  
  -- Auditoría
  metadata JSONB,
  error_message TEXT,
  retry_count INT DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Restricciones
  CONSTRAINT valid_amount CHECK (amount_in_cents > 0)
);

-- Índices
CREATE INDEX idx_transactions_reference ON transactions(reference);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_cedula ON customers(cedula);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();






-- Habilitar RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies para service role (backend)
CREATE POLICY "Service role can do everything" ON customers
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON transactions
  FOR ALL USING (auth.role() = 'service_role');