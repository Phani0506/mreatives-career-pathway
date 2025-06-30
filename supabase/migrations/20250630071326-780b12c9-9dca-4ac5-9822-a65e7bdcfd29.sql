
-- Create applications table to store form data
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  expected_salary INTEGER NOT NULL,
  has_laptop BOOLEAN NOT NULL,
  has_agency_experience BOOLEAN NOT NULL,
  current_city TEXT NOT NULL,
  willing_to_relocate BOOLEAN NOT NULL,
  resume_file_path TEXT,
  portfolio_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for resume files
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false);

-- Create storage policies for the resumes bucket
CREATE POLICY "Anyone can upload resumes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone can view resumes" ON storage.objects
FOR SELECT USING (bucket_id = 'resumes');

-- Enable RLS on applications table (making it public for now since no auth is implemented)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert applications
CREATE POLICY "Anyone can submit applications" ON public.applications
FOR INSERT WITH CHECK (true);

-- Create policy to allow reading applications (for admin purposes later)
CREATE POLICY "Anyone can view applications" ON public.applications
FOR SELECT USING (true);
