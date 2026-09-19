-- =========================================================================
-- RISE CLUB PORTAL - SUPABASE SQL SCHEMA & TABLES
-- Sanjivani University, SET, Dept of Integrated B.Tech (2026-2027)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT ('usr-' || gen_random_uuid()::text),
    member_id TEXT UNIQUE NOT NULL,
    prn TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'Research Club Member',
    role_group TEXT NOT NULL DEFAULT 'member',
    department TEXT DEFAULT 'Integrated B.Tech',
    academic_year TEXT DEFAULT 'Year 2',
    division TEXT DEFAULT 'Class A',
    status TEXT DEFAULT 'Active',
    joining_date DATE DEFAULT CURRENT_DATE,
    photo TEXT,
    research_interests TEXT[] DEFAULT '{}',
    technical_skills TEXT[] DEFAULT '{}',
    bio TEXT DEFAULT '',
    portfolio_link TEXT DEFAULT '',
    contributions_count INTEGER DEFAULT 0,
    teams TEXT[] DEFAULT '{}',
    active_projects TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY DEFAULT ('tsk-' || gen_random_uuid()::text),
    title TEXT NOT NULL,
    description TEXT,
    assigned_to TEXT NOT NULL,
    assigned_member_id TEXT,
    team TEXT,
    deadline DATE NOT NULL,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Assigned',
    created_by TEXT NOT NULL,
    submission_link_required BOOLEAN DEFAULT true,
    score INTEGER DEFAULT 0,
    feedback TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. LINK SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
    id TEXT PRIMARY KEY DEFAULT ('sub-' || gen_random_uuid()::text),
    task_id TEXT REFERENCES public.tasks(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL,
    member_name TEXT NOT NULL,
    link_url TEXT NOT NULL,
    link_type TEXT DEFAULT 'GitHub Repository',
    notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'Submitted',
    score INTEGER DEFAULT 0,
    feedback TEXT
);

-- 4. INTERVIEW APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY DEFAULT ('app-' || gen_random_uuid()::text),
    name TEXT NOT NULL,
    prn TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    cgpa NUMERIC(3,2),
    primary_domain TEXT NOT NULL,
    technical_skills TEXT[] DEFAULT '{}',
    github_or_portfolio TEXT,
    statement_of_purpose TEXT NOT NULL,
    status TEXT DEFAULT 'Under Review',
    interview_date TIMESTAMP WITH TIME ZONE,
    interview_link TEXT,
    reviewer_notes TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY DEFAULT ('evt-' || gen_random_uuid()::text),
    title TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    organizer TEXT NOT NULL,
    description TEXT,
    registration_link TEXT,
    max_seats INTEGER,
    registered_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY DEFAULT ('ann-' || gen_random_uuid()::text),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    priority TEXT DEFAULT 'Normal',
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL,
    published_date DATE DEFAULT CURRENT_DATE,
    attachment_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY DEFAULT ('log-' || gen_random_uuid()::text),
    action TEXT NOT NULL,
    user_name TEXT NOT NULL,
    target TEXT NOT NULL,
    date_time TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
    id TEXT PRIMARY KEY DEFAULT ('cert-' || gen_random_uuid()::text),
    certificate_no TEXT UNIQUE NOT NULL,
    member_id TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    recipient_prn TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Public read policies for standard portal operations
CREATE POLICY "Public read access for users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public insert/update for users" ON public.users FOR ALL USING (true);

CREATE POLICY "Public read access for tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Public write access for tasks" ON public.tasks FOR ALL USING (true);

CREATE POLICY "Public read access for submissions" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Public write access for submissions" ON public.submissions FOR ALL USING (true);

CREATE POLICY "Public read access for applications" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Public write access for applications" ON public.applications FOR ALL USING (true);

CREATE POLICY "Public read access for events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public write access for events" ON public.events FOR ALL USING (true);

CREATE POLICY "Public read access for announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Public write access for announcements" ON public.announcements FOR ALL USING (true);

CREATE POLICY "Public read access for activity_logs" ON public.activity_logs FOR SELECT USING (true);
CREATE POLICY "Public write access for activity_logs" ON public.activity_logs FOR ALL USING (true);

CREATE POLICY "Public read access for certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Public write access for certificates" ON public.certificates FOR ALL USING (true);
