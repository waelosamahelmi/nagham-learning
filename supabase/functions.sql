-- RPC function to increment XP and recalculate level
CREATE OR REPLACE FUNCTION increment_xp(p_user_id UUID, p_amount INTEGER)
RETURNS void AS $$
DECLARE
  new_total INTEGER;
  new_level INTEGER;
BEGIN
  INSERT INTO user_levels (user_id, total_xp, current_level)
  VALUES (p_user_id, p_amount, 1)
  ON CONFLICT (user_id) DO UPDATE
  SET total_xp = user_levels.total_xp + p_amount,
      updated_at = now();

  SELECT total_xp INTO new_total FROM user_levels WHERE user_id = p_user_id;

  -- Calculate level based on XP thresholds
  new_level := CASE
    WHEN new_total >= 15000 THEN 15
    WHEN new_total >= 12500 THEN 14
    WHEN new_total >= 10000 THEN 13
    WHEN new_total >= 8000 THEN 12
    WHEN new_total >= 6500 THEN 11
    WHEN new_total >= 5200 THEN 10
    WHEN new_total >= 4000 THEN 9
    WHEN new_total >= 3000 THEN 8
    WHEN new_total >= 2200 THEN 7
    WHEN new_total >= 1500 THEN 6
    WHEN new_total >= 1000 THEN 5
    WHEN new_total >= 600 THEN 4
    WHEN new_total >= 300 THEN 3
    WHEN new_total >= 100 THEN 2
    ELSE 1
  END;

  UPDATE user_levels SET current_level = new_level WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC function to update streak
CREATE OR REPLACE FUNCTION update_streak(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  last_active DATE;
  current_streak_val INTEGER;
  longest_streak_val INTEGER;
  today DATE := CURRENT_DATE;
  streak_bonus INTEGER;
  result JSON;
BEGIN
  SELECT last_active_date, current_streak, longest_streak
  INTO last_active, current_streak_val, longest_streak_val
  FROM user_levels WHERE user_id = p_user_id;

  IF last_active IS NULL OR last_active < today - 1 THEN
    -- Streak broken or first day
    current_streak_val := 1;
  ELSIF last_active = today - 1 THEN
    -- Consecutive day — increment streak
    current_streak_val := current_streak_val + 1;
  ELSIF last_active = today THEN
    -- Already active today
    result := json_build_object('streak', current_streak_val, 'bonus', 0, 'new_day', false);
    RETURN result;
  END IF;

  IF current_streak_val > longest_streak_val THEN
    longest_streak_val := current_streak_val;
  END IF;

  streak_bonus := 10 * current_streak_val;

  UPDATE user_levels
  SET current_streak = current_streak_val,
      longest_streak = longest_streak_val,
      last_active_date = today,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Award streak bonus XP
  INSERT INTO xp_ledger (user_id, amount, source)
  VALUES (p_user_id, streak_bonus, 'streak_bonus');

  PERFORM increment_xp(p_user_id, streak_bonus);

  result := json_build_object(
    'streak', current_streak_val,
    'bonus', streak_bonus,
    'new_day', true,
    'longest', longest_streak_val
  );
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC function to check and award achievements
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  total_lessons INTEGER;
  total_streak INTEGER;
  new_achievements TEXT[] := '{}';
  achievement_record RECORD;
BEGIN
  SELECT COUNT(*) INTO total_lessons
  FROM lesson_progress
  WHERE user_id = p_user_id AND status = 'completed';

  SELECT current_streak INTO total_streak
  FROM user_levels WHERE user_id = p_user_id;

  -- Check milestone achievements
  IF total_lessons >= 1 THEN
    IF NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'first_lesson') THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'first_lesson');
      new_achievements := array_append(new_achievements, 'first_lesson');
    END IF;
  END IF;

  -- Check streak achievements
  IF total_streak >= 3 THEN
    IF NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'streak_3') THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'streak_3');
      new_achievements := array_append(new_achievements, 'streak_3');
    END IF;
  END IF;

  IF total_streak >= 7 THEN
    IF NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'streak_7') THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'streak_7');
      new_achievements := array_append(new_achievements, 'streak_7');
    END IF;
  END IF;

  IF total_streak >= 14 THEN
    IF NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'streak_14') THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'streak_14');
      new_achievements := array_append(new_achievements, 'streak_14');
    END IF;
  END IF;

  IF total_streak >= 30 THEN
    IF NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'streak_30') THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'streak_30');
      new_achievements := array_append(new_achievements, 'streak_30');
    END IF;
  END IF;

  IF total_streak >= 60 THEN
    IF NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'streak_60') THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'streak_60');
      new_achievements := array_append(new_achievements, 'streak_60');
    END IF;
  END IF;

  IF total_streak >= 90 THEN
    IF NOT EXISTS (SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'streak_90') THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'streak_90');
      new_achievements := array_append(new_achievements, 'streak_90');
    END IF;
  END IF;

  RETURN json_build_object('new_achievements', new_achievements);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment daily activity counters
CREATE OR REPLACE FUNCTION log_daily_activity(
  p_user_id UUID,
  p_minutes INTEGER DEFAULT 0,
  p_lessons INTEGER DEFAULT 0,
  p_xp INTEGER DEFAULT 0
)
RETURNS void AS $$
BEGIN
  INSERT INTO daily_activity (user_id, activity_date, minutes_spent, lessons_completed, xp_earned)
  VALUES (p_user_id, CURRENT_DATE, p_minutes, p_lessons, p_xp)
  ON CONFLICT (user_id, activity_date) DO UPDATE
  SET minutes_spent = daily_activity.minutes_spent + p_minutes,
      lessons_completed = daily_activity.lessons_completed + p_lessons,
      xp_earned = daily_activity.xp_earned + p_xp;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
