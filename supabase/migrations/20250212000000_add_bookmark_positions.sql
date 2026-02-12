-- Add position columns for draggable bookmark cards
-- Run this in Supabase SQL Editor: Dashboard -> SQL Editor -> New Query
ALTER TABLE bookmarks
ADD COLUMN IF NOT EXISTS position_x INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS position_y INTEGER DEFAULT 0;

-- Update existing rows to have default positions
UPDATE bookmarks
SET position_x = COALESCE(position_x, 0), position_y = COALESCE(position_y, 0)
WHERE position_x IS NULL OR position_y IS NULL;
