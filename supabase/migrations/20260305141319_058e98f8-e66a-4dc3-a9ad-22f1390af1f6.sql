
-- Add id_number and avatar_url to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS id_number text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Add mpesa_code to weekly_deposits
ALTER TABLE public.weekly_deposits ADD COLUMN IF NOT EXISTS mpesa_code text;

-- Add interest_rate to member_codes (admin-set per-member rate)
ALTER TABLE public.member_codes ADD COLUMN IF NOT EXISTS interest_rate numeric DEFAULT 0;

-- Create avatar storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
