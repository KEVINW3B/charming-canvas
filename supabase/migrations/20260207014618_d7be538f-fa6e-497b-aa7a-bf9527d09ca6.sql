-- Add password_set flag to member_codes to track if member has set their password
ALTER TABLE public.member_codes ADD COLUMN IF NOT EXISTS password_set boolean DEFAULT false;

-- Add loan_eligible flag to member_codes to control loan access
ALTER TABLE public.member_codes ADD COLUMN IF NOT EXISTS loan_eligible boolean DEFAULT false;

-- Add loan_eligible_at timestamp
ALTER TABLE public.member_codes ADD COLUMN IF NOT EXISTS loan_eligible_at timestamp with time zone;

-- Create member_notifications table for member updates
CREATE TABLE IF NOT EXISTS public.member_notifications (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL DEFAULT 'info',
    is_read boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on member_notifications
ALTER TABLE public.member_notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" 
ON public.member_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" 
ON public.member_notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Admins can create notifications
CREATE POLICY "Admins can create notifications" 
ON public.member_notifications 
FOR INSERT 
WITH CHECK (is_admin());

-- Admins can manage all notifications
CREATE POLICY "Admins can manage notifications" 
ON public.member_notifications 
FOR ALL 
USING (is_admin());