CREATE TABLE IF NOT EXISTS timeline_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timeline_id UUID NOT NULL REFERENCES timelines(id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    date TEXT NOT NULL,
    description VARCHAR(200) NOT NULL DEFAULT '',
    image TEXT DEFAULT NULL,
    serial INTEGER NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_timeline_events_timeline_id ON timeline_events(timeline_id);