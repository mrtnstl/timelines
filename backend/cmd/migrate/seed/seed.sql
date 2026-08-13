INSERT INTO users (
    id,
    google_sub,
    email,
    display_name
) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'google_sub_1',
    'user1@example.com',
    'User1'
),
(
    '22222222-2222-2222-2222-222222222222',
    'google_sub_2',
    'user2@example.com',
    'User2'
),
(
    '33333333-3333-3333-3333-333333333333',
    'google_sub_3',
    'user3@example.com',
    'User3'
);

INSERT INTO timelines (
    id,
    is_published,
    owner_id,
    public_id,
    title,
    version,
    created_at,
    updated_at,
    deleted_at
) VALUES
-- Owner 1 (active + published + soft-deleted)
(
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    false,
    '11111111-1111-1111-1111-111111111111',
    'pub_summer-vacation-2024',
    'Summer Vacation 2024',
    0,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days',
    NULL
),
(
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    false,
    '11111111-1111-1111-1111-111111111111',
    'pub_project-alpha',
    'Project Alpha Roadmap',
    2,
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '2 days',
    NULL
),
(
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    true,
    '11111111-1111-1111-1111-111111111111',
    'pub_family-history',
    'Family History Timeline',
    5,
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '1 day',
    NULL
),
(
    'd4e5f6a7-b8c9-0123-def0-234567890123',
    false,
    '11111111-1111-1111-1111-111111111111',
    'pub_old-project',
    'Old Abandoned Project',
    1,
    NOW() - INTERVAL '45 days',
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '5 days'          -- soft-deleted
),

-- Owner 2
(
    'e5f6a7b8-c9d0-1234-ef01-345678901234',
    true,
    '22222222-2222-2222-2222-222222222222',
    'pub_company-milestones',
    'Company Milestones 2018-2025',
    3,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '3 days',
    NULL
),
(
    'f6a7b8c9-d0e1-2345-f012-456789012345',
    false,
    '22222222-2222-2222-2222-222222222222',
    'pub_personal-goals',
    'Personal Goals 2026',
    0,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days',
    NULL
),
(
    'a7b8c9d0-e1f2-3456-0123-567890123456',
    true,
    '22222222-2222-2222-2222-222222222222',
    'pub_draft-presentation',
    'Draft Presentation Timeline',
    4,
    NOW() - INTERVAL '60 days',
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '8 days'           -- soft-deleted
),

-- Owner 3
(
    'b8c9d0e1-f2a3-4567-1234-678901234567',
    false,
    '33333333-3333-3333-3333-333333333333',
    'pub_wedding-planning',
    'Wedding Planning 2026',
    1,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day',
    NULL
);