-- Create table for member login codes (admin-generated)
CREATE TABLE public.member_codes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    login_code TEXT NOT NULL,
    is_authorized BOOLEAN NOT NULL DEFAULT false,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    authorized_at TIMESTAMP WITH TIME ZONE
);

-- Create table for meetings
CREATE TABLE public.meetings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    is_virtual BOOLEAN DEFAULT false,
    meeting_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create table for notices/announcements
CREATE TABLE public.notices (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id)
);

-- Create table for weekly deposits
CREATE TABLE public.weekly_deposits (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'missed')),
    confirmed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all new tables
ALTER TABLE public.member_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_deposits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for member_codes (admin only)
CREATE POLICY "Admins can manage member codes"
ON public.member_codes
FOR ALL
USING (is_admin());

-- RLS Policies for meetings (public read, admin write)
CREATE POLICY "Everyone can view meetings"
ON public.meetings
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage meetings"
ON public.meetings
FOR ALL
USING (is_admin());

-- RLS Policies for notices (public read active, admin write)
CREATE POLICY "Everyone can view active notices"
ON public.notices
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage notices"
ON public.notices
FOR ALL
USING (is_admin());

-- RLS Policies for weekly_deposits
CREATE POLICY "Users can view own deposits"
ON public.weekly_deposits
FOR SELECT
USING ((auth.uid() = user_id) OR is_admin());

CREATE POLICY "Admins can manage deposits"
ON public.weekly_deposits
FOR ALL
USING (is_admin());

CREATE POLICY "Users can insert own deposits"
ON public.weekly_deposits
FOR INSERT
WITH CHECK (auth.uid() = user_id);