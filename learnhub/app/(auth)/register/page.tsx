"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { GraduationCap, Mail, Lock, User, CheckCircle2, Loader2 } from "lucide-react"
import { Button, Input } from "@/components/ui"
import { toast } from "react-hot-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "instructor",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match")
    }

    if (formData.password.length < 8) {
        return toast.error("Password must be at least 8 characters")
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to register")
      }

      toast.success("Account created successfully!")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-4 py-12">
      <div className="w-full max-w-lg space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="rounded-xl bg-primary-600 p-2 text-white group-hover:bg-primary-500 transition-colors">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#1c1d1f]">LearnHub</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-[#1c1d1f]">Create your account</h2>
          <p className="mt-2 text-sm text-surface-600">
            Start your learning journey today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "student" })}
                className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                  formData.role === "student"
                    ? "border-primary-600 bg-primary-50"
                    : "border-surface-200 bg-white hover:border-surface-300"
                }`}
              >
                <div className={`rounded-full p-2 ${formData.role === "student" ? "bg-primary-600 text-white" : "bg-surface-100 text-surface-400"}`}>
                   <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="text-center">
                    <p className={`font-bold ${formData.role === "student" ? "text-primary-900" : "text-surface-900"}`}>I want to learn</p>
                    <p className="text-xs text-surface-500">Student account</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "instructor" })}
                className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                  formData.role === "instructor"
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-surface-200 bg-white hover:border-surface-300"
                }`}
              >
                <div className={`rounded-full p-2 ${formData.role === "instructor" ? "bg-indigo-600 text-white" : "bg-surface-100 text-surface-400"}`}>
                   <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="text-center">
                    <p className={`font-bold ${formData.role === "instructor" ? "text-indigo-900" : "text-surface-900"}`}>I want to teach</p>
                    <p className="text-xs text-surface-500">Instructor account</p>
                </div>
              </button>
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              icon={<User className="h-4 w-4" />}
                className="bg-white border-surface-200 text-[#1c1d1f]"
            />
            <Input
              label="Email address"
              type="email"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={<Mail className="h-4 w-4" />}
                className="bg-white border-surface-200 text-[#1c1d1f]"
            />
            <div className="grid grid-cols-2 gap-4">
                <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                icon={<Lock className="h-4 w-4" />}
                className="bg-white border-surface-200 text-[#1c1d1f]"
                />
                <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                icon={<Lock className="h-4 w-4" />}
                className="bg-white border-surface-200 text-[#1c1d1f]"
                />
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#1c1d1f] hover:bg-surface-800 h-12 text-base font-bold" loading={isLoading}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-surface-600">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary-600 hover:text-primary-500 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
