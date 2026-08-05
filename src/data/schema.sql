-- ============================================================================
-- DORM RECIPE EXCHANGE - ZERO-PUBLIC-EMAIL, USER BIO & AVATAR EDIT SQL SCHEMA
-- ============================================================================

-- 1. Profiles Table (linked to Supabase Auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  name text not null,
  avatar_url text, -- Profile Picture / Avatar image URL
  bio text default 'Dorm chef exploring quick & delicious recipes!',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security for Profiles
alter table public.profiles enable row level security;

-- Strictly allow users to view ONLY their OWN full profile (which contains their private email)
create policy "Users can view their own full profile" 
  on public.profiles for select 
  using (auth.uid() = id);

-- Allow users to update their own profile (name, avatar_url, bio)
create policy "Users can update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- Trigger to auto-create profile row on auth sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url, bio)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'bio', 'Dorm chef exploring quick & delicious recipes!')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Public Profiles View (ZERO PUBLIC EMAIL EXPOSURE + USER BIO + AVATAR URL)
-- Completely strips away email addresses from public APIs. 
-- Exposes ONLY public-safe metadata: ID, Name, Avatar URL, Bio, Joined Date, and Server-Verified Campus status.
create or replace view public.public_profiles as
select 
  id,
  name,
  avatar_url,
  bio,
  created_at,
  (email ilike '%.edu') as is_campus_verified
from public.profiles;


-- 3. Recipes Table (with ฿40–฿1000 cost constraint check)
create table public.recipes (
  id uuid default gen_random_uuid() primary key,
  uploader_id uuid references public.profiles(id) on delete cascade not null,
  title text not null check (char_length(title) >= 3),
  photo_url text not null,
  cost integer not null check (cost >= 40 and cost <= 1000), -- Cost in Thai Baht (฿40–฿1000)
  equipment text not null,
  cuisine text not null,
  ingredients jsonb not null, -- Array of {name, qty}
  steps text[] not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for Recipes
alter table public.recipes enable row level security;
create policy "Recipes are viewable by everyone" on public.recipes for select using (true);
create policy "Authenticated users can insert recipes" on public.recipes for insert with check (auth.role() = 'authenticated');
create policy "Users can update their own recipes" on public.recipes for update using (auth.uid() = uploader_id);
create policy "Users can delete their own recipes" on public.recipes for delete using (auth.uid() = uploader_id);


-- 4. Public Recipes Feed View (Zero Email Exposure + Joined Bio + Avatar URL)
create or replace view public.public_recipes_feed as
select 
  r.id,
  r.title,
  r.photo_url,
  r.cost,
  r.equipment,
  r.cuisine,
  r.ingredients,
  r.steps,
  r.notes,
  r.created_at,
  r.uploader_id,
  p.name as uploader_name,
  p.avatar_url as uploader_avatar_url,
  p.bio as uploader_bio,
  p.is_campus_verified as uploader_is_campus_verified
from public.recipes r
join public.public_profiles p on r.uploader_id = p.id;


-- 5. Comments Table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  recipe_id uuid references public.recipes(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  text text not null check (char_length(text) >= 1),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for Comments
alter table public.comments enable row level security;
create policy "Comments are viewable by everyone" on public.comments for select using (true);
create policy "Authenticated users can comment" on public.comments for insert with check (auth.role() = 'authenticated');
create policy "Users can delete their own comments" on public.comments for delete using (auth.uid() = user_id);


-- 6. Ratings Table
create table public.ratings (
  recipe_id uuid references public.recipes(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (recipe_id, user_id)
);

-- RLS Policies for Ratings
alter table public.ratings enable row level security;
create policy "Ratings are viewable by everyone" on public.ratings for select using (true);
create policy "Authenticated users can upsert ratings" on public.ratings for insert with check (auth.role() = 'authenticated');
create policy "Users can update their own ratings" on public.ratings for update using (auth.uid() = user_id);


-- 7. Saved Recipes (Bookmarks Junction Table)
create table public.saved_recipes (
  recipe_id uuid references public.recipes(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (recipe_id, user_id)
);

-- RLS Policies for Bookmarks
alter table public.saved_recipes enable row level security;
create policy "Users can view their own bookmarks" on public.saved_recipes for select using (auth.uid() = user_id);
create policy "Users can add bookmarks" on public.saved_recipes for insert with check (auth.role() = 'authenticated');
create policy "Users can remove bookmarks" on public.saved_recipes for delete using (auth.uid() = user_id);

-- Storage Buckets Setup:
-- 1. 'recipe-photos': For recipe dish photos.
-- 2. 'avatars': For user profile picture uploads.
