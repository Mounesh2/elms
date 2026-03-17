export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId } = await req.json()
    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Course ID required' }, { status: 400 })
    }

    // 1. Verify enrollment and completion
    const enrollment = await prisma.enrollment.findFirst({
        where: {
            userId: session.user.id,
            courseId: courseId
        }
    })

    if (!enrollment) {
        return NextResponse.json({ success: false, error: 'Not enrolled in this course' }, { status: 403 })
    }

    if (enrollment.progressPercentage < 100) {
        return NextResponse.json({ success: false, error: 'Course not completed yet' }, { status: 400 })
    }

    // 2. Check if a certificate already exists
    const existingCert = await prisma.certificate.findFirst({
        where: {
            userId: session.user.id,
            courseId: courseId
        }
    })

    if (existingCert) {
       return NextResponse.json({ success: true, certificate: existingCert })
    }

    // 3. Generate Certificate DB Record
    const certNumber = uuidv4().split('-')[0].toUpperCase() + '-' + Date.now().toString().slice(-6)
    
    const cert = await prisma.certificate.create({
        data: {
          userId: session.user.id,
          courseId: courseId,
          certificateNumber: certNumber,
          issuedAt: new Date(),
          certificateUrl: `/verify/${certNumber}`
        }
    })

    return NextResponse.json({ 
      success: true, 
      certificate: cert
    })

  } catch (error: any) {
    console.error('Certificate generation error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' }, 
      { status: 500 }
    )
  }
}

