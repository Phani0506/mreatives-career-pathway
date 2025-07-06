
-- Drop the existing generic applications table
DROP TABLE IF EXISTS public.applications;

-- Create role-specific tables
CREATE TABLE public.graphic_designer_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
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

CREATE TABLE public.social_media_manager_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
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

CREATE TABLE public.ads_executive_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
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

CREATE TABLE public.production_executive_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
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

CREATE TABLE public.intern_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
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

-- Create role-specific storage buckets for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('graphic-designer-resumes', 'graphic-designer-resumes', false),
  ('social-media-manager-resumes', 'social-media-manager-resumes', false),
  ('ads-executive-resumes', 'ads-executive-resumes', false),
  ('production-executive-resumes', 'production-executive-resumes', false),
  ('intern-resumes', 'intern-resumes', false);

-- Drop the old generic resumes bucket
DELETE FROM storage.buckets WHERE id = 'resumes';

-- Create storage policies for each bucket
CREATE POLICY "Anyone can upload graphic designer resumes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'graphic-designer-resumes');

CREATE POLICY "Anyone can view graphic designer resumes" ON storage.objects
FOR SELECT USING (bucket_id = 'graphic-designer-resumes');

CREATE POLICY "Anyone can upload social media manager resumes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'social-media-manager-resumes');

CREATE POLICY "Anyone can view social media manager resumes" ON storage.objects
FOR SELECT USING (bucket_id = 'social-media-manager-resumes');

CREATE POLICY "Anyone can upload ads executive resumes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'ads-executive-resumes');

CREATE POLICY "Anyone can view ads executive resumes" ON storage.objects
FOR SELECT USING (bucket_id = 'ads-executive-resumes');

CREATE POLICY "Anyone can upload production executive resumes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'production-executive-resumes');

CREATE POLICY "Anyone can view production executive resumes" ON storage.objects
FOR SELECT USING (bucket_id = 'production-executive-resumes');

CREATE POLICY "Anyone can upload intern resumes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'intern-resumes');

CREATE POLICY "Anyone can view intern resumes" ON storage.objects
FOR SELECT USING (bucket_id = 'intern-resumes');

-- Enable RLS on all application tables
ALTER TABLE public.graphic_designer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_manager_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads_executive_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_executive_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intern_applications ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anyone to insert and view applications for each table
CREATE POLICY "Anyone can submit graphic designer applications" ON public.graphic_designer_applications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view graphic designer applications" ON public.graphic_designer_applications
FOR SELECT USING (true);

CREATE POLICY "Anyone can submit social media manager applications" ON public.social_media_manager_applications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view social media manager applications" ON public.social_media_manager_applications
FOR SELECT USING (true);

CREATE POLICY "Anyone can submit ads executive applications" ON public.ads_executive_applications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view ads executive applications" ON public.ads_executive_applications
FOR SELECT USING (true);

CREATE POLICY "Anyone can submit production executive applications" ON public.production_executive_applications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view production executive applications" ON public.production_executive_applications
FOR SELECT USING (true);

CREATE POLICY "Anyone can submit intern applications" ON public.intern_applications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view intern applications" ON public.intern_applications
FOR SELECT USING (true);
