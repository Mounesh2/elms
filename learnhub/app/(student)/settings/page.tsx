"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui"
import { Upload, User, Shield, CreditCard, Bell, Globe, Mail, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { PurchaseHistory } from "@/components/settings/PurchaseHistory"

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    name: profile?.full_name || "",
    title: profile?.headline || "",
    bio: profile?.bio || "",
    website: profile?.website_url || "",
    twitter: profile?.twitter_url || "",
    linkedin: profile?.linkedin_url || ""
  })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" }
      })
      if (!res.ok) throw new Error("Failed to update profile")
      toast.success("Profile updated successfully")
      refreshProfile()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    toast.loading("Uploading avatar...", { id: "avatar-upload" })
    try {
      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData
      })
      const { url } = await res.json()
      await fetch("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify({ image: url }),
        headers: { "Content-Type": "application/json" }
      })
      toast.success("Avatar updated!", { id: "avatar-upload" })
      refreshProfile()
    } catch (e) {
      toast.error("Upload failed", { id: "avatar-upload" })
    }
  }

  const TABS = [
    { id: "profile", label: "Public Profile", icon: User },
    { id: "security", label: "Account Security", icon: Shield },
    { id: "billing", label: "Billing & Subscriptions", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
  ]

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
            <h1 className="text-2xl font-bold text-[#1c1d1f] mb-8">Settings</h1>
            <nav className="flex lg:flex-col overflow-x-auto no-scrollbar border-b lg:border-none border-surface-200">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all border-b-2 lg:border-b-0 lg:border-l-4 whitespace-nowrap",
                            activeTab === tab.id 
                                ? "border-primary-600 text-[#1c1d1f] bg-surface-50" 
                                : "border-transparent text-surface-500 hover:text-[#1c1d1f] hover:bg-surface-50"
                        )}
                    >
                        <tab.icon className="h-5 w-5" />
                        {tab.label}
                    </button>
                ))}
            </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 max-w-2xl">
            {activeTab === "profile" && (
                <div className="space-y-10 animate-fade-in">
                    <div>
                        <h2 className="text-xl font-bold text-[#1c1d1f] mb-1">Public Profile</h2>
                        <p className="text-sm text-surface-500">Add information about yourself</p>
                    </div>

                    <div className="flex items-center gap-6 p-6 bg-surface-50 rounded-sm border border-surface-200">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white border border-surface-300 group">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.full_name || ""} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-surface-300">
                                    {profile?.full_name?.[0]}
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="h-6 w-6 text-white" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                            </label>
                        </div>
                        <div>
                            <p className="font-bold text-[#1c1d1f]">Profile Picture</p>
                            <p className="text-sm text-surface-500 mb-3">JPG, GIF or PNG. Max size of 800K</p>
                            <Button variant="outline" size="sm" className="h-9 font-bold border-[#1c1d1f]">Change</Button>
                        </div>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1c1d1f]">First Name</label>
                                <input 
                                    value={formData.name.split(" ")[0]}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: `${e.target.value} ${prev.name.split(" ")[1] || ""}` }))}
                                    className="w-full h-12 px-4 border border-[#1c1d1f] focus:outline-none transition-all placeholder:text-surface-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#1c1d1f]">Last Name</label>
                                <input 
                                    value={formData.name.split(" ")[1] || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: `${prev.name.split(" ")[0]} ${e.target.value}` }))}
                                    className="w-full h-12 px-4 border border-[#1c1d1f] focus:outline-none transition-all placeholder:text-surface-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1c1d1f]">Headline</label>
                            <input 
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Student at LearnHub"
                                className="w-full h-12 px-4 border border-[#1c1d1f] focus:outline-none transition-all placeholder:text-surface-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1c1d1f]">Biography</label>
                            <textarea 
                                value={formData.bio}
                                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                rows={5}
                                placeholder="Tell us about yourself..."
                                className="w-full px-4 py-3 border border-[#1c1d1f] focus:outline-none transition-all resize-none placeholder:text-surface-300"
                            />
                        </div>

                        <div className="space-y-4 pt-6">
                            <h3 className="font-bold text-[#1c1d1f]">Links</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-surface-500 uppercase">Website</label>
                                    <input 
                                        value={formData.website}
                                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                                        placeholder="https://example.com"
                                        className="w-full h-12 px-4 border border-[#1c1d1f] focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <span className="h-12 px-4 flex items-center border border-r-0 border-[#1c1d1f] bg-surface-50 text-surface-500 text-sm">twitter.com/</span>
                                    <input 
                                        value={formData.twitter}
                                        onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                                        className="flex-1 h-12 px-4 border border-[#1c1d1f] focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <span className="h-12 px-4 flex items-center border border-r-0 border-[#1c1d1f] bg-surface-50 text-surface-500 text-sm">linkedin.com/in/</span>
                                    <input 
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                                        className="flex-1 h-12 px-4 border border-[#1c1d1f] focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button disabled={isLoading} className="h-12 px-8 bg-[#1c1d1f] hover:bg-surface-800 text-white font-bold rounded-none">
                                {isLoading ? "Saving..." : "Save Profile"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === "security" && (
                <div className="space-y-10 animate-fade-in">
                    <div>
                        <h2 className="text-xl font-bold text-[#1c1d1f] mb-1">Account Security</h2>
                        <p className="text-sm text-surface-500">Edit your account settings and change your password</p>
                    </div>

                    <div className="p-6 border border-surface-200 rounded-sm space-y-4 bg-surface-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-surface-200">
                                    <Mail className="h-5 w-5 text-surface-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#1c1d1f]">Email address</p>
                                    <p className="text-xs text-surface-600">{user?.email}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" disabled className="h-9 border-[#1c1d1f] font-bold">Edit</Button>
                        </div>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1c1d1f]">Current Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="w-full h-12 px-4 border border-[#1c1d1f] focus:outline-none" 
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400">
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1c1d1f]">New Password</label>
                            <input type="password" placeholder="Min. 8 characters" className="w-full h-12 px-4 border border-[#1c1d1f] focus:outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#1c1d1f]">Re-type New Password</label>
                            <input type="password" className="w-full h-12 px-4 border border-[#1c1d1f] focus:outline-none" />
                        </div>
                        <Button className="h-12 px-8 bg-[#1c1d1f] hover:bg-surface-800 text-white font-bold rounded-none">
                            Change Password
                        </Button>
                    </form>
                </div>
            )}

            {activeTab === "billing" && (
                <div className="space-y-10 animate-fade-in">
                    <div>
                        <h2 className="text-xl font-bold text-[#1c1d1f] mb-1">Billing & Subscriptions</h2>
                        <p className="text-sm text-surface-500">Manage your payment methods and view history</p>
                    </div>
                    <PurchaseHistory />
                </div>
            )}

            {activeTab === "notifications" && (
                <div className="space-y-10 animate-fade-in">
                   <div>
                        <h2 className="text-xl font-bold text-[#1c1d1f] mb-1">Notifications</h2>
                        <p className="text-sm text-surface-500">Choose how you want to be notified</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 border border-surface-200 hover:border-[#1c1d1f] transition-all">
                            <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 accent-[#1c1d1f]" />
                            <div>
                                <p className="text-sm font-bold text-[#1c1d1f]">Learning reminders</p>
                                <p className="text-xs text-surface-500 mt-1">Receive reminders to continue your courses and stay on track.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 border border-surface-200 hover:border-[#1c1d1f] transition-all">
                            <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 accent-[#1c1d1f]" />
                            <div>
                                <p className="text-sm font-bold text-[#1c1d1f]">Special offers</p>
                                <p className="text-xs text-surface-500 mt-1">Get coupons, promotions, and updates on courses you might like.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 border border-surface-200 hover:border-[#1c1d1f] transition-all">
                            <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 accent-[#1c1d1f]" />
                            <div>
                                <p className="text-sm font-bold text-[#1c1d1f]">Announcements from instructors</p>
                                <p className="text-xs text-surface-500 mt-1">Stay updated with course progress and announcements from your instructors.</p>
                            </div>
                        </div>
                    </div>
                    
                    <Button className="h-12 px-8 bg-[#1c1d1f] hover:bg-surface-800 text-white font-bold rounded-none">
                        Save Preferences
                    </Button>
                </div>
            )}
        </main>
      </div>
    </div>
  )
}
