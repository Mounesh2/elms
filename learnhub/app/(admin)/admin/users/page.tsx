'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, Button, Input } from '@/components/ui'
import { Search, Filter, MoreVertical, ShieldCheck, Mail, Ban, UserCheck } from 'lucide-react'

// MOCK DATA for Admin Users Log
const MOCK_ALL_USERS = [
  { id: 'u1', name: 'Alice Smith', email: 'alice@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', role: 'student', joinDate: 'Oct 12, 2025', status: 'active' },
  { id: 'u2', name: 'Dr. Angela Yu', email: 'angela@appbrewery.co', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop', role: 'instructor', joinDate: 'Jan 04, 2024', status: 'active' },
  { id: 'u3', name: 'Charlie Davis', email: 'charlie.d@gmail.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop', role: 'student', joinDate: 'Nov 02, 2025', status: 'suspended' },
  { id: 'u4', name: 'System Admin', email: 'admin@learnhub.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', role: 'admin', joinDate: 'Aug 01, 2023', status: 'active' },
  { id: 'u5', name: 'Colt Steele', email: 'colt@steele.dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', role: 'instructor', joinDate: 'Feb 15, 2024', status: 'active' },
]

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const filteredUsers = MOCK_ALL_USERS.filter(user => {
     const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase())
     const matchesRole = filterRole === 'all' || user.role === filterRole
     return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-8 pb-24">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-800">
          <div>
             <h1 className="text-3xl font-heading font-bold text-white mb-2">User Management</h1>
             <div className="text-surface-400">Manage accounts, roles, and platform access.</div>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-5 bg-surface-900 border-surface-800">
             <div className="text-surface-400 text-sm mb-1">Total Users</div>
             <div className="text-2xl font-bold text-white">124,592</div>
          </Card>
          <Card className="p-5 bg-surface-900 border-surface-800">
             <div className="text-surface-400 text-sm mb-1">Instructors</div>
             <div className="text-2xl font-bold text-white">4,012</div>
          </Card>
          <Card className="p-5 bg-surface-900 border-surface-800">
             <div className="text-surface-400 text-sm mb-1">Admins</div>
             <div className="text-2xl font-bold text-white">14</div>
          </Card>
          <Card className="p-5 bg-surface-900 border-surface-800 border-red-500/20 bg-red-500/5">
             <div className="text-red-400/80 text-sm mb-1">Suspended Accounts</div>
             <div className="text-2xl font-bold text-red-500">142</div>
          </Card>
       </div>

       <Card className="bg-surface-900 border-surface-800 overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-surface-800 flex flex-col sm:flex-row gap-4 justify-between bg-surface-950/50">
             <div className="w-full sm:w-96 relative">
                <Input 
                   placeholder="Search by name, email, or ID" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="pl-10 bg-surface-900"
                />
                <Search className="w-4 h-4 text-surface-500 absolute left-3 top-3" />
             </div>
             <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <button onClick={()=>setFilterRole('all')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${filterRole === 'all' ? 'bg-surface-800 text-white' : 'text-surface-400 hover:text-white hover:bg-surface-800/50'}`}>All Users</button>
                <button onClick={()=>setFilterRole('student')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${filterRole === 'student' ? 'bg-surface-800 text-white' : 'text-surface-400 hover:text-white hover:bg-surface-800/50'}`}>Students</button>
                <button onClick={()=>setFilterRole('instructor')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${filterRole === 'instructor' ? 'bg-surface-800 text-white' : 'text-surface-400 hover:text-white hover:bg-surface-800/50'}`}>Instructors</button>
                <button onClick={()=>setFilterRole('admin')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors whitespace-nowrap ${filterRole === 'admin' ? 'bg-surface-800 text-white' : 'text-surface-400 hover:text-white hover:bg-surface-800/50'}`}>Admins</button>
             </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-surface-300">
                <thead className="bg-surface-950 text-xs uppercase font-bold text-surface-500 border-b border-surface-800">
                   <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Join Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                   {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-surface-800/30 transition-colors group">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <Image 
                                 src={user.avatar} 
                                 alt={user.name} 
                                 width={40} height={40} 
                                 className="rounded-full object-cover shrink-0"
                               />
                               <div>
                                  <div className="font-bold text-white group-hover:text-primary-400 transition-colors">{user.name}</div>
                                  <div className="text-xs text-surface-500">{user.email}</div>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            {user.role === 'admin' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-primary-500/10 text-primary-400 border border-primary-500/20"><ShieldCheck className="w-3.5 h-3.5" /> Admin</span>}
                            {user.role === 'instructor' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Instructor</span>}
                            {user.role === 'student' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-surface-800 text-surface-300">Student</span>}
                         </td>
                         <td className="px-6 py-4 text-surface-400 font-mono text-xs">{user.joinDate}</td>
                         <td className="px-6 py-4">
                            {user.status === 'active' ? (
                               <span className="flex items-center text-xs font-bold text-green-400"><div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></div> Active</span>
                            ) : (
                               <span className="flex items-center text-xs font-bold text-red-500"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div> Suspended</span>
                            )}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors" title="Email User">
                                  <Mail className="w-4 h-4" />
                               </button>
                               {user.status === 'active' ? (
                                  <button className="p-2 text-surface-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Suspend Account">
                                     <Ban className="w-4 h-4" />
                                  </button>
                               ) : (
                                  <button className="p-2 text-surface-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors" title="Restore Account">
                                     <UserCheck className="w-4 h-4" />
                                  </button>
                               )}
                               <button className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors" title="More Options">
                                  <MoreVertical className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                   )) : (
                      <tr>
                         <td colSpan={5} className="px-6 py-12 text-center text-surface-500 font-medium">
                            No users found matching your filters.
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
       </Card>
    </div>
  )
}