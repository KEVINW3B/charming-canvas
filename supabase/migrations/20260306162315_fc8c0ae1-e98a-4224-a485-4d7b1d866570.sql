
-- Create documents table for admin-managed downloadable files
CREATE TABLE public.sacco_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'General',
  file_url text,
  file_type text DEFAULT 'PDF',
  file_size text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sacco_documents ENABLE ROW LEVEL SECURITY;

-- Everyone can view documents
CREATE POLICY "Everyone can view documents" ON public.sacco_documents
  FOR SELECT USING (true);

-- Admins can manage documents
CREATE POLICY "Admins can manage documents" ON public.sacco_documents
  FOR ALL USING (public.is_admin());

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents bucket
CREATE POLICY "Anyone can read documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Admins can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND public.is_admin());

CREATE POLICY "Admins can update documents" ON storage.objects
  FOR UPDATE USING (bucket_id = 'documents' AND public.is_admin());

CREATE POLICY "Admins can delete documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents' AND public.is_admin());

-- Fix member_notifications: allow authenticated users to insert for any user_id
-- (needed for admin deposit confirmation flow where admin inserts notification for member)
DROP POLICY IF EXISTS "Admins can create notifications" ON public.member_notifications;
CREATE POLICY "Authenticated can create notifications" ON public.member_notifications
  FOR INSERT TO authenticated WITH CHECK (true);
