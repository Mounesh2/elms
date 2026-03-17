"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button, Input } from "@/components/ui"
import { toast } from "react-hot-toast"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  categoryId: z.string().min(1, "Category is required"),
})

export default function CreateCourseForm({ categories }: { categories: any[] }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      categoryId: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        body: JSON.stringify(values),
      })
      const data = await response.json()
      toast.success("Course created! Redirecting to setup...")
      router.push(`/instructor/courses/${data.id}`)
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8 lg:p-12">
      <Link href="/instructor" className="flex items-center gap-2 text-surface-600 hover:text-[#1c1d1f] transition-colors mb-12 group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to dashboard</span>
      </Link>

      <div className="space-y-2 mb-10">
        <h1 className="text-4xl font-bold text-[#1c1d1f]">How about a working title?</h1>
        <p className="text-lg text-surface-600">
          It&apos;s ok if you can&apos;t think of a good title now. You can change it later.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <div className="space-y-4">
            <label className="text-lg font-bold">Course Title</label>
            <Input 
                placeholder="e.g. &quot;Advanced React Patterns&quot;" 
                className="h-14 text-lg border-surface-300 focus:border-primary-600" 
                {...form.register("title")} 
            />
            {form.formState.errors.title && <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>}
        </div>

        <div className="space-y-4">
            <label className="text-lg font-bold">Category</label>
            <select 
                className="w-full h-14 text-lg border border-surface-300 rounded-xl px-4 focus:border-primary-600 outline-none bg-white"
                {...form.register("categoryId")}
            >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
            {form.formState.errors.categoryId && <p className="text-red-500 text-sm">{form.formState.errors.categoryId.message}</p>}
        </div>

        <div className="flex items-center gap-4">
             <Link href="/instructor">
                <Button variant="ghost" type="button" className="h-14 px-8 font-bold text-[#1c1d1f]">Cancel</Button>
             </Link>
             <Button 
                type="submit" 
                className="bg-[#1c1d1f] hover:bg-surface-800 text-white h-14 px-10 text-lg font-bold"
                disabled={isSubmitting || !form.formState.isValid}
            >
              {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "Continue"}
            </Button>
        </div>
      </form>
    </div>
  )
}
