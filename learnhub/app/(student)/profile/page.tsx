'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Card, Button, Input } from '@/components/ui'
import { Camera, User, Globe, Twitter, Linkedin, Loader2, Trash2 } from 'lucide-react'
import Image from 'next/image'

const schema = z.object({
  full_name:    z.string().min(2, 'Name is required'),
  username:     z.string().regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores').min(3).optional().or(z.literal('')),
  headline:     z.string().max(60, 'Keep it under 60 characters').optional(),
  bio:          z.string().max(500, 'Keep it under 500 characters').optional(),
  website_url:  z.string().url('Invalid URL').optional().or(z.literal('')),
  twitter_url:  z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Invalid URL').optional().or(z.literal('')),
})
type FormData = z.infer<typeof schema>

export default function ProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth()
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      full_name:    profile?.full_name ?? '',
      username:     profile?.username ?? '',
      headline:     profile?.headline ?? '',
      bio:          profile?.bio ?? '',
      website_url:  profile?.website_url ?? '',
      twitter_url:  profile?.twitter_url ?? '',
      linkedin_url: profile?.linkedin_url ?? '',
    }
  })

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-surface-400" /></div>
  if (!user || !profile) return null

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/profile/avatar', { method: 'POST', body: formData })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Profile picture updated')
      await refreshProfile()
    } catch (err: unknown) {
      toast.error((err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      toast.success('Profile updated successfully')
      await refreshProfile()
    } catch (err: unknown) {
      toast.error((err as Error).message)
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Profile Settings</h1>
        <p className="mt-1 text-surface-400">Manage your account details and public persona.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Main Form */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 font-heading text-xl font-semibold text-white">Public Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="grid gap-5 md:grid-cols-2">
                <Input label="Full Name" {...register('full_name')} error={errors.full_name?.message} />
                <Input label="Username" placeholder="johndoe" {...register('username')} error={errors.username?.message} prefix="@" />
              </div>

              <Input label="Headline" placeholder="e.g. Senior Frontend Developer" {...register('headline')} error={errors.headline?.message} />
              
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-200">Bio</label>
                <textarea
                  {...register('bio')}
                  rows={4}
                  className="w-full rounded-xl border border-surface-700 bg-surface-800 p-3 text-sm text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
                  placeholder="Tell us a little about yourself..."
                />
                {errors.bio && <p className="mt-1 text-xs text-red-400">{errors.bio.message}</p>}
              </div>

              <div className="space-y-4 pt-4 border-t border-surface-800">
                <h3 className="font-medium text-white">Social Links</h3>
                <Input placeholder="https://yourwebsite.com" {...register('website_url')} error={errors.website_url?.message} />
                <Input placeholder="https://twitter.com/username" {...register('twitter_url')} error={errors.twitter_url?.message} />
                <Input placeholder="https://linkedin.com/in/username" {...register('linkedin_url')} error={errors.linkedin_url?.message} />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" loading={isSubmitting}>Save Changes</Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 text-center">
            <h3 className="mb-4 font-medium text-white text-left">Profile Picture</h3>
            <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-surface-800 bg-surface-800">
              {profile.avatar_url ? (
                <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-700 text-surface-400">
                  <User size={48} />
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            <Button variant="outline" size="sm" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Camera className="mr-2 h-4 w-4" /> Change Picture
            </Button>
            <p className="mt-3 text-xs text-surface-500">JPG, GIF or PNG. Max size of 2MB.</p>
          </Card>

          <Card className="p-6 border-red-900/30 bg-red-950/10">
            <h3 className="font-medium text-red-500">Danger Zone</h3>
            <p className="mt-2 text-sm text-surface-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="danger" size="sm" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" /> Delete Account
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}