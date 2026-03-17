'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, Button } from '@/components/ui'
import { Award, Download, Share2, Search, ArrowRight, ExternalLink } from 'lucide-react'
import { jsPDF } from 'jspdf'

// MOCK DATA
const EARNED_CERTIFICATES = [
  {
    id: 'cert_1',
    courseTitle: 'Machine Learning A-Z: AI, Python & R',
    instructor: 'Kirill Eremenko',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
    dateEarned: 'March 1, 2025',
    certNumber: 'ML-9382A-1002',
    slug: 'machine-learning-az'
  },
  {
    id: 'cert_2',
    courseTitle: 'Next.js 14 & React - The Complete Guide',
    instructor: 'Maximilian Schwarzmüller',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    dateEarned: 'February 15, 2025',
    certNumber: 'NEXT-B742-9901',
    slug: 'nextjs-14-react-the-complete-guide'
  }
]

export default function CertificatesPage() {
  const [isGenerating, setIsGenerating] = useState<string | null>(null)

  const downloadPDF = (cert: typeof EARNED_CERTIFICATES[0]) => {
    setIsGenerating(cert.id)
    
    // Simulate generation time to let the UI update
    setTimeout(() => {
       try {
          // A4 landscape sizing (297x210 mm)
          const doc = new jsPDF('landscape', 'mm', 'a4')
          
          // Background Color / Border
          doc.setFillColor(248, 250, 252) // off-white slate
          doc.rect(0, 0, 297, 210, 'F')
          
          doc.setDrawColor(124, 58, 237) // primary-600
          doc.setLineWidth(4)
          doc.rect(10, 10, 277, 190)
          
          // Text Content
          doc.setTextColor(15, 23, 42) // Slate-900

          doc.setFontSize(36)
          doc.setFont('helvetica', 'bold')
          doc.text('CERTIFICATE OF COMPLETION', 148.5, 40, { align: 'center' })

          doc.setFontSize(16)
          doc.setFont('helvetica', 'normal')
          doc.text('This is to certify that', 148.5, 60, { align: 'center' })
          
          doc.setTextColor(124, 58, 237)
          doc.setFontSize(32)
          doc.setFont('times', 'italic')
          doc.text('Alex M.', 148.5, 80, { align: 'center' })
          
          doc.setTextColor(15, 23, 42)
          doc.setFontSize(16)
          doc.setFont('helvetica', 'normal')
          doc.text('has successfully completed the course:', 148.5, 100, { align: 'center' })

          doc.setFontSize(24)
          doc.setFont('helvetica', 'bold')
          doc.text(cert.courseTitle, 148.5, 120, { align: 'center', maxWidth: 240 })

          doc.setFontSize(14)
          doc.setFont('helvetica', 'normal')
          doc.text(`Taught by ${cert.instructor}`, 148.5, 140, { align: 'center' })

          // Footer details
          doc.setFontSize(12)
          doc.text(`Date of Issue: ${cert.dateEarned}`, 30, 180)
          doc.text(`Certificate No: ${cert.certNumber}`, 30, 190)

          // "Signatures"
          doc.setLineWidth(0.5)
          doc.line(220, 175, 270, 175)
          doc.text(cert.instructor, 245, 182, { align: 'center' })
          doc.setFontSize(10)
          doc.setTextColor(100, 116, 139)
          doc.text('Instructor Signature', 245, 188, { align: 'center' })
          
          // Watermark/Logo placeholder
          doc.setTextColor(124, 58, 237)
          doc.setFontSize(18)
          doc.setFont('helvetica', 'bold')
          doc.text('LearnHub Platform', 148.5, 190, { align: 'center' })

          // Save triggers browser download
          doc.save(`Certificate_${cert.certNumber}.pdf`)

       } catch (err) {
          console.error("PDF generation failed", err)
          alert("Failed to generate PDF. Check console for details.")
       } finally {
          setIsGenerating(null)
       }
    }, 500)
  }

  const shareLinkedIn = (cert: typeof EARNED_CERTIFICATES[0]) => {
     // The URL where anyone can verify this cert
     const verifyUrl = `https://learnhub.demo/verify/${cert.certNumber}`
     
     // LinkedIn URL Share endpoint
     const url = new URL('https://www.linkedin.com/sharing/share-offsite/')
     url.searchParams.append('url', verifyUrl)
     
     // Note: LinkedIn pulls the title/image/description from og:tags on the verifyUrl page.
     // If we wanted pre-filled text (which LinkedIn strictly limits now via URL), we can use intent links on Twitter instead.
     window.open(url.toString(), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 min-h-screen">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-800">
          <div>
             <h1 className="text-4xl font-heading font-bold text-white mb-2">My Certificates</h1>
             <div className="text-surface-400 font-medium">You have earned {EARNED_CERTIFICATES.length} certificates.</div>
          </div>
       </div>

       {EARNED_CERTIFICATES.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
             {EARNED_CERTIFICATES.map(cert => (
                <Card key={cert.id} className="bg-surface-900 border-surface-800 flex flex-col group overflow-hidden">
                   {/* Thumbnail mimicking a certificate preview */}
                   <div className="aspect-[4/3] bg-surface-950 p-6 relative flex flex-col items-center justify-center text-center border-b border-surface-800 overflow-hidden">
                      {/* Faint Background image of the course */}
                      <Image 
                        src={cert.thumbnail} 
                        alt="Course Background" 
                        fill 
                        className="object-cover opacity-10 grayscale group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface-950 to-transparent z-0"></div>
                      
                      <div className="relative z-10 space-y-3">
                         <Award className="w-12 h-12 text-primary-500 mx-auto" />
                         <div className="font-heading font-bold text-lg text-white leading-tight">Certificate of Completion</div>
                         <div className="text-xs font-medium text-primary-400 uppercase tracking-widest">{cert.courseTitle}</div>
                      </div>
                   </div>

                   <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-white text-lg leading-tight mb-2">{cert.courseTitle}</h3>
                      <p className="text-sm text-surface-400 mb-4">{cert.instructor}</p>
                      
                      <div className="mt-auto space-y-4">
                         <div className="flex justify-between text-xs font-bold text-surface-500 bg-surface-950 rounded p-3 border border-surface-800">
                            <div>
                               <span className="block text-surface-400 font-medium mb-1 tracking-wide">DATE EARNED</span>
                               <span className="text-white">{cert.dateEarned}</span>
                            </div>
                            <div className="text-right">
                               <span className="block text-surface-400 font-medium mb-1 tracking-wide">CERT ID</span>
                               <span className="text-primary-400">{cert.certNumber}</span>
                            </div>
                         </div>
                         
                         <div className="flex gap-3">
                            <Button 
                               className="flex-1" 
                               onClick={() => downloadPDF(cert)}
                               disabled={isGenerating === cert.id}
                            >
                               {isGenerating === cert.id ? (
                                 <span className="flex items-center"><RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> Preparing...</span>
                               ) : (
                                 <><Download className="w-4 h-4 mr-2" /> Download PDF</>
                               )}
                            </Button>
                            <Button variant="outline" className="w-12 px-0 shrink-0 text-[#0a66c2]" title="Share to LinkedIn" onClick={() => shareLinkedIn(cert)}>
                               <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            </Button>
                         </div>
                      </div>
                   </div>
                </Card>
             ))}
          </div>
       ) : (
          <div className="py-24 text-center border-2 border-dashed border-surface-800 rounded-2xl bg-surface-900/50">
             <div className="w-16 h-16 rounded-full bg-surface-800 flex items-center justify-center mx-auto mb-4 text-surface-500">
               <Award className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">No certificates yet</h3>
             <p className="text-surface-400 max-w-sm mx-auto mb-6">Complete all lectures and pass the final assignments in your enrolled courses to earn a certificate.</p>
             <Link href="/my-courses">
               <Button variant="outline">Continue Learning <ArrowRight className="w-4 h-4 ml-2" /></Button>
             </Link>
          </div>
       )}
    </div>
  )
}

function RefreshCcw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21v-5h5" />
    </svg>
  )
}