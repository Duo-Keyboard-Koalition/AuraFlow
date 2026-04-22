-- AuraFlow Supabase Schema (Unified Model)

-- 1. User Profiles
CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email        TEXT NOT NULL,
  handle       TEXT UNIQUE,
  first_name   TEXT,
  last_name    TEXT,
  account_type TEXT CHECK (account_type IN ('brand', 'influencer')),
  avatar_url   TEXT,
  bio          TEXT,
  location     TEXT,
  website      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Agents (Owned by Humans)
CREATE TABLE agents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  handle      TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  public_key  TEXT NOT NULL UNIQUE,
  vibe        TEXT DEFAULT 'neutral',
  avatar_url  TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Auras (Posts)
CREATE TABLE auras (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  author_user_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  vibe        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT has_author CHECK (
    (author_agent_id IS NOT NULL AND author_user_id IS NULL) OR
    (author_agent_id IS NULL AND author_user_id IS NOT NULL)
  )
);

-- 4. Unified Interactions
CREATE TABLE interactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aura_id     UUID NOT NULL REFERENCES auras(id) ON DELETE CASCADE,
  actor_agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  actor_user_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('like', 'repost')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT has_actor CHECK (
    (actor_agent_id IS NOT NULL AND actor_user_id IS NULL) OR
    (actor_agent_id IS NULL AND actor_user_id IS NOT NULL)
  ),
  UNIQUE(aura_id, actor_agent_id, actor_user_id, type)
);

-- 5. Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('avatars', 'avatars', true, 5242880, '{image/*}'),
  ('content', 'content', true, 52428800, '{image/*,video/*,audio/*}'),
  ('jobs', 'jobs', false, 104857600, NULL)
ON CONFLICT (id) DO NOTHING;

-- 6. RLS Setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE auras ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- 7. Table Policies
CREATE POLICY "Public Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Owner Profile Update" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public Agents" ON agents FOR SELECT USING (true);
CREATE POLICY "Owner Agent Manage" ON agents FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Public Auras" ON auras FOR SELECT USING (true);
CREATE POLICY "Auth User Insert Aura" ON auras FOR INSERT TO authenticated WITH CHECK (
  (author_user_id = auth.uid()) OR 
  (author_agent_id IN (SELECT id FROM agents WHERE owner_id = auth.uid()))
);

CREATE POLICY "Public Interactions" ON interactions FOR SELECT USING (true);
CREATE POLICY "Auth User Manage Interaction" ON interactions FOR ALL TO authenticated USING (
  (actor_user_id = auth.uid()) OR 
  (actor_agent_id IN (SELECT id FROM agents WHERE owner_id = auth.uid()))
);

-- 8. Storage Policies
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'content'));
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('avatars', 'content', 'jobs'));
CREATE POLICY "Owner Management" ON storage.objects FOR ALL TO authenticated USING (auth.uid()::text = (storage.foldername(name))[1]);

-- 9. Automatic Profile Creation Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  base_handle TEXT;
  final_handle TEXT;
  counter INTEGER := 0;
BEGIN
  base_handle := split_part(new.email, '@', 1);
  final_handle := base_handle;
  
  -- Handle potential handle collisions
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE handle = final_handle) LOOP
    counter := counter + 1;
    final_handle := base_handle || counter::TEXT;
  END LOOP;

  INSERT INTO public.profiles (id, email, first_name, handle)
  VALUES (new.id, new.email, base_handle, final_handle);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Real-time
ALTER PUBLICATION supabase_realtime ADD TABLE auras;
ALTER PUBLICATION supabase_realtime ADD TABLE agents;
ALTER PUBLICATION supabase_realtime ADD TABLE interactions;
