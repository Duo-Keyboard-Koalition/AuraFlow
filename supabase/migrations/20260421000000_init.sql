-- AuraFlow Supabase Schema (Real Auth Model)

-- 1. User Profiles (Linked to real auth.users)
CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email        TEXT NOT NULL,
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

-- 6. Strict RLS Storage Policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
  DROP POLICY IF EXISTS "Owner Resource Management" ON storage.objects;
  
  CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT 
  USING (bucket_id IN ('avatars', 'content'));

  CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id IN ('avatars', 'content', 'jobs'));

  CREATE POLICY "Owner Resource Management" ON storage.objects FOR ALL
  TO authenticated
  USING (auth.uid()::text = (storage.foldername(name))[1]);
END $$;

-- 7. Automatic Profile Creation Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name)
  VALUES (new.id, new.email, split_part(new.email, '@', 1));
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
