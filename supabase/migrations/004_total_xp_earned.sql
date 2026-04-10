-- Add total_xp_earned to players table
-- Tracks cumulative XP ever gained (never decreases, unlike xp_general which resets on level-up)
ALTER TABLE players
  ADD COLUMN IF NOT EXISTS total_xp_earned INTEGER NOT NULL DEFAULT 0;
