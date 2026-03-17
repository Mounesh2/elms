'use client'

import React, { useState, useRef, useCallback } from 'react'
import { UploadCloud, FileVideo, X, Play, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { Button, ProgressBar, Card } from '@/components/ui'

interface VideoUploaderProps {
  courseId: string
  lectureId?: string // Optional: used if uploading a specific lecture's video
  onSuccess?: (videoUrl: string, fileId: string) => void
}

const MAX_RETRIES = 3
const MAX_FILE_SIZE = 4 * 1024 * 1024 * 1024 // 4GB
const SUPPORTED_TYPES = [
  'video/mp4', 'video/quicktime', 'video/x-msvideo', 
  'video/x-matroska', 'video/webm'
]

export function VideoUploader({ courseId, lectureId, onSuccess }: VideoUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null)
  
  const xhrRef = useRef<XMLHttpRequest | null>(null)
  const retryCount = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files[0]) {
       handleFileSelected(e.target.files[0])
     }
  }

  const handleFileSelected = (selectedFile: File) => {
     if (!SUPPORTED_TYPES.includes(selectedFile.type)) {
        setErrorMsg('Unsupported file type. Please upload MP4, MOV, AVI, MKV, or WebM.')
        setStatus('error')
        return
     }
     if (selectedFile.size > MAX_FILE_SIZE) {
        setErrorMsg('File size exceeds the 4GB limit.')
        setStatus('error')
        return
     }

     setFile(selectedFile)
     setStatus('idle')
     setProgress(0)
     setErrorMsg('')
     setPreviewThumbnail(null)
     // Generate quick blob URL for local thumbnail preview if needed
     const objectUrl = URL.createObjectURL(selectedFile)
     setPreviewThumbnail(objectUrl)
  }

  const cancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort()
    }
    setStatus('idle')
    setProgress(0)
    retryCount.current = 0
  }

  const startUpload = async (fileToUpload: File = file!, isRetry = false) => {
    if (!fileToUpload) return
    
    setStatus('uploading')
    setErrorMsg('')
    if (!isRetry) setProgress(0)

    try {
      // 1. Get Presigned URL
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: fileToUpload.name,
          contentType: fileToUpload.type,
          courseId,
          lectureId
        })
      })

      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to get upload URL')
      }

      const { uploadUrl, key, fileId } = await res.json()

      // 2. Upload to R2 via XMLHttpRequest to track progress
      const xhr = new XMLHttpRequest()
      xhrRef.current = xhr

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setProgress(percentComplete)
        }
      }

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Success
          setStatus('success')
          setProgress(100)
          
          // Optional: Notify backend that video is uploaded and to start processing
          if (lectureId) {
            await fetch('/api/video', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lectureId, courseId, key })
            })
          }

          if (onSuccess) onSuccess(key, fileId)
        } else {
           handleUploadError('Upload failed with status ' + xhr.status)
        }
      }

      xhr.onerror = () => handleUploadError('Network error occurred during upload')
      
      xhr.open('PUT', uploadUrl, true)
      xhr.setRequestHeader('Content-Type', fileToUpload.type)
      xhr.send(fileToUpload)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
       handleUploadError(err.message || 'An unexpected error occurred')
    }
  }

  const handleUploadError = (msg: string) => {
     if (retryCount.current < MAX_RETRIES) {
       retryCount.current += 1
       setTimeout(() => startUpload(file!, true), 2000) // retry after 2s
     } else {
       setStatus('error')
       setErrorMsg(`Upload failed after ${MAX_RETRIES} attempts. ${msg}`)
     }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className={`p-6 border-2 transition-all ${dragActive ? 'border-primary-500 bg-primary-500/5' : 'border-surface-800 bg-surface-900'} ${status === 'uploading' ? 'pointer-events-none' : ''}`}>
       
       <input 
         ref={inputRef} 
         type="file" 
         accept={SUPPORTED_TYPES.join(',')} 
         onChange={handleFileChange} 
         className="hidden" 
       />

       {/* IDLE / CHOOSE FILE STATE */}
       {status === 'idle' && !file && (
         <div 
            className="flex flex-col items-center justify-center py-12 px-4 text-center cursor-pointer"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
         >
            <div className="w-16 h-16 bg-surface-800 rounded-full flex items-center justify-center mb-4 text-surface-400">
               <UploadCloud className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Drag and drop video here</h4>
            <p className="text-surface-400 text-sm mb-6 max-w-sm">
               or click to browse from your computer. Supported formats: MP4, MOV, AVI, MKV, WebM (max 4GB)
            </p>
            <Button variant="outline" onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}>Browse Files</Button>
         </div>
       )}

       {/* FILE SELECTED / UPLOADING / ERROR STATE */}
       {(file || status === 'error') && (
          <div className="space-y-6">
             <div className="flex items-start gap-4 p-4 border border-surface-700 bg-surface-800/50 rounded-xl relative overflow-hidden">
                {previewThumbnail && status === 'success' ? (
                   <div className="w-24 h-16 bg-black rounded shrink-0 flex items-center justify-center border border-surface-700 overflow-hidden relative">
                      <video src={previewThumbnail} className="w-full h-full object-cover opacity-80" />
                      <Play className="absolute w-6 h-6 text-white" />
                   </div>
                ) : (
                   <div className="w-16 h-16 bg-surface-700 rounded-lg shrink-0 flex items-center justify-center text-surface-400">
                      <FileVideo className="w-8 h-8" />
                   </div>
                )}
                
                <div className="flex-1 min-w-0 pr-8">
                   <h5 className="text-white font-bold truncate mb-1">{file?.name}</h5>
                   <div className="flex items-center gap-3 text-sm text-surface-400 font-medium">
                      <span>{file ? formatFileSize(file.size) : ''}</span>
                      {status === 'uploading' && <span className="text-primary-400">{Math.round(progress)}% uploaded</span>}
                      {status === 'success' && <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Upload complete</span>}
                      {status === 'error' && <span className="text-red-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Failed</span>}
                   </div>

                   {status === 'uploading' && (
                     <div className="mt-3">
                       <ProgressBar value={progress} className="h-2" />
                     </div>
                   )}
                </div>

                {status !== 'uploading' && status !== 'success' && (
                  <button 
                    onClick={() => { setFile(null); setStatus('idle'); setErrorMsg('') }}
                    className="absolute top-4 right-4 text-surface-500 hover:text-white transition-colors"
                  >
                     <X className="w-5 h-5" />
                  </button>
                )}
             </div>

             {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-2">
                   <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                   <span>{errorMsg}</span>
                </div>
             )}

             {/* ACTIONS */}
             {status === 'idle' && file && (
                <div className="flex justify-end gap-3">
                   <Button variant="ghost" onClick={() => setFile(null)}>Cancel</Button>
                   <Button onClick={() => startUpload()}>Upload Video</Button>
                </div>
             )}

             {status === 'uploading' && (
                <div className="flex justify-end">
                   <Button variant="outline" onClick={cancelUpload} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 border-red-500/20">Cancel Upload</Button>
                </div>
             )}

             {status === 'error' && (
                <div className="flex justify-end gap-3">
                   <Button variant="ghost" onClick={() => setFile(null)}>Remove File</Button>
                   <Button onClick={() => startUpload(file!, true)} className="bg-orange-500 hover:bg-orange-600"><RefreshCw className="w-4 h-4 mr-2" /> Retry Upload</Button>
                </div>
             )}

             {status === 'success' && (
                <div className="flex justify-end">
                   <Button variant="outline" onClick={() => { setFile(null); setStatus('idle') }}>Upload Another</Button>
                </div>
             )}
          </div>
       )}

    </Card>
  )
}
