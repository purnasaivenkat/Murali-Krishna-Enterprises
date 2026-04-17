const { execSync } = require('child_process');
const fs = require('fs');

const sql = `
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own payments') THEN
        CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own payments') THEN
        CREATE POLICY "Users can create their own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
`;

fs.writeFileSync('setup_payments.sql', sql);

try {
  const output = execSync('npx @insforge/cli db query "$(cat setup_payments.sql)"', { encoding: 'utf8' });
  console.log(output);
} catch (err) {
  console.error(err.stdout || err.message);
}
