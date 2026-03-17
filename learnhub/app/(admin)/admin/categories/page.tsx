'use client'

import { useState } from 'react'
import { Card, Button, Input } from '@/components/ui'
import { Search, PlusCircle, MoreVertical, Edit2, Trash2, FolderOpen, MoveUp, MoveDown } from 'lucide-react'

// MOCK DATA for Admin Categories
const MOCK_CATEGORIES = [
  { id: 'cat1', name: 'Development', slug: 'development', courseCount: 4520, order: 1 },
  { id: 'cat2', name: 'Business', slug: 'business', courseCount: 2310, order: 2 },
  { id: 'cat3', name: 'IT & Software', slug: 'it-software', courseCount: 1845, order: 3 },
  { id: 'cat4', name: 'Design', slug: 'design', courseCount: 1420, order: 4 },
  { id: 'cat5', name: 'Marketing', slug: 'marketing', courseCount: 950, order: 5 },
  { id: 'cat6', name: 'Personal Development', slug: 'personal-development', courseCount: 1100, order: 6 },
]

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState(MOCK_CATEGORIES)

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newCats = [...categories]
    const temp = newCats[index - 1]
    newCats[index - 1] = newCats[index]
    newCats[index] = temp
    setCategories(newCats)
  }

  const handleMoveDown = (index: number) => {
    if (index === categories.length - 1) return
    const newCats = [...categories]
    const temp = newCats[index + 1]
    newCats[index + 1] = newCats[index]
    newCats[index] = temp
    setCategories(newCats)
  }

  return (
    <div className="space-y-8 pb-24">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-800">
          <div>
             <h1 className="text-3xl font-heading font-bold text-white mb-2">Category Management</h1>
             <div className="text-surface-400">Organize the catalog taxonomy, featured categories, and sorting order.</div>
          </div>
          <div className="flex gap-3">
             <Button><PlusCircle className="w-4 h-4 mr-2" /> Add Category</Button>
          </div>
       </div>

       <Card className="bg-surface-900 border-surface-800 overflow-hidden max-w-4xl">
          {/* Controls Bar */}
          <div className="p-4 border-b border-surface-800 flex flex-col sm:flex-row gap-4 justify-between bg-surface-950/50">
             <div className="w-full sm:w-96 relative">
                <Input 
                   placeholder="Search categories..." 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="pl-10 bg-surface-900"
                />
                <Search className="w-4 h-4 text-surface-500 absolute left-3 top-3" />
             </div>
             <Button variant="outline"><FolderOpen className="w-4 h-4 mr-2" /> Manage Subcategories</Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-surface-300">
                <thead className="bg-surface-950 text-xs uppercase font-bold text-surface-500 border-b border-surface-800">
                   <tr>
                      <th className="px-6 py-4 w-16 text-center">Order</th>
                      <th className="px-6 py-4">Category Name</th>
                      <th className="px-6 py-4">Slug (URL)</th>
                      <th className="px-6 py-4 text-right">Published Courses</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                   {categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((cat, index) => (
                      <tr key={cat.id} className="hover:bg-surface-800/30 transition-colors group">
                         <td className="px-6 py-4">
                            <div className="flex flex-col items-center gap-1">
                               <button 
                                 onClick={() => handleMoveUp(index)}
                                 className="text-surface-500 hover:text-white disabled:opacity-30 disabled:hover:text-surface-500 transition-colors"
                                 disabled={index === 0}
                               >
                                  <MoveUp className="w-4 h-4" />
                               </button>
                               <span className="text-xs font-bold text-surface-400">{index + 1}</span>
                               <button 
                                 onClick={() => handleMoveDown(index)}
                                 className="text-surface-500 hover:text-white disabled:opacity-30 disabled:hover:text-surface-500 transition-colors"
                                 disabled={index === categories.length - 1}
                               >
                                  <MoveDown className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                         <td className="px-6 py-4 font-bold text-white text-base">{cat.name}</td>
                         <td className="px-6 py-4 font-mono text-xs text-primary-400 bg-primary-500/5 w-fit rounded my-4 inline-block px-2 py-1">/{cat.slug}</td>
                         <td className="px-6 py-4 text-right font-bold">{cat.courseCount.toLocaleString('en-US')}</td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors" title="Edit Category">
                                  <Edit2 className="w-4 h-4" />
                               </button>
                               <button className="p-2 text-surface-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete Category">
                                  <Trash2 className="w-4 h-4" />
                               </button>
                               <button className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors" title="More Options">
                                  <MoreVertical className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </Card>
    </div>
  )
}