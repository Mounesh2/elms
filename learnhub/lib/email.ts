import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

const FROM = `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`

// ─── Welcome Email ────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to LearnHub, ${name}! 🎉`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f1f5f9; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #7C3AED, #1d4ed8); padding: 48px 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: white;">🎓 LearnHub</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #a855f7; margin-top: 0;">Welcome aboard, ${name}!</h2>
          <p>We're excited to have you join LearnHub — where learning meets excellence.</p>
          <p>Explore thousands of courses taught by expert instructors, earn certificates, and advance your career.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses" 
             style="display: inline-block; background: #7C3AED; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">
            Start Learning →
          </a>
          <hr style="border: none; border-top: 1px solid #334155; margin: 32px 0;" />
          <p style="color: #64748b; font-size: 14px;">LearnHub Team</p>
        </div>
      </div>
    `,
  })
}

// ─── Enrollment Confirmation ──────────────────────────────────────────────────
export async function sendEnrollmentEmail(
  to: string,
  name: string,
  course: { title: string; slug: string }
) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `You're enrolled in "${course.title}"! 🚀`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hi ${name},</h2>
        <p>You've successfully enrolled in <strong>${course.title}</strong>.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/learn/${course.slug}" 
           style="display: inline-block; background: #7C3AED; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Start Learning Now →
        </a>
      </div>
    `,
  })
}

// ─── Certificate Email ────────────────────────────────────────────────────────
export async function sendCertificateEmail(
  to: string,
  name: string,
  course: { title: string },
  certificateUrl: string
) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Congratulations! You've completed "${course.title}" 🎓`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Congratulations, ${name}! 🎉</h2>
        <p>You've successfully completed <strong>${course.title}</strong> and earned your certificate!</p>
        <a href="${certificateUrl}" 
           style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          View Your Certificate →
        </a>
      </div>
    `,
  })
}

// ─── Password Reset Email ─────────────────────────────────────────────────────
export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Reset your LearnHub password',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hi ${name},</h2>
        <p>We received a request to reset your password.</p>
        <a href="${resetUrl}" 
           style="display: inline-block; background: #7C3AED; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Reset Password →
        </a>
        <p style="color: #64748b; font-size: 14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  })
}

// ─── Instructor Payout Email ──────────────────────────────────────────────────
export async function sendPayoutEmail(
  to: string,
  name: string,
  amount: number,
  period: string
) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Your LearnHub payout for ${period} is ready 💰`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hi ${name},</h2>
        <p>Your earnings for <strong>${period}</strong> have been processed.</p>
        <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
          <p style="margin: 0; color: #64748b; font-size: 14px;">Net payout</p>
          <p style="margin: 8px 0 0; font-size: 36px; font-weight: 800; color: #10b981;">$${amount.toFixed(2)}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/instructor/revenue" 
           style="display: inline-block; background: #7C3AED; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          View Revenue Dashboard →
        </a>
      </div>
    `,
  })
}

// ─── New Question Notification ────────────────────────────────────────────────
export async function sendNewQuestionEmail(
  to: string,
  instructorName: string,
  question: { title: string; courseTitle: string; id: string }
) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `New question in "${question.courseTitle}"`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hi ${instructorName},</h2>
        <p>A student has a new question in <strong>${question.courseTitle}</strong>:</p>
        <blockquote style="border-left: 4px solid #7C3AED; padding-left: 16px; color: #334155;">${question.title}</blockquote>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/instructor/questions/${question.id}" 
           style="display: inline-block; background: #7C3AED; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Answer Now →
        </a>
      </div>
    `,
  })
}
