'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, Button, Input, Badge } from '@/components/ui'
import { VideoUploader } from '@/components/instructor/VideoUploader'
import { 
  Save, CheckCircle, AlertCircle, Plus, X, UploadCloud,
  Layers, Tags, DollarSign, Globe, Play, Image as ImageIcon, Trash2
} from 'lucide-react'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

const CATEGORIES = ['Web Development', 'Data Science', 'Mobile Development', 'Design', 'Marketing']
const PRICE_TIERS = [0, 9.99, 14.99, 19.99, 24.99, 29.99, 39.99, 49.99, 74.99, 99.99]

export default function CourseSettingsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'basics' | 'learners' | 'pricing' | 'publish'>('basics')
  
  // -- Basic Detail States
  const [title, setTitle] = useState('Complete Python Bootcamp: Go from zero to hero')
  const [subtitle, setSubtitle] = useState('Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games')
  const [description, setDescription] = useState('Python is the most popular programming language in the world.')
  const [language, setLanguage] = useState('english')
  const [level, setLevel] = useState('beginner')
  const [category, setCategory] = useState('Web Development')
  const [tags, setTags] = useState<string[]>(['python', 'coding'])
  const [tagInput, setTagInput] = useState('')

  // -- Learners States
  const [outcomes, setOutcomes] = useState<string[]>(['Learn Python from scratch', 'Build 3 complete apps'])
  const [requirements, setRequirements] = useState<string[]>(['No programming experience needed', 'Mac or PC'])
  const [audiences, setAudiences] = useState<string[]>(['Beginners looking to learn to code'])

  // -- Pricing States
  const [price, setPrice] = useState(19.99)
  const [originalPrice, setOriginalPrice] = useState(84.99)

  // -- Status
  const [status, setStatus] = useState('draft')
  
  // Validation checks for publishing
  const canPublish = title.length > 0 && description.length > 50 && outcomes.length >= 4 && requirements.length >= 1 && audiences.length >= 1

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim() && tags.length < 12) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleArrayAdd = (setter: React.Dispatch<React.SetStateAction<string[]>>, val: string[]) => setter([...val, ''])
  const handleArrayUpdate = (setter: React.Dispatch<React.SetStateAction<string[]>>, val: string[], idx: number, newStr: string) => {
    const next = [...val]
    next[idx] = newStr
    setter(next)
  }
  const handleArrayRemove = (setter: React.Dispatch<React.SetStateAction<string[]>>, val: string[], idx: number) => {
    const next = [...val]
    next.splice(idx, 1)
    setter(next)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
       
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
             <h1 className="text-3xl font-heading font-bold text-white">Course Settings</h1>
             <p className="text-surface-400 mt-1">Manage details, pricing, and marketing content for your course.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline">Preview</Button>
             <Button><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
          </div>
       </div>

       {/* TABS NAV */}
       <div className="flex bg-surface-900 p-1.5 rounded-xl border border-surface-800 w-fit">
          {[
            { id: 'basics', label: 'Basics & Media' },
            { id: 'learners', label: 'Intended Learners' },
            { id: 'pricing', label: 'Pricing' },
            { id: 'publish', label: 'Publish Workflow' }
          ].map(tab => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === tab.id ? 'bg-surface-800 text-white shadow-sm' : 'text-surface-400 hover:text-white hover:bg-surface-800/50'}`}
            >
               {tab.label}
            </button>
          ))}
       </div>

       {/* TAB CONTENT */}
       <div className="pt-2 pb-12">
          
          {/* BASICS TAB */}
          {activeTab === 'basics' && (
             <div className="space-y-8">
               <Card className="p-8 bg-surface-900 border-surface-800 space-y-6">
                 <div>
                   <h3 className="text-xl font-bold text-white mb-6 border-b border-surface-800 pb-4">Course Details</h3>
                   <div className="space-y-6">
                      
                      <div className="relative">
                        <Input 
                          label="Course Title" 
                          value={title} 
                          onChange={e => setTitle(e.target.value)} 
                          maxLength={60}
                          placeholder="Insert your course title."
                        />
                        <div className="absolute right-0 top-0 text-xs text-surface-500 font-medium">
                          {title.length} / 60
                        </div>
                      </div>

                      <div className="relative">
                        <Input 
                          label="Course Subtitle" 
                          value={subtitle} 
                          onChange={e => setSubtitle(e.target.value)} 
                          maxLength={120}
                          placeholder="Insert your course subtitle."
                        />
                        <div className="absolute right-0 top-0 text-xs text-surface-500 font-medium">
                          {subtitle.length} / 120
                        </div>
                        <p className="text-xs text-surface-500 mt-1">Use 1 or 2 related keywords, and mention 3-4 of the most important areas that you&apos;ve covered during your course.</p>
                      </div>

                      <div>
                         <label className="block text-sm font-bold text-surface-300 mb-2">Course Description</label>
                         <div className="bg-white rounded-lg overflow-hidden border border-surface-700 text-black">
                           <ReactQuill theme="snow" value={description} onChange={setDescription} className="min-h-[200px]" />
                         </div>
                         <p className="text-xs text-surface-500 mt-2">Description should have minimum 200 words.</p>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-6 pt-4">
                         <div>
                            <label className="block text-sm font-bold text-surface-300 mb-2"><Globe className="w-4 h-4 inline mr-1" /> Language</label>
                            <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full bg-surface-800 border border-surface-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primary-500">
                               <option value="english">English</option>
                               <option value="spanish">Spanish</option>
                               <option value="french">French</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-surface-300 mb-2"><Layers className="w-4 h-4 inline mr-1" /> Level</label>
                            <select value={level} onChange={e => setLevel(e.target.value)} className="w-full bg-surface-800 border border-surface-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primary-500">
                               <option value="beginner">Beginner Level</option>
                               <option value="intermediate">Intermediate Level</option>
                               <option value="advanced">Advanced Level</option>
                               <option value="all-levels">All Levels</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-surface-300 mb-2"><Tags className="w-4 h-4 inline mr-1" /> Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-surface-800 border border-surface-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primary-500">
                               {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                         </div>
                      </div>

                      <div>
                         <label className="block text-sm font-bold text-surface-300 mb-2">Primary Tags (Max 12)</label>
                         <div className="flex flex-wrap items-center gap-2 mb-3 bg-surface-800 p-2 rounded-lg border border-surface-700 min-h-[50px]">
                            {tags.map((tag, i) => (
                              <div key={i} className="bg-surface-700 text-surface-200 text-xs px-2.5 py-1 rounded flex items-center gap-1 font-medium">
                                #{tag}
                                <button onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                              </div>
                            ))}
                            <input 
                              type="text" 
                              value={tagInput}
                              onChange={e => setTagInput(e.target.value)}
                              onKeyDown={handleAddTag}
                              placeholder={tags.length < 12 ? "Press enter to add tag..." : "Max tags reached"}
                              disabled={tags.length >= 12}
                              className="bg-transparent border-none outline-none text-sm text-white flex-1 min-w-[150px] p-1 disabled:opacity-50"
                            />
                         </div>
                      </div>

                   </div>
                 </div>
               </Card>

               <div className="grid md:grid-cols-2 gap-8">
                  {/* Thumbnail */}
                  <Card className="p-8 bg-surface-900 border-surface-800">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-primary-400" /> Course Image</h3>
                    <p className="text-surface-400 text-sm mb-6">Upload your course image here. It must meet our course image quality standards to be accepted. Important guidelines: 1280x720 pixels; .jpg, .jpeg,. gif, or .png. no text on the image.</p>
                    <div className="aspect-video bg-surface-800 border-2 border-dashed border-surface-600 rounded-xl flex flex-col items-center justify-center hover:bg-surface-700/50 transition-colors cursor-pointer group">
                       <UploadCloud className="w-10 h-10 text-surface-500 group-hover:text-primary-400 mb-3" />
                       <span className="font-bold text-surface-300">Upload File</span>
                    </div>
                  </Card>

                  {/* Promo Video */}
                  <Card className="p-8 bg-surface-900 border-surface-800">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Play className="w-5 h-5 text-primary-400" /> Promotional Video</h3>
                    <p className="text-surface-400 text-sm mb-6">Students who watch a well-made promo video are 5X more likely to enroll. The ideal length is under 2 minutes.</p>
                    <VideoUploader courseId={params.id} />
                  </Card>
               </div>
             </div>
          )}

          {/* LEARNERS TAB */}
          {activeTab === 'learners' && (
             <div className="space-y-8">
               <Card className="p-8 bg-surface-900 border-surface-800">
                  <h3 className="text-xl font-bold text-white mb-2">What will students learn in your course?</h3>
                  <p className="text-surface-400 text-sm mb-6">You must enter at least 4 learning objectives or outcomes that learners can expect to achieve after completing your course.</p>
                  
                  <div className="space-y-3 mb-4">
                     {outcomes.map((item, idx) => (
                       <div key={idx} className="flex items-center gap-3">
                         <div className="flex-1 relative">
                            <Input 
                               value={item} 
                               onChange={e => handleArrayUpdate(setOutcomes, outcomes, idx, e.target.value)} 
                               placeholder="e.g. You will learn how to build a web application from scratch" 
                            />
                         </div>
                         <button onClick={() => handleArrayRemove(setOutcomes, outcomes, idx)} className="p-2 text-surface-500 hover:text-red-400 bg-surface-800 hover:bg-surface-700 rounded-lg transition-colors border border-surface-700">
                            <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                     ))}
                  </div>
                  <Button variant="ghost" className="text-primary-400" onClick={() => handleArrayAdd(setOutcomes, outcomes)}><Plus className="w-4 h-4 mr-2" /> Add more to your response</Button>
               </Card>

               <Card className="p-8 bg-surface-900 border-surface-800">
                  <h3 className="text-xl font-bold text-white mb-2">What are the requirements or prerequisites for taking your course?</h3>
                  <p className="text-surface-400 text-sm mb-6">List the required skills, experience, tools or equipment learners should have prior to taking your course. If there are no requirements, use this space as an opportunity to lower the barrier for beginners.</p>
                  
                  <div className="space-y-3 mb-4">
                     {requirements.map((item, idx) => (
                       <div key={idx} className="flex items-center gap-3">
                         <div className="flex-1 relative">
                            <Input 
                               value={item} 
                               onChange={e => handleArrayUpdate(setRequirements, requirements, idx, e.target.value)} 
                               placeholder="e.g. No programming experience needed. You will learn everything you need to know" 
                            />
                         </div>
                         <button onClick={() => handleArrayRemove(setRequirements, requirements, idx)} className="p-2 text-surface-500 hover:text-red-400 bg-surface-800 hover:bg-surface-700 rounded-lg transition-colors border border-surface-700">
                            <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                     ))}
                  </div>
                  <Button variant="ghost" className="text-primary-400" onClick={() => handleArrayAdd(setRequirements, requirements)}><Plus className="w-4 h-4 mr-2" /> Add more to your response</Button>
               </Card>

               <Card className="p-8 bg-surface-900 border-surface-800">
                  <h3 className="text-xl font-bold text-white mb-2">Who is this course for?</h3>
                  <p className="text-surface-400 text-sm mb-6">Write a clear description of the intended learners for your course who will find your course content valuable. This will help you attract the right learners to your course.</p>
                  
                  <div className="space-y-3 mb-4">
                     {audiences.map((item, idx) => (
                       <div key={idx} className="flex items-center gap-3">
                         <div className="flex-1 relative">
                            <Input 
                               value={item} 
                               onChange={e => handleArrayUpdate(setAudiences, audiences, idx, e.target.value)} 
                               placeholder="e.g. Anyone interested in learning Python for Data Science" 
                            />
                         </div>
                         <button onClick={() => handleArrayRemove(setAudiences, audiences, idx)} className="p-2 text-surface-500 hover:text-red-400 bg-surface-800 hover:bg-surface-700 rounded-lg transition-colors border border-surface-700">
                            <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                     ))}
                  </div>
                  <Button variant="ghost" className="text-primary-400" onClick={() => handleArrayAdd(setAudiences, audiences)}><Plus className="w-4 h-4 mr-2" /> Add more to your response</Button>
               </Card>
             </div>
          )}

          {/* PRICING TAB */}
          {activeTab === 'pricing' && (
             <div className="max-w-3xl space-y-6">
                <Card className="p-8 bg-surface-900 border-surface-800">
                   <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-400" /> Set Pricing</h3>
                   <p className="text-surface-400 text-sm mb-8">Please select the price tier for your course below and click &apos;Save&apos;. The list price that students will see in other currencies is determined using the price tier matrix.</p>

                   <div className="grid sm:grid-cols-2 gap-8">
                      <div>
                         <label className="block text-sm font-bold text-surface-300 mb-2">Current Tier Price (What students pay)</label>
                         <select value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full bg-surface-800 border border-surface-700 rounded-lg px-4 py-3 text-white outline-none focus:border-primary-500 font-bold text-lg">
                            {PRICE_TIERS.map(pt => (
                               <option key={pt} value={pt}>{pt === 0 ? 'Free' : `$${pt.toFixed(2)}`}</option>
                            ))}
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-surface-300 mb-2">Original Baseline Price (Strike-through)</label>
                         <div className="relative">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 font-bold">$</span>
                           <input 
                             type="number" 
                             value={originalPrice} 
                             onChange={e => setOriginalPrice(Number(e.target.value))}
                             className="w-full bg-surface-800 border border-surface-700 rounded-lg pl-8 pr-4 py-3 text-white outline-none focus:border-primary-500 font-bold text-lg" 
                           />
                         </div>
                      </div>
                   </div>

                   <div className="mt-8 p-6 bg-surface-800/50 border border-surface-700 rounded-xl relative overflow-hidden">
                      <div className="text-sm font-bold text-primary-400 tracking-wider uppercase mb-2">Preview</div>
                      <div className="flex items-end gap-3">
                         <span className="text-4xl font-heading font-bold text-white leading-none">
                           {price === 0 ? 'Free' : `$${price.toFixed(2)}`}
                         </span>
                         {originalPrice > price && (
                           <>
                              <span className="text-surface-400 line-through text-xl mb-1">${originalPrice.toFixed(2)}</span>
                              <span className="text-accent-400 font-bold mb-1">
                                {Math.round((1 - price / originalPrice) * 100)}% off
                              </span>
                           </>
                         )}
                      </div>
                   </div>
                </Card>
             </div>
          )}

          {/* PUBLISH WORKFLOW TAB */}
          {activeTab === 'publish' && (
             <div className="max-w-3xl space-y-8">
               <Card className="p-8 bg-surface-900 border-surface-800 text-center">
                 <div className="mx-auto w-16 h-16 bg-surface-800 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className={`w-8 h-8 ${canPublish ? 'text-green-400' : 'text-surface-500'}`} />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Ready to publish?</h2>
                 <p className="text-surface-400 max-w-lg mx-auto mb-8">
                   Before you publish your course, please make sure all requirements are met. The review process can take up to 2 business days.
                 </p>

                 <div className="space-y-4 mb-8 text-left max-w-sm mx-auto">
                    <div className="flex items-center gap-3">
                      {title.length > 0 ? <CheckCircle className="w-5 h-5 text-green-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
                      <span className={title.length > 0 ? 'text-surface-200' : 'text-surface-400'}>Course title & description</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {outcomes.length >= 4 ? <CheckCircle className="w-5 h-5 text-green-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
                      <span className={outcomes.length >= 4 ? 'text-surface-200' : 'text-surface-400'}>At least 4 learning outcomes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                      <span className="text-surface-400">At least 30 minutes of video content</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                      <span className="text-surface-400">At least 5 published lectures</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                      <span className="text-surface-400">Course promotional thumbnail</span>
                    </div>
                 </div>

                 {status === 'draft' ? (
                   <Button size="lg" className="w-full sm:w-auto px-12" disabled={!canPublish}>Submit for Review</Button>
                 ) : (
                   <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl font-medium flex items-center justify-center gap-2">
                     Your course is currently under review. Estimated wait: 2 days.
                   </div>
                 )}
               </Card>
             </div>
          )}

       </div>

    </div>
  )
}