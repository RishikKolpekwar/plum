-- plum Database Schema
-- Run this in your Supabase SQL Editor to set up the tables

-- Technicians table
CREATE TABLE IF NOT EXISTS technicians (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Availability table (each technician's working hours per day)
-- default_start and default_end represent their standard shift
CREATE TABLE IF NOT EXISTS availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday...6=Saturday
  start_time TIME NOT NULL DEFAULT '08:00',
  end_time TIME NOT NULL DEFAULT '17:00',
  is_available BOOLEAN DEFAULT true,
  UNIQUE(technician_id, day_of_week)
);

-- Date-specific overrides (vacation, custom hours, etc.)
CREATE TABLE IF NOT EXISTS availability_overrides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  technician_id UUID REFERENCES technicians(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME, -- null means day off
  end_time TIME,
  is_available BOOLEAN DEFAULT false,
  reason TEXT,
  UNIQUE(technician_id, date)
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  technician_id UUID REFERENCES technicians(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  service_type TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'in_progress')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Row Level Security) but allow service role full access
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policies for service role (allow all)
CREATE POLICY "Service role full access" ON technicians FOR ALL USING (true);
CREATE POLICY "Service role full access" ON availability FOR ALL USING (true);
CREATE POLICY "Service role full access" ON availability_overrides FOR ALL USING (true);
CREATE POLICY "Service role full access" ON appointments FOR ALL USING (true);
