-- ============================================
-- PROFILE FIX — Run this in Supabase SQL Editor
-- Fixes the "Loading..." issue on Profile page
-- ============================================

-- 1. Allow users to INSERT their own profile (needed for upsert fallback)
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- 2. Allow upsert (needed when profile row is missing)
drop policy if exists "Users can upsert own profile" on public.profiles;
create policy "Users can upsert own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
