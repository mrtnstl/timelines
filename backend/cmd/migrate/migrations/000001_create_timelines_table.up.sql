CREATE TABLE IF NOT EXISTS timelines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    is_published BOOLEAN NOT NULL DEFAULT false,
    owner_id UUID NOT NULL, -- FK -> Users.id defined in 000004
    public_id TEXT NOT NULL UNIQUE,
    title VARCHAR(80) NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_timelines_owner_id 
ON timelines(owner_id, created_at);

CREATE INDEX IF NOT EXISTS idx_timelines_public_id 
ON timelines(public_id) 
WHERE is_published = true AND deleted_at IS NULL;
