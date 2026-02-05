-- Allow public insert on member_codes temporarily (for testing without auth)
-- This should be reverted once admin auth is set up

CREATE POLICY "Allow public insert for testing"
ON public.member_codes
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow public select for testing"
ON public.member_codes
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow public update for testing"
ON public.member_codes
FOR UPDATE
TO anon
USING (true);

-- Also allow authenticated users who aren't admins yet
CREATE POLICY "Allow authenticated insert"
ON public.member_codes
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated select"
ON public.member_codes
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated update"
ON public.member_codes
FOR UPDATE
TO authenticated
USING (true);