import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading text-xl font-bold text-white">LearnHub</span>
        </Link>
        <Link href="/help" className="text-sm text-surface-400 hover:text-white transition-colors">Need help?</Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </div>
      <div className="py-4 text-center text-xs text-surface-500 border-t border-surface-800">
        © {new Date().getFullYear()} LearnHub, Inc. · <Link href="/terms" className="hover:text-white">Terms</Link> · <Link href="/privacy" className="hover:text-white">Privacy</Link>
      </div>
    </div>
  )
}
