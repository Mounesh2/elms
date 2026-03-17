import { MeiliSearch } from 'meilisearch'
import type { Course } from '@/types'

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST ?? 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_ADMIN_API_KEY,
})

const COURSES_INDEX = 'courses'

// ─── Initialize indexes ───────────────────────────────────────────────────────
export async function initializeSearchIndexes() {
  const index = client.index(COURSES_INDEX)

  await index.updateSettings({
    searchableAttributes: [
      'title',
      'subtitle',
      'description',
      'instructor_name',
      'category',
      'tags',
    ],
    filterableAttributes: [
      'category_id',
      'level',
      'language',
      'price',
      'is_free',
      'average_rating',
      'status',
    ],
    sortableAttributes: [
      'price',
      'average_rating',
      'total_students',
      'created_at',
    ],
    displayedAttributes: [
      'id',
      'slug',
      'title',
      'subtitle',
      'description',
      'thumbnail_url',
      'instructor_id',
      'instructor_name',
      'category_id',
      'category',
      'price',
      'original_price',
      'level',
      'language',
      'average_rating',
      'total_students',
      'total_reviews',
      'total_duration_seconds',
      'tags',
      'is_free',
    ],
    rankingRules: [
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
      'avg_rating:desc',
      'total_students:desc',
    ],
  })
}

// ─── Index a course ───────────────────────────────────────────────────────────
export async function indexCourse(course: Partial<Course> & {
  instructor_name?: string
  category?: string
  category_id?: string
}) {
  const index = client.index(COURSES_INDEX)
  await index.addDocuments([course], { primaryKey: 'id' })
}

// ─── Update a course in the index ─────────────────────────────────────────────
export async function updateIndexedCourse(courseId: string, updates: Record<string, unknown>) {
  const index = client.index(COURSES_INDEX)
  await index.updateDocuments([{ id: courseId, ...updates }])
}

// ─── Remove a course from the index ──────────────────────────────────────────
export async function removeIndexedCourse(courseId: string) {
  const index = client.index(COURSES_INDEX)
  await index.deleteDocument(courseId)
}

// ─── Search courses ───────────────────────────────────────────────────────────
export async function searchCourses(params: {
  query?: string
  filters?: string
  sort?: string[]
  page?: number
  limit?: number
}) {
  const index = client.index(COURSES_INDEX)

  const searchParams: Record<string, unknown> = {
    attributesToHighlight: ['title', 'description'],
    highlightPreTag: '<mark>',
    highlightPostTag: '</mark>',
    limit: params.limit ?? 20,
    offset: ((params.page ?? 1) - 1) * (params.limit ?? 20),
  }

  if (params.filters) searchParams.filter = params.filters
  if (params.sort) searchParams.sort = params.sort

  const result = await index.search(params.query ?? '', searchParams)
  return result
}

// ─── Bulk index courses ───────────────────────────────────────────────────────
export async function bulkIndexCourses(courses: unknown[]) {
  const index = client.index(COURSES_INDEX)
  await index.addDocuments(courses as Record<string, unknown>[], { primaryKey: 'id' })
}

// ─── Get search client (for use in browser) ───────────────────────────────────
export const searchClient = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST ?? 'http://localhost:7700',
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_API_KEY,
})

export { client as meiliClient }
