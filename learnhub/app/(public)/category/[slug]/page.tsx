import type { Metadata } from 'next'
import { SectionHeader, EmptyState } from '@/components/ui'
import { BookOpen } from 'lucide-react'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return { title: `${name} Courses`, description: `Browse all courses in the ${name} category.` }
}

export default function CategoryPage({ params }: Props) {
  const name = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={name} subtitle={`Expert-led ${name} courses for all skill levels`} />
        <EmptyState
          icon={<BookOpen className="h-16 w-16" />}
          title="No courses yet"
          description={`Be the first to create a course in ${name}!`}
        />
      </div>
    </div>
  )
}
