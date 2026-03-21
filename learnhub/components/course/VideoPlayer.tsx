"use client"

import React, { useEffect, useState } from "react"
import ReactPlayer from 'react-player'
import { Play, Pause, RotateCcw, Volume2, Maximize, Settings, SkipForward, SkipBack } from "lucide-react"

interface VideoPlayerProps {
  url: string
  thumbnailUrl?: string
  onProgress?: (progress: number) => void
  onComplete?: () => void
  lastPosition?: number
  courseId?: string
  lectureId?: string
  sections?: any[]
  currentLectureInfo?: any
  onLectureChange?: (id: string) => void
}

export const VideoPlayer = ({ 
    url, 
    thumbnailUrl,
    onProgress, 
    onComplete, 
    lastPosition = 0 
}: VideoPlayerProps) => {
  const [hasWindow, setHasWindow] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true)
    }
  }, [])

  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget
    const currentTime = video.currentTime
    const duration = video.duration
    
    if (duration > 0) {
      const progress = (currentTime / duration) * 100
      setPlayed(progress)
      onProgress?.(currentTime)
      
      if (progress >= 95) {
        onComplete?.()
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="relative group bg-black rounded-sm overflow-hidden aspect-video shadow-2xl">
      {hasWindow && (
        <ReactPlayer
          {...({
            url: url,
            width: "100%",
            height: "100%",
            playing: isPlaying,
            light: thumbnailUrl || false,
            onProgress: (state: { played: number; playedSeconds: number }) => {
              const progress = state.played * 100
              setPlayed(progress)
              onProgress?.(state.playedSeconds)
              
              if (progress >= 95) {
                onComplete?.()
              }
            },
            onDuration: (d: number) => setDuration(d),
            controls: true,
            onPlay: () => setIsPlaying(true),
            onPause: () => setIsPlaying(false),
            onClickPreview: () => setIsPlaying(true)
          } as any)}
        />
      )}
      
      {!isPlaying && (
        <div 
            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer group-hover:bg-black/20 transition-all z-10 pointer-events-none"
        >
            <div className="bg-white/90 rounded-full p-6 shadow-2xl scale-100 group-hover:scale-110 transition-transform">
                <Play className="h-10 w-10 text-[#1c1d1f] fill-current ml-1" />
            </div>
        </div>
      )}
    </div>
  )
}
