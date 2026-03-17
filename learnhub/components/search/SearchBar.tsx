"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Clock, X, TrendingUp, BookOpen, User, Grid } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface Suggestion {
  title: string
  slug: string
  type: "course" | "instructor" | "category"
}

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) setRecentSearches(JSON.parse(saved))

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }
      setIsLoading(true)
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setSuggestions(data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSearch = (q: string) => {
    if (!q.trim()) return
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
    setIsOpen(false)
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  const removeRecent = (q: string) => {
    const updated = recentSearches.filter(s => s !== q)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  const handleSelect = (s: Suggestion) => {
    setIsOpen(false)
    if (s.type === "course") router.push(`/courses/${s.slug}`)
    else if (s.type === "instructor") router.push(`/instructor/${s.slug}`) // Assuming slug is username
    else if (s.type === "category") router.push(`/category/${s.slug}`)
  }

  return (
    <div className="relative group w-full" ref={containerRef}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-surface-400 group-focus-within:text-[#1c1d1f] transition-colors" />
      <input
        type="search"
        placeholder="Search for anything"
        value={query}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
        className="w-full h-12 rounded-full border border-[#1c1d1f] bg-surface-50 pl-12 pr-4 text-sm text-[#1c1d1f] placeholder-surface-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1c1d1f] transition-all shadow-inner"
      />

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white border border-surface-200 shadow-2xl rounded-sm z-50 overflow-hidden animate-fade-in">
          {query.length < 2 ? (
            <div className="py-2">
              {recentSearches.length > 0 && (
                <div className="border-b border-surface-100 mb-2">
                  <h3 className="px-4 py-2 text-xs font-bold text-surface-500 uppercase tracking-widest">Recent searches</h3>
                  {recentSearches.map((s) => (
                    <div key={s} className="flex items-center justify-between hover:bg-surface-50 transition-colors group">
                        <button 
                            onClick={() => handleSearch(s)}
                            className="flex-grow flex items-center gap-3 px-4 py-2 text-sm text-[#1c1d1f] text-left font-bold"
                        >
                            <Clock className="h-4 w-4 text-surface-400" /> {s}
                        </button>
                        <button 
                            onClick={() => removeRecent(s)}
                            className="p-2 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                  ))}
                </div>
              )}
              <h3 className="px-4 py-2 text-xs font-bold text-surface-500 uppercase tracking-widest">Popular right now</h3>
              {["Python for Data Science", "React Full Stack", "AWS Certification", "Machine Learning"].map(p => (
                <button 
                    key={p} 
                    onClick={() => handleSearch(p)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#1c1d1f] hover:bg-surface-50 text-left font-bold"
                >
                    <TrendingUp className="h-4 w-4 text-surface-400" /> {p}
                </button>
              ))}
            </div>
          ) : (
            <div className="py-2">
              {suggestions.length === 0 && !isLoading ? (
                <div className="px-4 py-8 text-center text-surface-500 italic">No matches found for &quot;{query}&quot;</div>
              ) : (
                suggestions.map((s) => (
                    <button 
                        key={s.slug + s.type} 
                        onClick={() => handleSelect(s)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#1c1d1f] hover:bg-surface-50 text-left transition-colors"
                    >
                        {s.type === "course" && <BookOpen className="h-4 w-4 text-surface-400" />}
                        {s.type === "instructor" && <User className="h-4 w-4 text-surface-400" />}
                        {s.type === "category" && <Grid className="h-4 w-4 text-surface-400" />}
                        <span className="font-bold flex-grow truncate">{s.title}</span>
                        <span className="text-[10px] uppercase tracking-widest text-surface-400 font-bold">{s.type}</span>
                    </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
