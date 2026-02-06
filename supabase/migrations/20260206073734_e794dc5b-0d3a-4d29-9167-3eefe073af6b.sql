-- Add interest_rate column to loan_applications for tracking approved loan interest percentage
ALTER TABLE public.loan_applications 
ADD COLUMN interest_rate numeric DEFAULT NULL;

-- Add approved_at timestamp to track when loan was approved
ALTER TABLE public.loan_applications 
ADD COLUMN approved_at timestamp with time zone DEFAULT NULL;

-- Add approved_by to track which admin approved the loan
ALTER TABLE public.loan_applications 
ADD COLUMN approved_by uuid DEFAULT NULL;

-- Allow admins to delete member_codes (for removing members)
CREATE POLICY "Admins can delete member codes" 
ON public.member_codes 
FOR DELETE 
USING (is_admin());

-- Allow admins to delete meetings
CREATE POLICY "Admins can delete meetings" 
ON public.meetings 
FOR DELETE 
USING (is_admin());

-- Allow admins to update meetings
CREATE POLICY "Admins can update meetings" 
ON public.meetings 
FOR UPDATE 
USING (is_admin());

-- Allow admins to delete notices
CREATE POLICY "Admins can delete notices" 
ON public.notices 
FOR DELETE 
USING (is_admin());

-- Allow admins to update notices
CREATE POLICY "Admins can update notices" 
ON public.notices 
FOR UPDATE 
USING (is_admin());