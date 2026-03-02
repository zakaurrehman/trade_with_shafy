-- ============================================
-- Trade with Shafy — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. PROFILES (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null default '',
  student_id text unique,
  phone text default '',
  avatar_url text default '',
  role text not null default 'user', -- 'user' | 'admin'
  plan text not null default 'basic', -- 'basic' | 'premium'
  payment_status text not null default 'pending', -- 'pending' | 'success'
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_student_id text;
begin
  new_student_id := 'MFT' || floor(random() * 900000 + 100000)::text;
  insert into public.profiles (id, full_name, student_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new_student_id
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. RESEARCH POSTS
create table if not exists public.research_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null default '',
  content text not null default '',
  market text not null default 'Forex', -- 'Forex' | 'Gold' | 'Crypto' | 'Stocks' | 'Indices' | 'Crude Oil'
  status text not null default 'active', -- 'active' | 'waiting' | 'completed'
  image_url text default '',
  is_premium boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. COMMUNITY POSTS
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  category text not null default 'Forex Trading', -- category tab
  content text not null,
  image_url text default '',
  likes integer not null default 0,
  dislikes integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. COMMUNITY COMMENTS
create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- 5. POST REACTIONS (likes/dislikes per user)
create table if not exists public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  reaction text not null, -- 'like' | 'dislike'
  unique(post_id, user_id)
);

-- 6. CLASSROOM VIDEOS
create table if not exists public.classroom_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  youtube_url text not null,
  category text not null default 'Beginner', -- 'Beginner' | 'Intermediate' | 'Advanced' | 'Master' | 'COT Research'
  is_premium boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 7. LIVE SESSIONS
create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  stream_url text default '',
  scheduled_at timestamptz,
  is_live boolean not null default false,
  created_at timestamptz not null default now()
);

-- 8. NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.research_posts enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.post_reactions enable row level security;
alter table public.classroom_videos enable row level security;
alter table public.live_sessions enable row level security;
alter table public.notifications enable row level security;

-- PROFILES policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admin can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- RESEARCH POSTS policies
create policy "Anyone authenticated can view research list" on public.research_posts for select using (auth.uid() is not null);
create policy "Admin can manage research posts" on public.research_posts for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- COMMUNITY POSTS policies
create policy "Authenticated users can view community posts" on public.community_posts for select using (auth.uid() is not null);
create policy "Authenticated users can create posts" on public.community_posts for insert with check (auth.uid() = user_id);
create policy "Users can update own posts" on public.community_posts for update using (auth.uid() = user_id);
create policy "Users can delete own posts" on public.community_posts for delete using (auth.uid() = user_id);

-- COMMUNITY COMMENTS policies
create policy "Authenticated users can view comments" on public.community_comments for select using (auth.uid() is not null);
create policy "Authenticated users can create comments" on public.community_comments for insert with check (auth.uid() = user_id);
create policy "Users can delete own comments" on public.community_comments for delete using (auth.uid() = user_id);

-- POST REACTIONS policies
create policy "Authenticated users can view reactions" on public.post_reactions for select using (auth.uid() is not null);
create policy "Users can manage own reactions" on public.post_reactions for all using (auth.uid() = user_id);

-- CLASSROOM VIDEOS policies
create policy "Authenticated users can view videos" on public.classroom_videos for select using (auth.uid() is not null);
create policy "Admin can manage videos" on public.classroom_videos for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- LIVE SESSIONS policies
create policy "Authenticated users can view live sessions" on public.live_sessions for select using (auth.uid() is not null);
create policy "Admin can manage live sessions" on public.live_sessions for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- NOTIFICATIONS policies
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- ============================================
-- SEED DATA — Sample content
-- ============================================

-- Sample research posts
insert into public.research_posts (title, summary, content, market, status, is_premium) values
('Bitcoin Approaches Critical Demand Zone Near $50K', 'Bitcoin is testing a major demand zone. Premium members get full analysis.', 'Full analysis content here...', 'Crypto', 'active', true),
('GBPUSD Maintains Bullish Structure Above 1.3190', 'GBPUSD showing strong bullish momentum above key support.', 'Full analysis content here...', 'Forex', 'active', true),
('EURUSD Pullback Zone in Focus — 1.2100 Target Ahead', 'EURUSD pullback presents buying opportunity.', 'Full analysis content here...', 'Forex', 'active', true),
('Dollar Weakness Deepens as Final Downside Wave Targets 94.70', 'DXY continues its bearish trend.', 'Full analysis content here...', 'Forex', 'active', true),
('Gold Extends Rally Toward $5,290 — Must Read', 'Gold breaking to new highs. Critical levels ahead.', 'Full analysis content here...', 'Gold', 'completed', true),
('Gold Breakout Attempt Faces Unfavorable R:R', 'Gold breakout analysis with risk/reward assessment.', 'Full analysis content here...', 'Gold', 'completed', true);

-- Sample classroom videos
insert into public.classroom_videos (title, description, youtube_url, category, is_premium, sort_order) values
('Welcome to Trade with Shafy', 'Introduction to our trading education platform', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Beginner', false, 1),
('COT & Hedge Funds Research', 'Understanding Commitment of Traders reports', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'COT Research', true, 2),
('Market Structure Analysis', 'How to read market structure like a pro', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Intermediate', true, 3);

-- Sample live session
insert into public.live_sessions (title, stream_url, scheduled_at, is_live) values
('Weekly Market Analysis', '', now() + interval '2 days', false);
