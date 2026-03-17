'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Card, Button, Input, Badge } from '@/components/ui'
import { 
  Menu, Plus, Check, Trash2, Edit2, ChevronDown, ChevronUp,
  PlayCircle, FileText, HelpCircle, Paperclip, UploadCloud,
  X, CheckCircle, GripVertical
} from 'lucide-react'

// Import React Quill dynamically to avoid SSR document errors
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'
import { Youtube } from 'lucide-react'

// ─── Dummy Data Initialization ──────────────────────────────────────────
type LectureType = 'video' | 'article' | 'quiz' | 'resource'

interface MockLecture {
  id: string
  title: string
  type: LectureType
  is_free_preview: boolean
  content?: string
  videoUrl?: string
}

interface MockSection {
  id: string
  title: string
  isExpanded: boolean
  lectures: MockLecture[]
}

const initialData: MockSection[] = [
  {
    id: 'sec-1',
    title: 'Introduction to React',
    isExpanded: true,
    lectures: [
      { id: 'lec-1', title: 'Course Welcome', type: 'video', is_free_preview: true },
      { id: 'lec-2', title: 'Why React?', type: 'article', is_free_preview: false }
    ]
  },
  {
    id: 'sec-2',
    title: 'Component Basics',
    isExpanded: false,
    lectures: [
      { id: 'lec-3', title: 'Your First Component', type: 'video', is_free_preview: false },
      { id: 'lec-4', title: 'Props and State quiz', type: 'quiz', is_free_preview: false }
    ]
  }
]

export default function CurriculumEditorPage() {
  const [sections, setSections] = useState<MockSection[]>(initialData)
  const [selectedLecture, setSelectedLecture] = useState<MockLecture | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showYoutubeModal, setShowYoutubeModal] = useState(false)
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState('')

  useEffect(() => setMounted(true), [])

  // ─── Drag & Drop Handlers ───────────────────────────────────────────────
  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result
    if (!destination) return

    const newSections = Array.from(sections)

    if (type === 'SECTION') {
       const [reordered] = newSections.splice(source.index, 1)
       newSections.splice(destination.index, 0, reordered)
       setSections(newSections)
       return
    }

    if (type === 'LECTURE') {
       const sourceSectionIdx = newSections.findIndex(s => s.id === source.droppableId)
       const destSectionIdx = newSections.findIndex(s => s.id === destination.droppableId)
       
       const sourceLectures = Array.from(newSections[sourceSectionIdx].lectures)
       const [movedLecture] = sourceLectures.splice(source.index, 1)

       if (source.droppableId === destination.droppableId) {
         sourceLectures.splice(destination.index, 0, movedLecture)
         newSections[sourceSectionIdx].lectures = sourceLectures
       } else {
         const destLectures = Array.from(newSections[destSectionIdx].lectures)
         destLectures.splice(destination.index, 0, movedLecture)
         newSections[sourceSectionIdx].lectures = sourceLectures
         newSections[destSectionIdx].lectures = destLectures
       }
       setSections(newSections)
    }
  }

  // ─── Section/Lecture Actions ───────────────────────────────────────────
  const addSection = () => {
    const newSec: MockSection = {
       id: `sec-${Date.now()}`,
       title: 'New Section',
       isExpanded: true,
       lectures: []
    }
    setSections([...sections, newSec])
  }

  const addLecture = (secId: string, type: LectureType) => {
     setSections(sections.map(s => {
       if (s.id === secId) {
         return { ...s, isExpanded: true, lectures: [...s.lectures, { id: `lec-${Date.now()}`, title: 'New Lecture', type, is_free_preview: false }] }
       }
       return s
     }))
  }

  const toggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, isExpanded: !s.isExpanded } : s))
  }

  const updateSectionTitle = (id: string, title: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, title } : s))
  }

  const getIcon = (type: LectureType) => {
     if (type === 'video') return <PlayCircle className="w-4 h-4 text-purple-400" />
     if (type === 'article') return <FileText className="w-4 h-4 text-blue-400" />
     if (type === 'quiz') return <HelpCircle className="w-4 h-4 text-green-400" />
     return <Paperclip className="w-4 h-4 text-orange-400" />
  }

  if (!mounted) return <div className="p-8"><div className="w-8 h-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>

  return (
     <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-surface-950">
        
        {/* LEFT SIDEBAR (NAV) */}
        <aside className="w-full lg:w-64 border-r border-surface-800 bg-surface-900 shrink-0 hidden md:block">
           <div className="p-6">
              <h3 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-4">Course Creation</h3>
              <nav className="space-y-1">
                 {['Course Goals', 'Curriculum', 'Landing Page', 'Pricing', 'Promotions', 'Course Messages'].map(item => (
                    <button key={item} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${item === 'Curriculum' ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'text-surface-300 hover:bg-surface-800 hover:text-white'}`}>
                       {item}
                    </button>
                 ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-surface-800">
                 <Button className="w-full">Submit for Review</Button>
              </div>
           </div>
        </aside>

        {/* MAIN CURRICULUM BUILDER */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
           
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h1 className="text-2xl font-heading font-bold text-white">Curriculum</h1>
                 <p className="text-surface-400 mt-1 text-sm">Start putting together your course by creating sections, lectures and practice activities.</p>
              </div>
              <div className="flex items-center gap-3">
                 <Button variant="outline" onClick={() => setShowYoutubeModal(true)} className="hidden sm:flex border-red-500/20 text-red-500 hover:bg-red-500/10"><Youtube className="w-4 h-4 mr-2" /> Import YouTube Playlist</Button>
                 <Button variant="outline" className="hidden sm:flex"><UploadCloud className="w-4 h-4 mr-2" /> Bulk Uploader</Button>
              </div>
           </div>

           <div className="flex flex-col xl:flex-row gap-8 items-start">
              
              {/* DRAGGABLE SECTIONS AREA */}
              <div className={`flex-1 min-w-0 transition-all ${selectedLecture ? 'xl:w-1/2' : 'w-full'}`}>
                 <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="board" type="SECTION">
                       {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                             {sections.map((section, sIndex) => (
                                <Draggable key={section.id} draggableId={section.id} index={sIndex}>
                                   {(provided) => (
                                      <Card 
                                         className="p-0 overflow-hidden bg-surface-900 border-surface-800"
                                         ref={provided.innerRef}
                                         {...provided.draggableProps}
                                      >
                                         <div className="bg-surface-800/50 p-3 sm:p-4 flex items-center justify-between group">
                                            <div className="flex items-center gap-3 flex-1">
                                               <div {...provided.dragHandleProps} className="text-surface-500 hover:text-white cursor-grab active:cursor-grabbing p-1">
                                                  <GripVertical className="w-5 h-5" />
                                               </div>
                                               <span className="font-bold text-sm text-surface-400 shrink-0">Section {sIndex + 1}:</span>
                                               <input 
                                                  value={section.title}
                                                  onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                                                  className="bg-transparent text-white font-semibold text-lg focus:outline-none focus:border-b focus:border-primary-500 w-full max-w-sm mr-4"
                                               />
                                            </div>
                                            <div className="flex gap-2">
                                               <button onClick={() => toggleSection(section.id)} className="p-1.5 hover:bg-surface-700 text-surface-400 hover:text-white rounded transition-colors">
                                                  {section.isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                               </button>
                                            </div>
                                         </div>

                                         {section.isExpanded && (
                                            <div className="p-4 bg-surface-950">
                                               <Droppable droppableId={section.id} type="LECTURE">
                                                  {(provided) => (
                                                     <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 min-h-[10px]">
                                                        {section.lectures.map((lecture, lIndex) => (
                                                           <Draggable key={lecture.id} draggableId={lecture.id} index={lIndex}>
                                                              {(provided) => (
                                                                 <div 
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors group cursor-pointer ${selectedLecture?.id === lecture.id ? 'bg-primary-500/10 border-primary-500/30' : 'bg-surface-900 border-surface-800 hover:border-surface-600'}`}
                                                                    onClick={() => setSelectedLecture(lecture)}
                                                                 >
                                                                    <div className="flex items-center gap-3">
                                                                       <div {...provided.dragHandleProps} className="text-surface-600 hover:text-white cursor-grab active:cursor-grabbing">
                                                                          <Menu className="w-4 h-4" />
                                                                       </div>
                                                                       {getIcon(lecture.type)}
                                                                       <span className="text-sm font-medium text-surface-200 group-hover:text-white">{lecture.title}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                       {lecture.is_free_preview && <Badge color="green" label="Preview" />}
                                                                       <button className="text-surface-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                                                          <Trash2 className="w-4 h-4" />
                                                                       </button>
                                                                    </div>
                                                                 </div>
                                                              )}
                                                           </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                     </div>
                                                  )}
                                               </Droppable>

                                               {/* ADD LECTURE BUTTONS */}
                                               <div className="mt-4 flex flex-wrap items-center gap-2 border border-dashed border-surface-700 p-3 rounded-lg">
                                                  <span className="text-sm text-surface-400 mr-2 font-medium">Add to section:</span>
                                                  <Button onClick={() => addLecture(section.id, 'video')} variant="ghost" size="sm" className="bg-surface-800"><Plus className="w-3 h-3 mr-1" /> Video</Button>
                                                  <Button onClick={() => addLecture(section.id, 'article')} variant="ghost" size="sm" className="bg-surface-800"><Plus className="w-3 h-3 mr-1" /> Article</Button>
                                                  <Button onClick={() => addLecture(section.id, 'quiz')} variant="ghost" size="sm" className="bg-surface-800"><Plus className="w-3 h-3 mr-1" /> Quiz</Button>
                                               </div>
                                            </div>
                                         )}
                                      </Card>
                                   )}
                                </Draggable>
                             ))}
                             {provided.placeholder}
                          </div>
                       )}
                    </Droppable>
                 </DragDropContext>

                 <Button variant="outline" onClick={addSection} className="mt-6 border-dashed border-surface-600 text-surface-300 hover:text-white w-full py-6">
                    <Plus className="w-5 h-5 mr-2" /> Add Section
                 </Button>
              </div>

              {/* EDITOR PANEL (RIGHT SIDE) */}
              {selectedLecture && (
                 <div className="w-full xl:w-[450px] shrink-0 sticky top-4">
                    <Card className="p-0 border-primary-500/20 shadow-2xl overflow-hidden bg-surface-900 flex flex-col h-[calc(100vh-100px)]">
                       
                       <div className="p-4 border-b border-surface-800 flex items-center justify-between bg-surface-800/30">
                          <div className="flex items-center gap-2">
                             {getIcon(selectedLecture.type)}
                             <h3 className="font-bold text-white truncate max-w-[200px]">{selectedLecture.title}</h3>
                          </div>
                          <button onClick={() => setSelectedLecture(null)} className="p-1 hover:bg-surface-700 rounded-full text-surface-400 hover:text-white transition-colors">
                             <X className="w-5 h-5" />
                          </button>
                       </div>

                       <div className="flex-1 overflow-y-auto p-5 space-y-6">
                          
                          <Input 
                             label="Lecture Title" 
                             defaultValue={selectedLecture.title} 
                          />

                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`flex h-5 w-5 items-center justify-center rounded border ${selectedLecture.is_free_preview ? 'border-primary-500 bg-primary-500' : 'border-surface-600 group-hover:border-surface-400'}`}>
                              {selectedLecture.is_free_preview && <Check className="h-3.5 w-3.5 text-white" />}
                            </div>
                            <span className="text-sm font-medium text-surface-200 group-hover:text-white">Free Preview</span>
                          </label>

                          {/* DYNAMIC EDITOR BASED ON TYPE */}
                          {selectedLecture.type === 'video' && (
                             <div className="space-y-6">
                                <div className="space-y-4 pt-2">
                                   <h4 className="text-sm font-semibold text-white">Video Source</h4>
                                   <div className="border-2 border-dashed border-surface-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-surface-800/50 transition-colors cursor-pointer group">
                                      <UploadCloud className="w-10 h-10 text-surface-500 group-hover:text-primary-400 mb-3" />
                                      <p className="text-sm text-surface-300 font-medium max-w-[200px]">Drag and drop video here, or click to browse</p>
                                      <p className="text-xs text-surface-500 mt-2">MP4 or WebM up to 4GB</p>
                                   </div>
                                   
                                   <div className="relative flex items-center py-2">
                                      <div className="flex-grow border-t border-surface-800"></div>
                                      <span className="flex-shrink-0 mx-4 text-surface-500 text-xs font-bold uppercase tracking-wider">OR EMBED</span>
                                      <div className="flex-grow border-t border-surface-800"></div>
                                   </div>
                                   
                                   <Input 
                                     label="YouTube / Vimeo URL" 
                                     placeholder="https://youtube.com/watch?v=..." 
                                     icon={<Youtube className="w-4 h-4 text-surface-400" />}
                                   />
                                </div>
                                
                                <Input label="Description (Optional)" placeholder="Add a short description about this video" />
                             </div>
                          )}

                          {selectedLecture.type === 'article' && (
                             <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-white mb-2">Article Content</h4>
                                <div className="bg-white rounded-lg overflow-hidden border-2 border-surface-700 focus-within:border-primary-500 transition-colors text-black min-h-[300px]">
                                   <ReactQuill theme="snow" className="h-full min-h-[250px]" defaultValue="Start writing your article here..." />
                                </div>
                             </div>
                          )}

                          {selectedLecture.type === 'quiz' && (
                             <div className="space-y-4">
                                <Input label="Pass Percentage (%)" type="number" defaultValue="80" />
                                <div className="border border-surface-800 rounded-xl p-4 space-y-4 bg-surface-950">
                                   <h4 className="text-sm font-bold text-white flex justify-between items-center">
                                     Questions (0)
                                     <Button size="sm" variant="outline"><Plus className="w-3 h-3 mr-1" /> Add</Button>
                                   </h4>
                                   <div className="py-8 text-center text-surface-500 text-sm">No questions added yet.</div>
                                </div>
                             </div>
                          )}

                       </div>

                       <div className="p-4 border-t border-surface-800 bg-surface-900/50 flex items-center justify-end gap-3">
                          <Button variant="ghost" onClick={() => setSelectedLecture(null)}>Cancel</Button>
                          <Button><CheckCircle className="w-4 h-4 mr-2" /> Save Lecture</Button>
                       </div>

                    </Card>
                 </div>
              )}

           </div>
         </main>

         {/* YOUTUBE PLAYLIST IMPORT MODAL */}
         {showYoutubeModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm">
             <Card className="w-full max-w-lg p-6 bg-surface-900 border-surface-700 shadow-2xl relative">
               <button 
                 onClick={() => setShowYoutubeModal(false)}
                 className="absolute top-4 right-4 p-2 text-surface-400 hover:text-white rounded-full hover:bg-surface-800 transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
               
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                   <Youtube className="w-5 h-5" />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-white leading-tight">Import YouTube Playlist</h2>
                   <p className="text-sm text-surface-400 mt-1">Automatically generate course sections and lectures from a YouTube Playlist.</p>
                 </div>
               </div>

               <div className="space-y-6">
                 <div>
                   <Input 
                     label="Playlist URL" 
                     placeholder="https://youtube.com/playlist?list=..." 
                     value={youtubePlaylistUrl}
                     onChange={(e) => setYoutubePlaylistUrl(e.target.value)}
                     icon={<Youtube className="w-4 h-4" />}
                   />
                   <p className="text-xs text-surface-500 mt-2">The playlist must be Public or Unlisted.</p>
                 </div>
                 
                 <div className="p-4 rounded-lg bg-surface-950/50 border border-surface-800 text-sm text-surface-300 space-y-2">
                   <div className="flex items-center gap-2 mb-2 font-bold text-white">What this will do:</div>
                   <ul className="list-disc pl-5 space-y-1">
                     <li>Create a new Section titled &quot;Imported Playlist&quot;</li>
                     <li>Create a Video Lecture for every video in the playlist</li>
                     <li>Automatically fetch titles and descriptions from YouTube</li>
                     <li>Embed the videos directly into the player</li>
                   </ul>
                 </div>

                 <div className="flex justify-end gap-3 pt-4">
                   <Button variant="ghost" onClick={() => setShowYoutubeModal(false)}>Cancel</Button>
                   <Button 
                     onClick={() => {
                        setShowYoutubeModal(false);
                        setYoutubePlaylistUrl('');
                        // In Phase 11, this would call the /api/youtube endpoint
                     }}
                     className="bg-red-600 hover:bg-red-700 text-white border-0"
                   >
                     Start Import Process
                   </Button>
                 </div>
               </div>
             </Card>
           </div>
         )}
      </div>
  )
}