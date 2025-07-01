
-- Enable RLS (Row Level Security) on all tables
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'manager', 'worker')) DEFAULT 'worker',
  farm_id UUID NOT NULL DEFAULT uuid_generate_v4(),
  avatar_url TEXT,
  farm_name TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create animals table
CREATE TABLE IF NOT EXISTS animals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farm_id UUID NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female')) NOT NULL,
  mother_id UUID REFERENCES animals(id),
  father_id UUID REFERENCES animals(id),
  health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  location TEXT NOT NULL,
  weight DECIMAL,
  status TEXT CHECK (status IN ('active', 'sold', 'deceased')) DEFAULT 'active',
  qr_code TEXT UNIQUE,
  rfid_tag TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create health_records table
CREATE TABLE IF NOT EXISTS health_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  farm_id UUID NOT NULL,
  type TEXT CHECK (type IN ('vaccination', 'treatment', 'checkup', 'illness')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  veterinarian TEXT,
  medications TEXT,
  next_due_date DATE,
  cost DECIMAL,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'overdue')) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create feeding_records table
CREATE TABLE IF NOT EXISTS feeding_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  farm_id UUID NOT NULL,
  feed_type TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  cost DECIMAL,
  fed_by TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create breeding_records table
CREATE TABLE IF NOT EXISTS breeding_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mother_id UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  father_id UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  farm_id UUID NOT NULL,
  breeding_date DATE NOT NULL,
  expected_birth_date DATE,
  actual_birth_date DATE,
  offspring_count INTEGER,
  success BOOLEAN,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create production_records table
CREATE TABLE IF NOT EXISTS production_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  farm_id UUID NOT NULL,
  type TEXT CHECK (type IN ('milk', 'eggs', 'wool', 'meat', 'other')) NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  quality_grade TEXT,
  price_per_unit DECIMAL,
  total_value DECIMAL,
  recorded_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create financial_records table
CREATE TABLE IF NOT EXISTS financial_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farm_id UUID NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT NOT NULL,
  date DATE NOT NULL,
  payment_method TEXT,
  invoice_number TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farm_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT CHECK (type IN ('feeding', 'health', 'maintenance', 'breeding', 'other')) NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')) DEFAULT 'pending',
  assigned_to TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  animal_id UUID REFERENCES animals(id),
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farm_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'manager', 'worker')) NOT NULL,
  permissions TEXT[] DEFAULT '{}',
  salary DECIMAL,
  hire_date DATE NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_animals_farm_id ON animals(farm_id);
CREATE INDEX IF NOT EXISTS idx_animals_species ON animals(species);
CREATE INDEX IF NOT EXISTS idx_health_records_animal_id ON health_records(animal_id);
CREATE INDEX IF NOT EXISTS idx_health_records_farm_id ON health_records(farm_id);
CREATE INDEX IF NOT EXISTS idx_feeding_records_animal_id ON feeding_records(animal_id);
CREATE INDEX IF NOT EXISTS idx_breeding_records_farm_id ON breeding_records(farm_id);
CREATE INDEX IF NOT EXISTS idx_production_records_animal_id ON production_records(animal_id);
CREATE INDEX IF NOT EXISTS idx_financial_records_farm_id ON financial_records(farm_id);
CREATE INDEX IF NOT EXISTS idx_tasks_farm_id ON tasks(farm_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_staff_farm_id ON staff(farm_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE breeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policy
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Animals policy
CREATE POLICY "Users can view animals from their farm" ON animals FOR SELECT USING (
  farm_id = (SELECT farm_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can insert animals to their farm" ON animals FOR INSERT WITH CHECK (
  farm_id = (SELECT farm_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can update animals from their farm" ON animals FOR UPDATE USING (
  farm_id = (SELECT farm_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can delete animals from their farm" ON animals FOR DELETE USING (
  farm_id = (SELECT farm_id FROM profiles WHERE id = auth.uid())
);

-- Health records policy
CREATE POLICY "Users can view health records from their farm" ON health_records FOR SELECT USING (
  farm_id = (SELECT farm_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can insert health records to their farm" ON health_records FOR INSERT WITH CHECK (
  farm_id = (SELECT farm_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can update health records from their farm" ON health_records FOR UPDATE USING (
  farm_id = (SELECT farm_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Users can delete health records from their farm" ON health_records FOR DELETE USING (
  farm_id = (SELECT farm_id FROM profiles WHERE id = auth.uid())
);

-- Similar policies for other tables
CREATE POLICY "Users can manage feeding records from their farm" ON feeding_records FOR ALL USING (
  farm_id = (SELECT farm_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can manage breeding records from their farm" ON breeding_records FOR ALL USING (
  farm_id = (SELECT farm_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can manage production records from their farm" ON production_records FOR ALL USING (
  farm_id = (SELECT farm_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can manage financial records from their farm" ON financial_records FOR ALL USING (
  farm_id = (SELECT farm_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can manage tasks from their farm" ON tasks FOR ALL USING (
  farm_id = (SELECT farm_id FROM profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can manage staff from their farm" ON staff FOR ALL USING (
  farm_id = (SELECT farm_id FROM profiles WHERE id = auth.uid())
);

-- Create function to handle profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, farm_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', 'New User'), 'My Farm');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_animals_updated_at BEFORE UPDATE ON animals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON health_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_breeding_records_updated_at BEFORE UPDATE ON breeding_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
