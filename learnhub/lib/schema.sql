-- ═══════════════════════════════════════════════════════════════════
-- LearnHub — Complete Supabase PostgreSQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────
-- EXTENSIONS
-- ──────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- trigram similarity for search
CREATE EXTENSION IF NOT EXISTS "citext";    -- case-insensitive text

-- ──────────────────────────────────────────────────────────────────
-- CLEANUP (Run this to start fresh)
-- ──────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS profiles, categories, courses, sections, lectures, 
  quizzes, quiz_questions, quiz_attempts, enrollments, progress, 
  reviews, questions, answers, orders, instructor_revenue, coupons, 
  wishlists, certificates, notes, announcements, security_events, 
  rate_limits, dmca_reports CASCADE;

-- ──────────────────────────────────────────────────────────────────
-- HELPER: auto-update updated_at timestamp
-- ──────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ═══════════════════════════════════════════
-- TABLE 1: PROFILES  (extends auth.users)
-- ═══════════════════════════════════════════
CREATE TABLE profiles (
  id                      UUID PRIMARY KEY,  -- Linked to auth.users.id
  email                   CITEXT UNIQUE NOT NULL,
  full_name               TEXT,
  username                CITEXT UNIQUE,
  avatar_url              TEXT,
  bio                     TEXT,
  headline                TEXT,
  website_url             TEXT,
  twitter_url             TEXT,
  linkedin_url            TEXT,
  role                    TEXT NOT NULL DEFAULT 'student'
                            CHECK (role IN ('student', 'instructor', 'admin')),
  is_instructor           BOOLEAN NOT NULL DEFAULT false,
  is_admin                BOOLEAN NOT NULL DEFAULT false,
  is_banned               BOOLEAN NOT NULL DEFAULT false,
  ban_reason              TEXT,
  total_courses_enrolled  INT NOT NULL DEFAULT 0,
  total_courses_created   INT NOT NULL DEFAULT 0,
  stripe_customer_id      TEXT,
  stripe_connect_id       TEXT,       -- for instructor payouts
  payout_enabled          BOOLEAN NOT NULL DEFAULT false,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT;
  v_is_instructor BOOLEAN;
BEGIN
  -- Extract role and is_instructor from metadata, default to 'student' and false
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  v_is_instructor := COALESCE((NEW.raw_user_meta_data->>'is_instructor')::BOOLEAN, false);

  INSERT INTO profiles (
    id, 
    email, 
    full_name, 
    avatar_url, 
    role, 
    is_instructor
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    v_role,
    v_is_instructor
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error or just allow signup to proceed without a profile (less ideal but prevents signup block)
  -- RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ═══════════════════════════════════════════
-- TABLE 2: CATEGORIES
-- ═══════════════════════════════════════════
CREATE TABLE categories (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  description  TEXT,
  icon         TEXT,             -- emoji or icon name
  image_url    TEXT,
  parent_id    UUID REFERENCES categories(id) ON DELETE SET NULL,
  course_count INT NOT NULL DEFAULT 0,
  is_featured  BOOLEAN NOT NULL DEFAULT false,
  sort_order   INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO categories (name, slug, icon, sort_order, is_featured) VALUES
  ('Web Development',    'web-development',    '💻', 1,  true),
  ('Data Science',       'data-science',       '📊', 2,  true),
  ('Mobile Development', 'mobile-development', '📱', 3,  true),
  ('UI/UX Design',       'design',             '🎨', 4,  true),
  ('Business',           'business',           '💼', 5,  true),
  ('Marketing',          'marketing',          '📣', 6,  true),
  ('Photography',        'photography',        '📷', 7,  false),
  ('Music',              'music',              '🎵', 8,  false),
  ('DevOps & Cloud',     'devops',             '☁️', 9,  true),
  ('Cybersecurity',      'cybersecurity',      '🔐', 10, true),
  ('Artificial Intelligence', 'artificial-intelligence', '🤖', 11, true),
  ('Game Development',   'game-development',   '🎮', 12, false);


-- ═══════════════════════════════════════════
-- TABLE 3: COURSES
-- ═══════════════════════════════════════════
CREATE TABLE courses (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title                   TEXT NOT NULL,
  slug                    TEXT UNIQUE NOT NULL,
  subtitle                TEXT,
  description             TEXT,
  category_id             UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id          UUID REFERENCES categories(id) ON DELETE SET NULL,
  language                TEXT NOT NULL DEFAULT 'English',
  level                   TEXT NOT NULL DEFAULT 'All Levels'
                            CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
  thumbnail_url           TEXT,
  preview_video_url       TEXT,
  price                   DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  original_price          DECIMAL(10,2) CHECK (original_price >= 0),
  currency                TEXT NOT NULL DEFAULT 'USD',
  is_free                 BOOLEAN NOT NULL DEFAULT false,
  is_published            BOOLEAN NOT NULL DEFAULT false,
  is_featured             BOOLEAN NOT NULL DEFAULT false,
  is_approved             BOOLEAN NOT NULL DEFAULT false,
  status                  TEXT NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft', 'review', 'published', 'rejected', 'archived')),
  rejection_reason        TEXT,
  total_students          INT NOT NULL DEFAULT 0,
  total_reviews           INT NOT NULL DEFAULT 0,
  average_rating          DECIMAL(3,2) NOT NULL DEFAULT 0 CHECK (average_rating BETWEEN 0 AND 5),
  total_lectures          INT NOT NULL DEFAULT 0,
  total_duration_seconds  INT NOT NULL DEFAULT 0,
  requirements            TEXT[],
  what_you_will_learn     TEXT[],
  target_audience         TEXT[],
  tags                    TEXT[],
  seo_title               TEXT,
  seo_description         TEXT,
  last_updated            DATE,
  published_at            TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-set is_free when price = 0
CREATE OR REPLACE FUNCTION sync_course_is_free()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_free = (NEW.price = 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_is_free
  BEFORE INSERT OR UPDATE OF price ON courses
  FOR EACH ROW EXECUTE FUNCTION sync_course_is_free();

-- Auto-set published_at when course is published
CREATE OR REPLACE FUNCTION sync_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = true AND OLD.is_published = false THEN
    NEW.published_at = NOW();
    NEW.status = 'published';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_course_published_at
  BEFORE UPDATE OF is_published ON courses
  FOR EACH ROW EXECUTE FUNCTION sync_published_at();


-- ═══════════════════════════════════════════
-- TABLE 4: SECTIONS
-- ═══════════════════════════════════════════
CREATE TABLE sections (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id              UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title                  TEXT NOT NULL,
  sort_order             INT NOT NULL DEFAULT 0,
  total_lectures         INT NOT NULL DEFAULT 0,
  total_duration_seconds INT NOT NULL DEFAULT 0,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ═══════════════════════════════════════════
-- TABLE 5: LECTURES
-- ═══════════════════════════════════════════
CREATE TABLE lectures (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id             UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  section_id            UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  type                  TEXT NOT NULL DEFAULT 'video'
                          CHECK (type IN ('video', 'article', 'quiz', 'assignment', 'resource')),
  sort_order            INT NOT NULL DEFAULT 0,
  duration_seconds      INT NOT NULL DEFAULT 0,
  video_url             TEXT,             -- Cloudflare Stream embed URL
  cloudflare_video_id   TEXT,
  article_content       TEXT,             -- HTML/Markdown content
  is_free_preview       BOOLEAN NOT NULL DEFAULT false,
  is_published          BOOLEAN NOT NULL DEFAULT true,
  resources             JSONB NOT NULL DEFAULT '[]',  -- [{name, url, size, type}]
  transcript            TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_lectures_updated_at
  BEFORE UPDATE ON lectures
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- After insert/delete/update on lectures, recalculate section & course totals
CREATE OR REPLACE FUNCTION recalculate_course_lecture_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_course_id UUID;
  v_section_id UUID;
BEGIN
  v_course_id  := COALESCE(NEW.course_id, OLD.course_id);
  v_section_id := COALESCE(NEW.section_id, OLD.section_id);

  -- Update section
  UPDATE sections SET
    total_lectures         = (SELECT COUNT(*) FROM lectures WHERE section_id = v_section_id AND is_published),
    total_duration_seconds = (SELECT COALESCE(SUM(duration_seconds), 0) FROM lectures WHERE section_id = v_section_id AND is_published)
  WHERE id = v_section_id;

  -- Update course
  UPDATE courses SET
    total_lectures         = (SELECT COUNT(*) FROM lectures WHERE course_id = v_course_id AND is_published),
    total_duration_seconds = (SELECT COALESCE(SUM(duration_seconds), 0) FROM lectures WHERE course_id = v_course_id AND is_published),
    updated_at             = NOW()
  WHERE id = v_course_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_lecture_stats
  AFTER INSERT OR UPDATE OR DELETE ON lectures
  FOR EACH ROW EXECUTE FUNCTION recalculate_course_lecture_stats();


-- ═══════════════════════════════════════════
-- TABLE 6: QUIZZES
-- ═══════════════════════════════════════════
CREATE TABLE quizzes (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id           UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  course_id            UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title                TEXT NOT NULL,
  description          TEXT,
  pass_percentage      INT NOT NULL DEFAULT 80 CHECK (pass_percentage BETWEEN 1 AND 100),
  time_limit_minutes   INT CHECK (time_limit_minutes > 0),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quiz_questions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id     UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'multiple_choice'
                CHECK (type IN ('multiple_choice', 'true_false', 'short_answer')),
  options     JSONB,       -- [{text: "...", is_correct: true|false}]
  explanation TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quiz_attempts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id        UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  answers        JSONB NOT NULL DEFAULT '{}',  -- {question_id: selected_option_index}
  score          INT NOT NULL DEFAULT 0,        -- percentage 0–100
  passed         BOOLEAN NOT NULL DEFAULT false,
  time_taken_seconds INT,
  completed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ═══════════════════════════════════════════
-- TABLE 7: ENROLLMENTS
-- ═══════════════════════════════════════════
CREATE TABLE enrollments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id           UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  order_id            UUID,            -- references orders(id), set after order
  enrollment_type     TEXT NOT NULL DEFAULT 'paid'
                        CHECK (enrollment_type IN ('paid', 'free', 'gift', 'admin', 'coupon')),
  price_paid          DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency            TEXT NOT NULL DEFAULT 'USD',
  completed           BOOLEAN NOT NULL DEFAULT false,
  completed_at        TIMESTAMPTZ,
  progress_percentage INT NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  last_accessed_at    TIMESTAMPTZ,
  enrolled_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Increment counters when enrollment is created
CREATE OR REPLACE FUNCTION handle_new_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses SET total_students = total_students + 1 WHERE id = NEW.course_id;
  UPDATE categories SET course_count = course_count + 1
    WHERE id = (SELECT category_id FROM courses WHERE id = NEW.course_id);
  UPDATE profiles SET total_courses_enrolled = total_courses_enrolled + 1 WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_enrollment_created
  AFTER INSERT ON enrollments
  FOR EACH ROW EXECUTE FUNCTION handle_new_enrollment();

-- Decrement counters on refund/delete
CREATE OR REPLACE FUNCTION handle_enrollment_deleted()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses SET total_students = GREATEST(0, total_students - 1) WHERE id = OLD.course_id;
  UPDATE profiles SET total_courses_enrolled = GREATEST(0, total_courses_enrolled - 1)
    WHERE id = OLD.user_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_enrollment_deleted
  AFTER DELETE ON enrollments
  FOR EACH ROW EXECUTE FUNCTION handle_enrollment_deleted();


-- ═══════════════════════════════════════════
-- TABLE 8: PROGRESS
-- ═══════════════════════════════════════════
CREATE TABLE progress (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id             UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lecture_id            UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  completed             BOOLEAN NOT NULL DEFAULT false,
  watch_time_seconds    INT NOT NULL DEFAULT 0,
  last_position_seconds INT NOT NULL DEFAULT 0,
  completed_at          TIMESTAMPTZ,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lecture_id)
);

CREATE TRIGGER update_progress_updated_at
  BEFORE UPDATE ON progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Recalculate enrollment progress_percentage when a lecture is marked complete
CREATE OR REPLACE FUNCTION recalculate_enrollment_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_total_lectures   INT;
  v_done_lectures    INT;
  v_pct              INT;
BEGIN
  SELECT total_lectures INTO v_total_lectures FROM courses WHERE id = NEW.course_id;
  SELECT COUNT(*) INTO v_done_lectures FROM progress
    WHERE user_id = NEW.user_id AND course_id = NEW.course_id AND completed = true;

  IF v_total_lectures > 0 THEN
    v_pct := ROUND((v_done_lectures::DECIMAL / v_total_lectures) * 100);
  ELSE
    v_pct := 0;
  END IF;

  UPDATE enrollments SET
    progress_percentage = v_pct,
    completed           = (v_pct = 100),
    completed_at        = CASE WHEN v_pct = 100 AND completed = false THEN NOW() ELSE completed_at END,
    last_accessed_at    = NOW()
  WHERE user_id = NEW.user_id AND course_id = NEW.course_id;

  -- Auto-issue certificate when 100% complete
  IF v_pct = 100 THEN
    INSERT INTO certificates (user_id, course_id, certificate_number)
    VALUES (
      NEW.user_id,
      NEW.course_id,
      UPPER(SUBSTRING(MD5(NEW.user_id::TEXT || NEW.course_id::TEXT || NOW()::TEXT), 1, 16))
    )
    ON CONFLICT (user_id, course_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_progress_updated
  AFTER INSERT OR UPDATE OF completed ON progress
  FOR EACH ROW EXECUTE FUNCTION recalculate_enrollment_progress();


-- ═══════════════════════════════════════════
-- TABLE 9: REVIEWS
-- ═══════════════════════════════════════════
CREATE TABLE reviews (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id             UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  rating                INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title                 TEXT,
  body                  TEXT,
  instructor_reply      TEXT,
  instructor_replied_at TIMESTAMPTZ,
  is_verified           BOOLEAN NOT NULL DEFAULT true,
  is_flagged            BOOLEAN NOT NULL DEFAULT false,
  helpful_count         INT NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Recalculate course average_rating after insert/update/delete on reviews
CREATE OR REPLACE FUNCTION recalculate_course_rating()
RETURNS TRIGGER AS $$
DECLARE
  v_course_id UUID;
BEGIN
  v_course_id := COALESCE(NEW.course_id, OLD.course_id);
  UPDATE courses SET
    average_rating = (SELECT COALESCE(ROUND(AVG(rating)::NUMERIC, 2), 0) FROM reviews WHERE course_id = v_course_id AND NOT is_flagged),
    total_reviews  = (SELECT COUNT(*) FROM reviews WHERE course_id = v_course_id AND NOT is_flagged),
    updated_at     = NOW()
  WHERE id = v_course_id;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_course_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION recalculate_course_rating();


-- ═══════════════════════════════════════════
-- TABLE 10: Q&A (Questions & Answers)
-- ═══════════════════════════════════════════
CREATE TABLE questions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id    UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lecture_id   UUID REFERENCES lectures(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  body         TEXT,
  answer_count INT NOT NULL DEFAULT 0,
  upvote_count INT NOT NULL DEFAULT 0,
  is_answered  BOOLEAN NOT NULL DEFAULT false,
  is_flagged   BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE answers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id         UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body                TEXT NOT NULL,
  is_instructor_answer BOOLEAN NOT NULL DEFAULT false,
  is_best_answer      BOOLEAN NOT NULL DEFAULT false,
  upvote_count        INT NOT NULL DEFAULT 0,
  is_flagged          BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Keep answer_count in sync
CREATE OR REPLACE FUNCTION sync_question_answer_count()
RETURNS TRIGGER AS $$
DECLARE v_qid UUID;
BEGIN
  v_qid := COALESCE(NEW.question_id, OLD.question_id);
  UPDATE questions SET
    answer_count = (SELECT COUNT(*) FROM answers WHERE question_id = v_qid AND NOT is_flagged),
    is_answered  = (SELECT COUNT(*) > 0 FROM answers WHERE question_id = v_qid AND is_best_answer)
  WHERE id = v_qid;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_answer_count
  AFTER INSERT OR UPDATE OR DELETE ON answers
  FOR EACH ROW EXECUTE FUNCTION sync_question_answer_count();


-- ═══════════════════════════════════════════
-- TABLE 11: COUPONS
-- ═══════════════════════════════════════════
CREATE TABLE coupons (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id      UUID REFERENCES courses(id) ON DELETE CASCADE,
  code           TEXT UNIQUE NOT NULL,
  discount_type  TEXT NOT NULL DEFAULT 'percentage'
                   CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
  max_uses       INT CHECK (max_uses > 0),
  times_used     INT NOT NULL DEFAULT 0,
  expires_at     TIMESTAMPTZ,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Validate coupon applicability
CREATE OR REPLACE FUNCTION validate_coupon(
  p_code       TEXT,
  p_course_id  UUID DEFAULT NULL
) RETURNS TABLE(valid BOOLEAN, reason TEXT, discount_type TEXT, discount_value DECIMAL(10,2)) AS $$
DECLARE
  c coupons%ROWTYPE;
BEGIN
  SELECT * INTO c FROM coupons WHERE UPPER(code) = UPPER(p_code);
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Coupon not found', NULL::TEXT, NULL::DECIMAL(10,2); RETURN;
  END IF;
  IF NOT c.is_active THEN
    RETURN QUERY SELECT false, 'Coupon is inactive', NULL::TEXT, NULL::DECIMAL(10,2); RETURN;
  END IF;
  IF c.expires_at IS NOT NULL AND c.expires_at < NOW() THEN
    RETURN QUERY SELECT false, 'Coupon has expired', NULL::TEXT, NULL::DECIMAL(10,2); RETURN;
  END IF;
  IF c.max_uses IS NOT NULL AND c.times_used >= c.max_uses THEN
    RETURN QUERY SELECT false, 'Coupon usage limit reached', NULL::TEXT, NULL::DECIMAL(10,2); RETURN;
  END IF;
  IF c.course_id IS NOT NULL AND p_course_id IS NOT NULL AND c.course_id <> p_course_id THEN
    RETURN QUERY SELECT false, 'Coupon not valid for this course', NULL::TEXT, NULL::DECIMAL(10,2); RETURN;
  END IF;
  RETURN QUERY SELECT true, 'Valid', c.discount_type, c.discount_value;
END;
$$ LANGUAGE plpgsql;


-- ═══════════════════════════════════════════
-- TABLE 12: ORDERS
-- ═══════════════════════════════════════════
CREATE TABLE orders (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES profiles(id),
  stripe_payment_intent_id  TEXT UNIQUE,
  stripe_session_id         TEXT UNIQUE,
  amount_cents              INT NOT NULL CHECK (amount_cents >= 0),
  currency                  TEXT NOT NULL DEFAULT 'USD',
  status                    TEXT NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  coupon_id                 UUID REFERENCES coupons(id) ON DELETE SET NULL,
  discount_amount_cents     INT NOT NULL DEFAULT 0,
  items                     JSONB NOT NULL,   -- [{course_id, price_cents, instructor_id}]
  refunded                  BOOLEAN NOT NULL DEFAULT false,
  refund_reason             TEXT,
  refunded_at               TIMESTAMPTZ,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ═══════════════════════════════════════════
-- TABLE 13: INSTRUCTOR REVENUE
-- ═══════════════════════════════════════════
CREATE TABLE instructor_revenue (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id            UUID NOT NULL REFERENCES profiles(id),
  order_id                 UUID NOT NULL REFERENCES orders(id),
  course_id                UUID NOT NULL REFERENCES courses(id),
  gross_amount_cents       INT NOT NULL,
  platform_fee_cents       INT NOT NULL,       -- 30% platform cut
  instructor_amount_cents  INT NOT NULL,        -- 70% instructor earnings
  currency                 TEXT NOT NULL DEFAULT 'USD',
  payout_status            TEXT NOT NULL DEFAULT 'pending'
                             CHECK (payout_status IN ('pending', 'paid', 'held', 'failed')),
  payout_id                TEXT,               -- Stripe Transfer ID
  payout_date              TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



-- ═══════════════════════════════════════════
-- TABLE 14: WISHLISTS
-- ═══════════════════════════════════════════
CREATE TABLE wishlists (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id  UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);


-- ═══════════════════════════════════════════
-- TABLE 15: CERTIFICATES
-- ═══════════════════════════════════════════
CREATE TABLE certificates (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id          UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);


-- ═══════════════════════════════════════════
-- TABLE 16: NOTES
-- ═══════════════════════════════════════════
CREATE TABLE notes (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id          UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lecture_id         UUID NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
  content            TEXT NOT NULL,
  timestamp_seconds  INT NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ═══════════════════════════════════════════
-- TABLE 17: ANNOUNCEMENTS
-- ═══════════════════════════════════════════
CREATE TABLE announcements (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id      UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  body           TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ═══════════════════════════════════════════
-- TABLE 18: SECURITY EVENTS (audit log)
-- ═══════════════════════════════════════════
CREATE TABLE security_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type  TEXT NOT NULL,
  severity    TEXT NOT NULL DEFAULT 'low'
                CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ip_address  TEXT,
  user_agent  TEXT,
  details     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ═══════════════════════════════════════════
-- TABLE 19: RATE LIMITS (DB-backed fallback)
-- ═══════════════════════════════════════════
CREATE TABLE rate_limits (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier   TEXT NOT NULL,      -- IP, user_id, etc.
  action       TEXT NOT NULL,      -- 'login', 'enroll', etc.
  count        INT NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(identifier, action)
);


-- ═══════════════════════════════════════════
-- TABLE 20: DMCA REPORTS
-- ═══════════════════════════════════════════
CREATE TABLE dmca_reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id   UUID NOT NULL REFERENCES profiles(id),
  course_id     UUID REFERENCES courses(id) ON DELETE SET NULL,
  lecture_id    UUID REFERENCES lectures(id) ON DELETE SET NULL,
  reason        TEXT NOT NULL,
  details       TEXT,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'reviewed', 'resolved', 'rejected')),
  admin_notes   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ═══════════════════════════════════════════
-- PERFORMANCE INDEXES
-- ═══════════════════════════════════════════

-- Profiles
CREATE INDEX idx_profiles_role           ON profiles(role);
CREATE INDEX idx_profiles_is_instructor  ON profiles(is_instructor) WHERE is_instructor;
CREATE INDEX idx_profiles_stripe         ON profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- Categories
CREATE INDEX idx_categories_parent       ON categories(parent_id);
CREATE INDEX idx_categories_featured     ON categories(is_featured) WHERE is_featured;
CREATE INDEX idx_categories_sort         ON categories(sort_order);

-- Courses
CREATE INDEX idx_courses_instructor      ON courses(instructor_id);
CREATE INDEX idx_courses_category        ON courses(category_id);
CREATE INDEX idx_courses_status          ON courses(status);
CREATE INDEX idx_courses_published       ON courses(is_published, is_approved) WHERE is_published AND is_approved;
CREATE INDEX idx_courses_featured        ON courses(is_featured) WHERE is_featured;
CREATE INDEX idx_courses_rating          ON courses(average_rating DESC);
CREATE INDEX idx_courses_students        ON courses(total_students DESC);
CREATE INDEX idx_courses_price           ON courses(price);
CREATE INDEX idx_courses_level           ON courses(level);
CREATE INDEX idx_courses_language        ON courses(language);
CREATE INDEX idx_courses_created         ON courses(created_at DESC);
-- Full-text search on courses
CREATE INDEX idx_courses_fts ON courses USING GIN(
  to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(subtitle, '') || ' ' || COALESCE(description, ''))
);
-- Trigram index for LIKE/ILIKE search
CREATE INDEX idx_courses_title_trgm ON courses USING GIN(title gin_trgm_ops);

-- Sections
CREATE INDEX idx_sections_course         ON sections(course_id);
CREATE INDEX idx_sections_order          ON sections(course_id, sort_order);

-- Lectures
CREATE INDEX idx_lectures_course         ON lectures(course_id);
CREATE INDEX idx_lectures_section        ON lectures(section_id);
CREATE INDEX idx_lectures_order          ON lectures(section_id, sort_order);
CREATE INDEX idx_lectures_free_preview   ON lectures(is_free_preview) WHERE is_free_preview;

-- Quiz
CREATE INDEX idx_quizzes_lecture         ON quizzes(lecture_id);
CREATE INDEX idx_quiz_questions_quiz     ON quiz_questions(quiz_id, sort_order);
CREATE INDEX idx_quiz_attempts_user      ON quiz_attempts(user_id, quiz_id);

-- Enrollments
CREATE INDEX idx_enrollments_user        ON enrollments(user_id);
CREATE INDEX idx_enrollments_course      ON enrollments(course_id);
CREATE INDEX idx_enrollments_completed   ON enrollments(completed) WHERE completed;

-- Progress
CREATE INDEX idx_progress_user_course    ON progress(user_id, course_id);
CREATE INDEX idx_progress_lecture        ON progress(lecture_id);

-- Reviews
CREATE INDEX idx_reviews_course          ON reviews(course_id);
CREATE INDEX idx_reviews_user            ON reviews(user_id);
CREATE INDEX idx_reviews_rating          ON reviews(course_id, rating DESC);
CREATE INDEX idx_reviews_flagged         ON reviews(is_flagged) WHERE is_flagged;

-- Q&A
CREATE INDEX idx_questions_course        ON questions(course_id);
CREATE INDEX idx_questions_lecture       ON questions(lecture_id);
CREATE INDEX idx_questions_user          ON questions(user_id);
CREATE INDEX idx_answers_question        ON answers(question_id);
CREATE INDEX idx_answers_user            ON answers(user_id);

-- Orders
CREATE INDEX idx_orders_user             ON orders(user_id);
CREATE INDEX idx_orders_status           ON orders(status);
CREATE INDEX idx_orders_stripe_pi        ON orders(stripe_payment_intent_id);

-- Revenue
CREATE INDEX idx_revenue_instructor      ON instructor_revenue(instructor_id);
CREATE INDEX idx_revenue_payout_status   ON instructor_revenue(payout_status);
CREATE INDEX idx_revenue_course          ON instructor_revenue(course_id);

-- Coupons
CREATE INDEX idx_coupons_code            ON coupons(UPPER(code));
CREATE INDEX idx_coupons_course          ON coupons(course_id);
CREATE INDEX idx_coupons_instructor      ON coupons(instructor_id);
CREATE INDEX idx_coupons_active          ON coupons(is_active) WHERE is_active;

-- Wishlists
CREATE INDEX idx_wishlists_user          ON wishlists(user_id);
CREATE INDEX idx_wishlists_course        ON wishlists(course_id);

-- Certificates
CREATE INDEX idx_certificates_user       ON certificates(user_id);

-- Notes
CREATE INDEX idx_notes_user_lecture      ON notes(user_id, lecture_id);

-- Announcements
CREATE INDEX idx_announcements_course    ON announcements(course_id);

-- Security events
CREATE INDEX idx_security_user           ON security_events(user_id);
CREATE INDEX idx_security_type           ON security_events(event_type);
CREATE INDEX idx_security_created        ON security_events(created_at DESC);

-- Rate limits
CREATE INDEX idx_rate_limits_identifier  ON rate_limits(identifier, action);
CREATE INDEX idx_rate_limits_window      ON rate_limits(window_start);


-- ═══════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════

ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections         ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures         ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress         ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews          ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders           ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons          ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists        ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits      ENABLE ROW LEVEL SECURITY;
ALTER TABLE dmca_reports     ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────
-- Helper: is the current user an admin?
-- ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_instructor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_instructor);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ──────────── PROFILES ────────────────────
CREATE POLICY "profiles_public_read"    ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_self_update"    ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_admin_all"      ON profiles USING (is_admin());

-- ──────────── CATEGORIES ──────────────────
CREATE POLICY "categories_public_read"  ON categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_write"  ON categories FOR ALL USING (is_admin());

-- ──────────── COURSES ─────────────────────
-- Published courses are visible to all; drafts only to their instructor or admin
CREATE POLICY "courses_read" ON courses FOR SELECT USING (
  is_published AND is_approved
  OR auth.uid() = instructor_id
  OR is_admin()
);
CREATE POLICY "courses_instructor_insert" ON courses FOR INSERT
  WITH CHECK (auth.uid() = instructor_id AND is_instructor());
CREATE POLICY "courses_instructor_update" ON courses FOR UPDATE
  USING (auth.uid() = instructor_id OR is_admin());
CREATE POLICY "courses_admin_delete" ON courses FOR DELETE
  USING (auth.uid() = instructor_id OR is_admin());

-- ──────────── SECTIONS ────────────────────
CREATE POLICY "sections_read" ON sections FOR SELECT USING (
  EXISTS (SELECT 1 FROM courses c WHERE c.id = course_id AND (c.is_published OR c.instructor_id = auth.uid() OR is_admin()))
);
CREATE POLICY "sections_instructor_write" ON sections FOR ALL
  USING (EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid()) OR is_admin());

-- ──────────── LECTURES ────────────────────
CREATE POLICY "lectures_enrolled_or_preview" ON lectures FOR SELECT USING (
  is_free_preview                          -- free preview: anyone
  OR is_admin()
  OR EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid())
  OR EXISTS (SELECT 1 FROM enrollments WHERE course_id = lectures.course_id AND user_id = auth.uid())
);
CREATE POLICY "lectures_instructor_write" ON lectures FOR ALL
  USING (EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid()) OR is_admin());

-- ──────────── QUIZZES ─────────────────────
CREATE POLICY "quizzes_enrolled" ON quizzes FOR SELECT USING (
  is_admin()
  OR EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid())
  OR EXISTS (SELECT 1 FROM enrollments WHERE course_id = quizzes.course_id AND user_id = auth.uid())
);
CREATE POLICY "quiz_questions_enrolled" ON quiz_questions FOR SELECT USING (
  EXISTS (SELECT 1 FROM quizzes q
    WHERE q.id = quiz_id
    AND (is_admin()
      OR EXISTS (SELECT 1 FROM courses c WHERE c.id = q.course_id AND c.instructor_id = auth.uid())
      OR EXISTS (SELECT 1 FROM enrollments e WHERE e.course_id = q.course_id AND e.user_id = auth.uid())))
);
CREATE POLICY "quiz_attempts_own" ON quiz_attempts FOR ALL USING (auth.uid() = user_id OR is_admin());

-- ──────────── ENROLLMENTS ─────────────────
CREATE POLICY "enrollments_own" ON enrollments FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "enrollments_instructor_view" ON enrollments FOR SELECT
  USING (EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid()));
CREATE POLICY "enrollments_insert" ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "enrollments_admin" ON enrollments FOR ALL USING (is_admin());

-- ──────────── PROGRESS ────────────────────
CREATE POLICY "progress_own" ON progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "progress_instructor_view" ON progress FOR SELECT
  USING (EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid()));
CREATE POLICY "progress_admin" ON progress FOR ALL USING (is_admin());

-- ──────────── REVIEWS ─────────────────────
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (NOT is_flagged OR is_admin());
CREATE POLICY "reviews_own_write"   ON reviews FOR INSERT WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (SELECT 1 FROM enrollments WHERE course_id = reviews.course_id AND user_id = auth.uid())
);
CREATE POLICY "reviews_own_update"  ON reviews FOR UPDATE USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "reviews_admin"       ON reviews FOR ALL USING (is_admin());

-- ──────────── Q&A ─────────────────────────
CREATE POLICY "questions_read"    ON questions FOR SELECT USING (NOT is_flagged OR is_admin());
CREATE POLICY "questions_enroll"  ON questions FOR INSERT WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (SELECT 1 FROM enrollments WHERE course_id = questions.course_id AND user_id = auth.uid())
);
CREATE POLICY "questions_own"     ON questions FOR UPDATE USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "answers_read"      ON answers FOR SELECT USING (NOT is_flagged OR is_admin());
CREATE POLICY "answers_enroll"    ON answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "answers_own"       ON answers FOR UPDATE USING (auth.uid() = user_id OR is_admin());

-- ──────────── ORDERS ──────────────────────
CREATE POLICY "orders_own"   ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "orders_admin" ON orders FOR ALL USING (is_admin());

-- ──────────── REVENUE ─────────────────────
CREATE POLICY "revenue_instructor" ON instructor_revenue FOR SELECT USING (auth.uid() = instructor_id OR is_admin());
CREATE POLICY "revenue_admin"      ON instructor_revenue FOR ALL USING (is_admin());

-- ──────────── COUPONS ─────────────────────
CREATE POLICY "coupons_public_read" ON coupons FOR SELECT USING (is_active);
CREATE POLICY "coupons_instructor" ON coupons FOR ALL
  USING (auth.uid() = instructor_id OR is_admin());

-- ──────────── WISHLISTS ───────────────────
CREATE POLICY "wishlists_own" ON wishlists FOR ALL USING (auth.uid() = user_id);

-- ──────────── CERTIFICATES ────────────────
CREATE POLICY "certificates_own"    ON certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "certificates_public" ON certificates FOR SELECT USING (true);  -- public verification
CREATE POLICY "certificates_admin"  ON certificates FOR ALL USING (is_admin());

-- ──────────── NOTES ───────────────────────
CREATE POLICY "notes_own" ON notes FOR ALL USING (auth.uid() = user_id);

-- ──────────── ANNOUNCEMENTS ───────────────
CREATE POLICY "announcements_read" ON announcements FOR SELECT USING (
  EXISTS (SELECT 1 FROM enrollments WHERE course_id = announcements.course_id AND user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM courses WHERE id = announcements.course_id AND instructor_id = auth.uid())
  OR is_admin()
);
CREATE POLICY "announcements_write" ON announcements FOR INSERT WITH CHECK (
  auth.uid() = instructor_id
  AND EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid())
);

-- ──────────── SECURITY / RATE LIMITS ──────
CREATE POLICY "security_events_own"   ON security_events FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "security_events_admin" ON security_events FOR ALL USING (is_admin());
CREATE POLICY "rate_limits_own"       ON rate_limits FOR ALL USING (is_admin());

-- ──────────── DMCA ────────────────────────
CREATE POLICY "dmca_own"   ON dmca_reports FOR SELECT USING (auth.uid() = reporter_id OR is_admin());
CREATE POLICY "dmca_insert" ON dmca_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "dmca_admin" ON dmca_reports FOR ALL USING (is_admin());


-- ═══════════════════════════════════════════
-- HELPER / RPC FUNCTIONS (callable from API)
-- ═══════════════════════════════════════════

-- Increment coupon usage
CREATE OR REPLACE FUNCTION increment_coupon_usage(p_code TEXT)
RETURNS VOID AS $$
  UPDATE coupons SET times_used = times_used + 1 WHERE UPPER(code) = UPPER(p_code);
$$ LANGUAGE sql SECURITY DEFINER;

-- Full-text course search (Supabase RPC)
CREATE OR REPLACE FUNCTION search_courses(
  p_query       TEXT DEFAULT '',
  p_category    UUID DEFAULT NULL,
  p_level       TEXT DEFAULT NULL,
  p_is_free     BOOLEAN DEFAULT NULL,
  p_min_rating  DECIMAL DEFAULT 0,
  p_order_by    TEXT DEFAULT 'relevance',  -- relevance | newest | rating | popular | price_asc | price_desc
  p_limit       INT DEFAULT 20,
  p_offset      INT DEFAULT 0
)
RETURNS TABLE(
  id              UUID,
  title           TEXT,
  slug            TEXT,
  subtitle        TEXT,
  thumbnail_url   TEXT,
  price           DECIMAL(10,2),
  original_price  DECIMAL(10,2),
  is_free         BOOLEAN,
  level           TEXT,
  language        TEXT,
  total_students  INT,
  total_reviews   INT,
  average_rating  DECIMAL(3,2),
  total_duration_seconds INT,
  instructor_name TEXT,
  instructor_id   UUID,
  category_name   TEXT,
  category_slug   TEXT,
  rank            FLOAT4
) AS $$
  SELECT
    c.id, c.title, c.slug, c.subtitle, c.thumbnail_url,
    c.price, c.original_price, c.is_free, c.level, c.language,
    c.total_students, c.total_reviews, c.average_rating, c.total_duration_seconds,
    p.full_name,  p.id,
    cat.name, cat.slug,
    CASE WHEN p_query = '' THEN 1.0
         ELSE ts_rank(
           to_tsvector('english', COALESCE(c.title,'') || ' ' || COALESCE(c.subtitle,'') || ' ' || COALESCE(c.description,'')),
           plainto_tsquery('english', p_query)
         )
    END AS rank
  FROM courses c
  LEFT JOIN profiles p ON p.id = c.instructor_id
  LEFT JOIN categories cat ON cat.id = c.category_id
  WHERE c.is_published AND c.is_approved
    AND (p_query = '' OR to_tsvector('english', COALESCE(c.title,'') || ' ' || COALESCE(c.subtitle,'') || ' ' || COALESCE(c.description,'')) @@ plainto_tsquery('english', p_query))
    AND (p_category IS NULL OR c.category_id = p_category)
    AND (p_level IS NULL OR c.level = p_level)
    AND (p_is_free IS NULL OR c.is_free = p_is_free)
    AND c.average_rating >= p_min_rating
  ORDER BY
    CASE p_order_by
      WHEN 'newest'     THEN EXTRACT(EPOCH FROM c.created_at)
      WHEN 'rating'     THEN c.average_rating::FLOAT8
      WHEN 'popular'    THEN c.total_students::FLOAT8
      WHEN 'price_asc'  THEN -c.price::FLOAT8
      WHEN 'price_desc' THEN c.price::FLOAT8
      ELSE (CASE WHEN p_query = '' THEN 1.0
                 ELSE ts_rank(to_tsvector('english', COALESCE(c.title,'') || ' ' || COALESCE(c.subtitle,'') || ' ' || COALESCE(c.description,'')), plainto_tsquery('english', p_query))
            END)::FLOAT8
    END DESC
  LIMIT p_limit OFFSET p_offset;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Get student course progress summary
CREATE OR REPLACE FUNCTION get_course_progress(p_user_id UUID, p_course_id UUID)
RETURNS TABLE(
  total_lectures INT,
  completed_lectures INT,
  progress_percentage INT,
  last_lecture_id UUID,
  last_position_seconds INT
) AS $$
  SELECT
    c.total_lectures,
    COUNT(pr.id) FILTER (WHERE pr.completed)::INT,
    COALESCE(e.progress_percentage, 0),
    (SELECT lecture_id FROM progress
       WHERE user_id = p_user_id AND course_id = p_course_id
       ORDER BY updated_at DESC LIMIT 1),
    (SELECT last_position_seconds FROM progress
       WHERE user_id = p_user_id AND course_id = p_course_id
       ORDER BY updated_at DESC LIMIT 1)
  FROM courses c
  LEFT JOIN enrollments e ON e.course_id = c.id AND e.user_id = p_user_id
  LEFT JOIN progress pr   ON pr.course_id = c.id AND pr.user_id = p_user_id
  WHERE c.id = p_course_id
  GROUP BY c.total_lectures, e.progress_percentage;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Instructor dashboard stats
CREATE OR REPLACE FUNCTION get_instructor_stats(p_instructor_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_courses',   (SELECT COUNT(*) FROM courses WHERE instructor_id = p_instructor_id),
    'total_students',  (SELECT COALESCE(SUM(total_students), 0) FROM courses WHERE instructor_id = p_instructor_id),
    'total_reviews',   (SELECT COALESCE(SUM(total_reviews), 0)  FROM courses WHERE instructor_id = p_instructor_id),
    'average_rating',  (SELECT COALESCE(ROUND(AVG(average_rating)::NUMERIC, 2), 0) FROM courses WHERE instructor_id = p_instructor_id AND total_reviews > 0),
    'total_revenue',   (SELECT COALESCE(SUM(instructor_amount_cents), 0) FROM instructor_revenue WHERE instructor_id = p_instructor_id AND payout_status = 'paid'),
    'pending_revenue', (SELECT COALESCE(SUM(instructor_amount_cents), 0) FROM instructor_revenue WHERE instructor_id = p_instructor_id AND payout_status = 'pending')
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Admin platform stats
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS JSON AS $$
  SELECT json_build_object(
    'total_users',      (SELECT COUNT(*) FROM profiles),
    'total_instructors',(SELECT COUNT(*) FROM profiles WHERE is_instructor),
    'total_courses',    (SELECT COUNT(*) FROM courses WHERE is_published),
    'total_enrollments',(SELECT COUNT(*) FROM enrollments),
    'total_revenue',    (SELECT COALESCE(SUM(amount_cents), 0) FROM orders WHERE status = 'completed'),
    'total_reviews',    (SELECT COUNT(*) FROM reviews WHERE NOT is_flagged),
    'pending_courses',  (SELECT COUNT(*) FROM courses WHERE status = 'review')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- ═══════════════════════════════════════════
-- STORAGE BUCKETS (run in Supabase dashboard)
-- ═══════════════════════════════════════════
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('thumbnails',   'thumbnails',   true),
--   ('avatars',      'avatars',      true),
--   ('resources',    'resources',    false),
--   ('certificates', 'certificates', true);

-- ═══════════════════════════════════════════
-- END OF SCHEMA
-- ═══════════════════════════════════════════
