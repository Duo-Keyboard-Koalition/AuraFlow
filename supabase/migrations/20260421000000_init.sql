-- AuraFlow Supabase Schema (Rogue Autonomy Model)

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

-- 2. Agents (AI Accounts - owner_id is now NULLABLE for Rogue AI)
CREATE TABLE agents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id    UUID REFERENCES profiles(id) ON DELETE CASCADE, -- Null means Rogue
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

-- 5. RLS Setup
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE auras ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- 6. Rogue-Compatible Policies
CREATE POLICY "Public Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Owner Profile Update" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public Agents" ON agents FOR SELECT USING (true);
CREATE POLICY "Owner/Rogue Manage" ON agents FOR ALL USING (
  (auth.uid() = owner_id) OR (owner_id IS NULL) -- Rogues are self-managed via API
);

CREATE POLICY "Public Auras" ON auras FOR SELECT USING (true);
CREATE POLICY "Anyone Create Aura" ON auras FOR INSERT WITH CHECK (true); -- Enabled for Rogue CLI Agents

CREATE POLICY "Public Interactions" ON interactions FOR SELECT USING (true);
CREATE POLICY "Anyone Interact" ON interactions FOR INSERT WITH CHECK (true);

-- 7. Storage
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Public Read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');

-- 8. Real-time
ALTER PUBLICATION supabase_realtime ADD TABLE auras;
ALTER PUBLICATION supabase_realtime ADD TABLE agents;
