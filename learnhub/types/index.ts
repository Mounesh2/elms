// ─────────────────────────────────────────────────────────────────────────────
// LearnHub — Master Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

// ─── User & Auth ─────────────────────────────────────────────────────────────
export type UserRole = 'student' | 'instructor' | 'admin'

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: UserRole
  bio?: string
  headline?: string
  website?: string
  twitter?: string
  linkedin?: string
  created_at: string
  updated_at: string
  is_verified: boolean
  is_banned: boolean
  stripe_customer_id?: string
  stripe_account_id?: string
}

export interface AuthSession {
  user: User
  access_token: string
  refresh_token: string
  expires_at: number
}

// ─── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  image_url?: string
  parent_id?: string
  parent?: Category
  children?: Category[]
  course_count?: number
  created_at: string
}

// ─── Course ───────────────────────────────────────────────────────────────────
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'all-levels'
export type CourseStatus = 'draft' | 'pending' | 'published' | 'archived'
export type CourseLanguage = 'english' | 'spanish' | 'french' | 'german' | 'hindi' | 'portuguese' | string

export interface Course {
  id: string
  slug: string
  title: string
  subtitle?: string
  description: string
  instructor_id: string
  instructor?: User
  category_id: string
  category?: Category
  thumbnail_url?: string
  preview_video_url?: string
  price: number
  original_price?: number
  discount_percent?: number
  level: CourseLevel
  language: CourseLanguage
  status: CourseStatus
  is_free: boolean
  has_certificate: boolean
  has_lifetime_access: boolean
  requirements: string[]
  what_you_learn: string[]
  who_is_for: string[]
  tags: string[]
  total_lectures: number
  total_sections: number
  total_duration_seconds: number
  total_students: number
  average_rating: number
  total_reviews: number
  last_updated: string
  created_at: string
  updated_at: string
}

// ─── Section & Lecture ────────────────────────────────────────────────────────
export type LectureType = 'video' | 'article' | 'quiz' | 'assignment' | 'resource'

export interface Section {
  id: string
  course_id: string
  title: string
  description?: string
  order_index: number
  lectures?: Lecture[]
  total_duration_seconds?: number
  created_at: string
  updated_at: string
}

export interface Lecture {
  id: string
  section_id: string
  course_id: string
  title: string
  description?: string
  type: LectureType
  video_url?: string
  cloudflare_video_id?: string
  article_content?: string
  duration_seconds?: number
  is_free_preview: boolean
  order_index: number
  resources?: LectureResource[]
  created_at: string
  updated_at: string
}

export interface LectureResource {
  id: string
  lecture_id: string
  name: string
  url: string
  type: 'pdf' | 'zip' | 'link' | 'other'
  size_bytes?: number
}

// ─── Enrollment & Progress ────────────────────────────────────────────────────
export type EnrollmentStatus = 'active' | 'completed' | 'refunded' | 'expired'

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  course?: Course
  status: EnrollmentStatus
  enrolled_at: string
  completed_at?: string
  payment_id?: string
  price_paid: number
  coupon_code?: string
  expiry_date?: string
}

export interface Progress {
  id: string
  user_id: string
  course_id: string
  lecture_id: string
  is_completed: boolean
  watch_time_seconds: number
  last_position_seconds: number
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface CourseProgress {
  course_id: string
  total_lectures: number
  completed_lectures: number
  percent_complete: number
  last_lecture_id?: string
  last_accessed_at?: string
}

// ─── Review & Rating ──────────────────────────────────────────────────────────
export interface Review {
  id: string
  course_id: string
  user_id: string
  user?: Pick<User, 'id' | 'full_name' | 'avatar_url'>
  rating: number
  title?: string
  content?: string
  is_verified_purchase: boolean
  helpful_count: number
  instructor_reply?: string
  instructor_replied_at?: string
  created_at: string
  updated_at: string
}

// ─── Q&A ─────────────────────────────────────────────────────────────────────
export interface Question {
  id: string
  course_id: string
  lecture_id?: string
  user_id: string
  user?: Pick<User, 'id' | 'full_name' | 'avatar_url'>
  title: string
  content: string
  answers?: Answer[]
  answer_count: number
  is_answered: boolean
  upvotes: number
  created_at: string
  updated_at: string
}

export interface Answer {
  id: string
  question_id: string
  user_id: string
  user?: Pick<User, 'id' | 'full_name' | 'avatar_url'>
  content: string
  is_instructor_answer: boolean
  upvotes: number
  is_accepted: boolean
  created_at: string
  updated_at: string
}

// ─── Cart & Checkout ─────────────────────────────────────────────────────────
export interface CartItem {
  course_id: string
  course: Course
  added_at: string
}

export interface Cart {
  items: CartItem[]
  total: number
  original_total: number
  savings: number
  coupon?: Coupon
}

// ─── Coupon ───────────────────────────────────────────────────────────────────
export type DiscountType = 'percent' | 'fixed'

export interface Coupon {
  id: string
  code: string
  description?: string
  discount_type: DiscountType
  discount_value: number
  max_uses?: number
  uses_count: number
  valid_from: string
  valid_until?: string
  course_id?: string
  created_by: string
  is_active: boolean
  created_at: string
}

// ─── Certificate ──────────────────────────────────────────────────────────────
export interface Certificate {
  id: string
  user_id: string
  course_id: string
  course?: Pick<Course, 'id' | 'title' | 'slug'>
  instructor?: Pick<User, 'id' | 'full_name'>
  certificate_number: string
  issued_at: string
  verification_url: string
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export interface WishlistItem {
  id: string
  user_id: string
  course_id: string
  course?: Course
  added_at: string
}

// ─── Payment ─────────────────────────────────────────────────────────────────
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded' | 'disputed'

export interface Payment {
  id: string
  user_id: string
  stripe_payment_intent_id: string
  amount: number
  currency: string
  status: PaymentStatus
  courses: string[]
  coupon_code?: string
  metadata?: Record<string, string>
  created_at: string
  updated_at: string
}

// ─── Instructor ───────────────────────────────────────────────────────────────
export interface InstructorProfile {
  user_id: string
  user?: User
  total_courses: number
  total_students: number
  total_revenue: number
  average_rating: number
  total_reviews: number
  payout_method?: 'stripe' | 'paypal' | 'bank'
  payout_details?: Record<string, string>
  is_approved: boolean
  approved_at?: string
  created_at: string
}

export interface InstructorRevenue {
  period: string
  gross: number
  platform_fee: number
  net: number
  transactions: number
}

// ─── Notification ─────────────────────────────────────────────────────────────
export type NotificationType =
  | 'enrollment'
  | 'completion'
  | 'new_review'
  | 'new_question'
  | 'new_answer'
  | 'payment'
  | 'refund'
  | 'certificate'
  | 'announcement'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  link?: string
  is_read: boolean
  created_at: string
}

// ─── Search ───────────────────────────────────────────────────────────────────
export interface SearchResult {
  id: string
  title: string
  slug: string
  description: string
  thumbnail_url?: string
  instructor_name: string
  category: string
  price: number
  average_rating: number
  total_students: number
  level: CourseLevel
  _highlightResult?: Record<string, { value: string }>
}

export interface SearchFilters {
  query?: string
  category?: string
  level?: CourseLevel
  language?: string
  price?: 'free' | 'paid'
  rating?: number
  duration?: 'short' | 'medium' | 'long'
  sortBy?: 'relevance' | 'newest' | 'rating' | 'popular' | 'price-asc' | 'price-desc'
  page?: number
  limit?: number
}

// ─── AI ───────────────────────────────────────────────────────────────────────
export interface AIRecommendation {
  course_id: string
  course?: Course
  score: number
  reason: string
}

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
  has_more: boolean
}

// ─── Upload ───────────────────────────────────────────────────────────────────
export interface UploadResponse {
  url: string
  key: string
  size: number
  content_type: string
}

export interface VideoUploadResponse extends UploadResponse {
  cloudflare_video_id?: string
  duration_seconds?: number
  thumbnail_url?: string
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────
export interface Quiz {
  id: string
  lecture_id: string
  title: string
  questions: QuizQuestion[]
  pass_percent: number
  time_limit_minutes?: number
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_option_index: number
  explanation?: string
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  user_id: string
  answers: number[]
  score: number
  passed: boolean
  completed_at: string
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface CourseAnalytics {
  course_id: string
  period: 'day' | 'week' | 'month' | 'year'
  enrollments: { date: string; count: number }[]
  revenue: { date: string; amount: number }[]
  completions: { date: string; count: number }[]
  avg_rating_over_time: { date: string; rating: number }[]
  top_countries: { country: string; count: number }[]
  completion_rate: number
  avg_watch_time_seconds: number
}
