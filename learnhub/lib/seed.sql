-- ═══════════════════════════════════════════════════════════════════
-- LearnHub — Sample Seed Data
-- Run this AFTER running schema.sql in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- 1. Create a "Seed Instructor" Profile
-- NOTE: We use a hardcoded UUID for the instructor so course references work.
-- In a real app, this would be a user who signed up, but for seeding we insert it directly.
INSERT INTO profiles (id, email, full_name, headline, bio, role, is_instructor)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'instructor@learnhub.com', 'Dr. Angela Yu', 'Professional Developer & Instructor', 'Teaching millions of students how to code since 2015.', 'instructor', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Sample Courses
INSERT INTO courses (
  id, instructor_id, title, slug, subtitle, description, 
  price, original_price, level, thumbnail_url, category_id, 
  is_published, is_approved, status, average_rating, total_reviews, total_students
) VALUES
(
  '11111111-1111-1111-1111-111111111111', 
  '00000000-0000-0000-0000-000000000001',
  'The Complete 2024 Web Development Bootcamp',
  'complete-web-development-bootcamp',
  'Become a Full-Stack Web Developer with just ONE course. HTML, CSS, JS, Node, React, PostgreSQL and more!',
  'Welcome to the Complete Web Development Bootcamp, the only course you need to learn to code and become a full-stack web developer. At over 60+ hours, this web development course is without a doubt the most comprehensive web development course available online.',
  14.99, 94.99, 'Beginner',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1280&h=720',
  (SELECT id FROM categories WHERE slug = 'web-development' LIMIT 1),
  true, true, 'published', 4.8, 12453, 67234
),
(
  '22222222-2222-2222-2222-222222222222', 
  '00000000-0000-0000-0000-000000000001',
  'Python for Data Science and Machine Learning',
  'python-data-science-machine-learning',
  'Learn how to use NumPy, Pandas, Seaborn, Matplotlib, Scikit-Learn, Machine Learning, Tensorflow, and more!',
  'This comprehensive course will be your guide to learning how to use the power of Python to analyze data, create beautiful visualizations, and use powerful machine learning algorithms!',
  19.99, 129.99, 'Intermediate',
  'https://images.unsplash.com/photo-1551288049-bbbda536ad80?auto=format&fit=crop&q=80&w=1280&h=720',
  (SELECT id FROM categories WHERE slug = 'data-science' LIMIT 1),
  true, true, 'published', 4.7, 8920, 45100
),
(
  '33333333-3333-3333-3333-333333333333', 
  '00000000-0000-0000-0000-000000000001',
  'Ultimate AWS Certified Solutions Architect Associate',
  'aws-solutions-architect-associate',
  'Pass the AWS Certified Solutions Architect Associate Certification SAA-C03 with help from an expert!',
  'AWS is the most popular and widely used cloud platform in the world. This course will teach you everything you need to pass the certification exam and build cloud infrastructure like a pro.',
  12.99, 84.99, 'All Levels',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1280&h=720',
  (SELECT id FROM categories WHERE slug = 'devops' LIMIT 1),
  true, true, 'published', 4.9, 15600, 89000
),
(
  '44444444-4444-4444-4444-444444444444', 
  '00000000-0000-0000-0000-000000000001',
  'Modern UI/UX Design with Figma',
  'modern-ui-ux-design-figma',
  'Master Figma and learn high-end UI/UX design from scratch. Theory, projects, and portfolio building.',
  'Learn the fundamentals of UI/UX design and how to use Figma to create stunning mobile and web interfaces. We cover typography, color theory, layout, and prototyping.',
  17.99, 74.99, 'Beginner',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1280&h=720',
  (SELECT id FROM categories WHERE slug = 'design' LIMIT 1),
  true, true, 'published', 4.6, 5430, 21000
),
(
  '55555555-5555-5555-5555-555555555555', 
  '00000000-0000-0000-0000-000000000001',
  'Digital Marketing Masterclass: 23 Courses in 1',
  'digital-marketing-masterclass',
  'Social Media Marketing, SEO, YouTube, Email, Facebook Ads, Google Analytics and more!',
  'Stop wasting money on marketing that does not work. Learn the proven strategies used by top digital marketers to grow businesses from scratch.',
  11.99, 199.99, 'All Levels',
  'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1280&h=720',
  (SELECT id FROM categories WHERE slug = 'marketing' LIMIT 1),
  true, true, 'published', 4.5, 9320, 56000
),
(
  '66666666-6666-6666-6666-666666666666', 
  '00000000-0000-0000-0000-000000000001',
  'Artificial Intelligence for Business Leaders',
  'ai-for-business-leaders',
  'Understand AI, Machine Learning, and Deep Learning. Implement AI strategies in your company.',
  'AI is changing the world. As a business leader, you need to understand how to leverage these technologies to stay ahead of the competition.',
  24.99, 149.99, 'Advanced',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1280&h=720',
  (SELECT id FROM categories WHERE slug = 'artificial-intelligence' LIMIT 1),
  true, true, 'published', 4.8, 1200, 4500
);

-- 3. Insert Sample Sections for Course 1
INSERT INTO sections (id, course_id, title, sort_order) VALUES
('11111111-1111-1111-1111-222222222222', '11111111-1111-1111-1111-111111111111', 'Introduction to Web Development', 1),
('22222222-1111-1111-1111-222222222222', '11111111-1111-1111-1111-111111111111', 'HTML Foundations', 2),
('33333333-1111-1111-1111-222222222222', '11111111-1111-1111-1111-111111111111', 'CSS Styling Masterclass', 3);

-- 4. Insert Sample Lectures for Course 1
INSERT INTO lectures (id, course_id, section_id, title, type, sort_order, video_url, is_free_preview) VALUES
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-222222222222', 'Course Welcome & Overview', 'video', 1, 'https://www.youtube.com/watch?v=kum6iQiO-6w', true),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-222222222222', 'How the Internet Works', 'video', 2, 'https://www.youtube.com/watch?v=7_LPdttKXPc', true),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '22222222-1111-1111-1111-222222222222', 'HTML Tags & Structure', 'video', 1, 'https://www.youtube.com/watch?v=MDLn5-zSQQI', false),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '22222222-1111-1111-1111-222222222222', 'Lists, Tables & Forms', 'video', 2, 'https://www.youtube.com/watch?v=PlxWf493en4', false),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '33333333-1111-1111-1111-222222222222', 'Selectors & Colors', 'video', 1, 'https://www.youtube.com/watch?v=yfoY53QXEnI', false);

-- 5. Final Confirmation Message
-- The triggers in schema.sql will automatically calculate totals for students, lectures, and durations.
