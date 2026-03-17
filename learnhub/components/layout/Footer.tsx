import Link from 'next/link'
import { GraduationCap, Globe, ChevronDown } from 'lucide-react'

const TOP_BLOCK = {
  'In-demand Careers': ['Data Scientist', 'Full Stack Web Developer', 'Cloud Engineer', 'Project Manager', 'Game Developer', 'All Career Accelerators'],
  'Web Development': ['Web Development', 'JavaScript', 'React JS', 'Angular', 'Java'],
  'IT Certifications': ['Amazon AWS', 'AWS Certified Cloud Practitioner', 'AZ-900 Azure Fundamentals', 'AWS Solutions Architect', 'Kubernetes'],
  'Leadership': ['Leadership', 'Management Skills', 'Project Management', 'Personal Productivity', 'Emotional Intelligence'],
}

const SECOND_BLOCK = {
    'Certifications by Skill': ['Cybersecurity Certification', 'Project Management Certification', 'Cloud Computing Certification', 'Data Analytics Certification'],
    'Data Science': ['Python', 'Machine Learning', 'Deep Learning', 'Data Visualization'],
    'Communication': ['Public Speaking', 'Writing', 'Negotiation', 'Interpersonal Skills'],
    'Business Analytics': ['Microsoft Power BI', 'Tableau', 'SQL', 'Data Analysis'],
}

const BOTTOM_LINKS = {
    'About': [
        { label: 'About us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact us', href: '/contact' },
        { label: 'Blog', href: '/blog' },
        { label: 'Investors', href: '/investors' },
    ],
    'Discover LearnHub': [
        { label: 'Get the app', href: '/app' },
        { label: 'Teach on LearnHub', href: '/teach' },
        { label: 'Plans and Pricing', href: '/pricing' },
        { label: 'Affiliate', href: '/affiliate' },
        { label: 'Help and Support', href: '/help' },
    ],
    'LearnHub for Business': [
        { label: 'LearnHub Business', href: '/business' },
    ],
    'Legal & Accessibility': [
        { label: 'Accessibility statement', href: '/accessibility' },
        { label: 'Privacy policy', href: '/privacy' },
        { label: 'Sitemap', href: '/sitemap' },
        { label: 'Terms', href: '/terms' },
    ],
}

export default function Footer() {
  return (
    <footer className="bg-[#1c1d1f] text-white pt-16 pb-8">
      <div className="mx-auto max-w-[1440px] px-8">
        {/* Top Block */}
        <div className="mb-12">
            <h2 className="text-lg font-bold mb-6">Explore top skills and certifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {Object.entries(TOP_BLOCK).map(([title, links]) => (
                    <div key={title}>
                        <h3 className="text-sm font-bold mb-4">{title}</h3>
                        <ul className="space-y-2">
                            {links.map((link) => (
                                <li key={link}>
                                    <Link href={`/search?q=${link}`} className="text-sm text-gray-300 hover:underline hover:text-white transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>

        {/* Second Block */}
        <div className="mb-12 border-t border-gray-700 pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {Object.entries(SECOND_BLOCK).map(([title, links]) => (
                    <div key={title}>
                        <h3 className="text-sm font-bold mb-4">{title}</h3>
                        <ul className="space-y-2">
                            {links.map((link) => (
                                <li key={link}>
                                    <Link href={`/search?q=${link}`} className="text-sm text-gray-300 hover:underline hover:text-white transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>

        {/* Bottom Block */}
        <div className="mb-12 border-t border-gray-700 pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {Object.entries(BOTTOM_LINKS).map(([title, links]) => (
                    <div key={title}>
                        <h3 className="text-sm font-bold mb-4">{title}</h3>
                        <ul className="space-y-2">
                            {links.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-gray-300 hover:underline hover:text-white transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>

        {/* Very Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8">
                 <Link href="/" className="flex items-center gap-2">
                    <span className="font-heading text-xl font-bold text-primary-500">LearnHub</span>
                </Link>
                <p className="text-xs text-gray-400">
                    © 2026 LearnHub, Inc.
                </p>
            </div>

            <div className="flex items-center gap-6">
                <button className="text-xs text-gray-300 hover:text-white">Cookie settings</button>
                <button className="flex items-center gap-2 px-4 py-2 border border-white text-sm hover:bg-gray-800 transition-colors">
                    <Globe className="h-4 w-4" />
                    <span>English</span>
                </button>
            </div>
        </div>
      </div>
    </footer>
  )
}
