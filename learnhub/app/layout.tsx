import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/components/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'LearnHub — Online Learning Platform', template: '%s | LearnHub' },
  description: 'Discover thousands of expert-led courses. Learn web development, data science, design, business and more. Start learning today.',
}

import dynamic from 'next/dynamic'

const ChatbotWidget = dynamic(
  () => import('@/components/chatbot/ChatbotWidget'),
  { ssr: false }
)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} bg-white text-[#1c1d1f] antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <ChatbotWidget />
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
