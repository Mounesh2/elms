'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, Button } from '@/components/ui'
import { Heart, Star, ShoppingCart, Trash2, Home, CheckCircle2 } from 'lucide-react'

// MOCK DATA for Wishlist
const MOCK_WISHLIST = [
  {
    id: 'w1',
    title: 'The Web Developer Bootcamp 2024',
    instructor: 'Colt Steele',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    rating: 4.7,
    reviews: 265431,
    duration: '74 hours',
    lectures: 615,
    level: 'All Levels',
    price: 19.99,
    originalPrice: 99.99,
    slug: 'the-web-developer-bootcamp',
    bestseller: true
  },
  {
    id: 'w2',
    title: 'iOS & Swift - The Complete iOS App Development Bootcamp',
    instructor: 'Dr. Angela Yu',
    thumbnail: 'https://images.unsplash.com/photo-1512948612140-1111d4daeb80?w=800&q=80',
    rating: 4.8,
    reviews: 95400,
    duration: '59 hours',
    lectures: 520,
    level: 'Beginner',
    price: 14.99,
    originalPrice: 84.99,
    slug: 'ios-13-app-development-bootcamp',
    bestseller: true
  },
  {
    id: 'w3',
    title: 'React - The Complete Guide (incl Hooks, React Router, Redux)',
    instructor: 'Maximilian Schwarzmüller',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    rating: 4.6,
    reviews: 204312,
    duration: '48 hours',
    lectures: 412,
    level: 'Intermediate',
    price: 16.99,
    originalPrice: 89.99,
    slug: 'react-the-complete-guide-incl-redux',
    bestseller: false
  }
]

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(MOCK_WISHLIST)
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())

  const removeFromWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to course
    setWishlist(wishlist.filter(item => item.id !== id))
  }

  const handleAddToCart = (id: string, e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to course
    setAddedToCart(prev => new Set(prev).add(id))
    
    // In a real app, this removes the item from wishlist and adds to cart globally via API
    setTimeout(() => {
       setWishlist(wishlist.filter(item => item.id !== id))
    }, 1500)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 min-h-screen">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-surface-800">
          <div>
             <h1 className="text-4xl font-heading font-bold text-white mb-2">My Wishlist</h1>
             <div className="text-surface-400 font-medium">You have <span className="text-white">{wishlist.length}</span> courses saved for later.</div>
          </div>
          <Link href="/courses">
             <Button variant="outline"><Home className="w-4 h-4 mr-2" /> Browse More Courses</Button>
          </Link>
       </div>

       {wishlist.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {wishlist.map(course => (
                 <Link key={course.id} href={`/courses/${course.slug}`}>
                    <Card className="h-full bg-surface-900 border-surface-800 flex flex-col group overflow-hidden hover:border-surface-600 transition-all hover:shadow-xl hover:-translate-y-1">
                       {/* Thumbnail Area */}
                       <div className="aspect-video relative overflow-hidden bg-surface-950">
                          <Image 
                            src={course.thumbnail} 
                            alt={course.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Badges */}
                          <div className="absolute top-2 left-2 flex gap-2 z-10">
                            {course.bestseller && <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Bestseller</span>}
                          </div>

                          {/* Quick Remove Overlay Button */}
                          <button 
                             onClick={(e) => removeFromWishlist(course.id, e)}
                             className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors z-10"
                             title="Remove from wishlist"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>

                       {/* Content Area */}
                       <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-bold text-white line-clamp-2 leading-tight mb-1 group-hover:text-primary-400 transition-colors">
                             {course.title}
                          </h3>
                          <p className="text-sm text-surface-400 mb-2 truncate">{course.instructor}</p>
                          
                          {/* Rating Row */}
                          <div className="flex items-center gap-1.5 text-sm font-bold text-amber-400 mb-2">
                             {course.rating} <Star className="w-3.5 h-3.5 fill-current" /> 
                             <span className="text-surface-500 font-normal ml-0.5">({course.reviews.toLocaleString('en-US')})</span>
                          </div>

                          {/* Meta Row */}
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-surface-500 mb-4">
                             <span>{course.duration}</span>
                             <span className="w-1 h-1 bg-surface-700 rounded-full"></span>
                             <span>{course.lectures} lectures</span>
                             <span className="w-1 h-1 bg-surface-700 rounded-full"></span>
                             <span>{course.level}</span>
                          </div>
                          
                          <div className="mt-auto pt-4 border-t border-surface-800">
                             {/* Price */}
                             <div className="flex items-end gap-2 mb-4">
                               <div className="text-lg font-bold font-heading text-white">${course.price}</div>
                               <div className="text-sm text-surface-500 line-through mb-0.5">${course.originalPrice}</div>
                             </div>

                             <Button 
                               className="w-full relative shadow-lg shadow-primary-500/10"
                               onClick={(e) => handleAddToCart(course.id, e)}
                               disabled={addedToCart.has(course.id)}
                               variant={addedToCart.has(course.id) ? 'secondary' : 'primary'}
                             >
                               {addedToCart.has(course.id) ? (
                                 <><CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> Added to Cart</>
                               ) : (
                                 <><ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart</>
                               )}
                             </Button>
                          </div>
                       </div>
                    </Card>
                 </Link>
             ))}
          </div>
       ) : (
          <div className="py-24 text-center border border-dashed border-surface-800 rounded-2xl bg-surface-900/30">
             <div className="w-20 h-20 rounded-full bg-surface-800/80 flex items-center justify-center mx-auto mb-6 text-surface-500">
               <Heart className="w-10 h-10" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Your wishlist is empty</h3>
             <p className="text-surface-400 max-w-md mx-auto mb-8">Save courses you&apos;re interested in viewing later. Click the heart icon on any course card to add it to your wishlist.</p>
             <Link href="/courses">
               <Button size="lg">Browse Popular Courses</Button>
             </Link>
          </div>
       )}
    </div>
  )
}