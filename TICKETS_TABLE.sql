-- Tabla de boletas/tickets
CREATE TABLE tickets (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  
  -- Número de boleta (6 dígitos únicos)
  ticket_number VARCHAR(6) UNIQUE NOT NULL,
  
  -- Relación con transacción
  transaction_id BIGINT NOT NULL REFERENCES transactions(id) ON DELETE RESTRICT,
  
  -- Relación con cliente
  customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  
  -- Estado del ticket
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'cancelled')),
  
  -- Información del premio asociado (de items_data)
  award_title VARCHAR(255),
  award_image VARCHAR(500),
  
  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Restricciones
  CONSTRAINT valid_ticket_number CHECK (ticket_number ~ '^[0-9]{6}$')
);

-- Índices para búsquedas eficientes
CREATE INDEX idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX idx_tickets_transaction_id ON tickets(transaction_id);
CREATE INDEX idx_tickets_customer_id ON tickets(customer_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_created_at ON tickets(created_at DESC);

-- Trigger para updated_at
CREATE TRIGGER update_tickets_updated_at
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Policy para service role (backend)
CREATE POLICY "Service role can do everything" ON tickets
  FOR ALL USING (auth.role() = 'service_role');

-- Policy para que usuarios puedan ver sus propios tickets (opcional para futuro)
CREATE POLICY "Users can view their own tickets" ON tickets
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE email = auth.jwt() ->> 'email'
    )
  );
