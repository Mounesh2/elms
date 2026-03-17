'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, Button, Input } from '@/components/ui'
import { ShoppingCart, Trash2, Tag, ArrowRight, ShieldCheck, Star } from 'lucide-react'

// MOCK DATA for Shopping Cart
const MOCK_CART_ITEMS = [
  {
    id: 'c1',
    title: 'Complete Python Bootcamp: Go from zero to hero in Python 3',
    instructor: 'Dr. Angela Yu',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?w=800&q=80',
    rating: 4.7,
    reviews: 182434,
    price: 14.99,
    originalPrice: 84.99,
    slug: 'complete-python-bootcamp'
  },
  {
    id: 'c3',
    title: 'Machine Learning A-Z: AI, Python & R',
    instructor: 'Kirill Eremenko',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
    rating: 4.6,
    reviews: 132400,
    price: 19.99,
    originalPrice: 94.99,
    slug: 'machine-learning-az'
  }
]

export default function CartPage() {
  const [items, setItems] = useState(MOCK_CART_ITEMS)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)
  const [couponError, setCouponError] = useState('')

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const handleApplyCoupon = () => {
     setCouponError('')
     if (!couponCode.trim()) return

     // Mock Coupon Validation Logic
     if (couponCode.toUpperCase() === 'SAVE50') {
        setAppliedCoupon({ code: 'SAVE50', discount: 15.00 }) // Flat $15 off
        setCouponCode('')
     } else if (couponCode.toUpperCase() === 'PYTHONHQ') {
        setAppliedCoupon({ code: 'PYTHONHQ', discount: 5.00 })
        setCouponCode('')
     } else {
        setCouponError('Invalid or expired coupon code.')
     }
  }

  const removeCoupon = () => {
     setAppliedCoupon(null)
  }

  // Cost Calculations
  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const originalTotal = items.reduce((sum, item) => sum + item.originalPrice, 0)
  const totalDiscount = originalTotal - subtotal
  const discountFromCoupon = appliedCoupon ? appliedCoupon.discount : 0
  const finalTotal = Math.max(0, subtotal - discountFromCoupon)

  return (
    <div className="max-w-7xl mx-auto space-y-8 min-h-screen pb-24">
       <h1 className="text-4xl font-heading font-bold text-white">Shopping Cart</h1>

       {items.length === 0 ? (
          <Card className="p-12 text-center bg-surface-900 border-surface-800 flex flex-col items-center justify-center">
             <div className="w-24 h-24 bg-surface-800 rounded-full flex items-center justify-center mb-6">
                 <ShoppingCart className="w-10 h-10 text-surface-500" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
             <p className="text-surface-400 max-w-sm mb-8">Keep exploring to find a course! We have a wide variety of topics available.</p>
             <Link href="/courses">
                <Button size="lg"><SearchIcon className="w-5 h-5 mr-2" /> Browse courses</Button>
             </Link>
          </Card>
       ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
             
             {/* ─── CART ITEMS ─── */}
             <div className="flex-1 w-full space-y-4">
                <div className="text-surface-400 font-bold tracking-wide uppercase text-sm border-b border-surface-800 pb-4">
                   {items.length} Course{items.length !== 1 ? 's' : ''} in Cart
                </div>

                <div className="space-y-4">
                   {items.map(item => (
                      <Card key={item.id} className="p-4 sm:p-6 bg-surface-900 border-surface-800 flex flex-col sm:flex-row gap-6 relative group">
                         {/* Thumbnail */}
                         <Link href={`/courses/${item.slug}`} className="w-full sm:w-40 md:w-48 aspect-video relative rounded-lg overflow-hidden shrink-0 border border-surface-800 block">
                            <Image src={item.thumbnail} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                         </Link>

                         {/* Details */}
                         <div className="flex-1 flex flex-col">
                            <Link href={`/courses/${item.slug}`} className="block mb-2">
                               <h3 className="font-bold text-white text-lg leading-tight hover:text-primary-400 transition-colors line-clamp-2">{item.title}</h3>
                            </Link>
                            <div className="text-sm text-surface-400 mb-2">{item.instructor}</div>
                            
                            <div className="flex items-center gap-1 text-sm font-bold text-amber-400 mb-2">
                               {item.rating} <Star className="w-4 h-4 fill-current ml-0.5" /> <span className="text-surface-500 font-normal">({item.reviews.toLocaleString('en-US')} reviews)</span>
                            </div>

                            <button 
                               onClick={() => removeItem(item.id)}
                               className="mt-auto flex items-center text-sm font-bold text-red-500/80 hover:text-red-400 transition-colors w-fit"
                            >
                               <Trash2 className="w-4 h-4 mr-1.5" /> Remove
                            </button>
                         </div>

                         {/* Price (Desktop Right Side) */}
                         <div className="sm:text-right shrink-0 mt-4 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1">
                            <div className="text-2xl font-bold font-heading text-white">${item.price}</div>
                            <div className="text-sm text-surface-500 line-through">${item.originalPrice}</div>
                         </div>
                      </Card>
                   ))}
                </div>
             </div>

             {/* ─── CHECKOUT PANEL ─── */}
             <div className="w-full lg:w-[380px] shrink-0 sticky top-24 space-y-6">
                
                <Card className="p-6 md:p-8 bg-surface-900 border-surface-800 shadow-2xl">
                   <h3 className="font-bold text-white text-xl border-b border-surface-800 pb-4 mb-4">Order Summary</h3>
                   
                   <div className="space-y-3 mb-6 font-medium text-surface-300">
                      <div className="flex justify-between">
                         <span>Original Price:</span>
                         <span className="text-white">${originalTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-400">
                         <span>Course Discounts:</span>
                         <span>-${totalDiscount.toFixed(2)}</span>
                      </div>
                      {appliedCoupon && (
                         <div className="flex justify-between text-primary-400 font-bold border-t border-surface-800/50 pt-3">
                            <div className="flex items-center gap-2">
                               <span>Coupon <span className="uppercase bg-primary-500/20 px-1.5 py-0.5 rounded text-xs">{appliedCoupon.code}</span></span>
                               <button onClick={removeCoupon} className="text-surface-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                            <span>-${discountFromCoupon.toFixed(2)}</span>
                         </div>
                      )}
                   </div>

                   <div className="border-t border-surface-800 pt-4 mb-8">
                       <div className="flex justify-between items-end mb-1">
                          <span className="font-bold text-white text-xl">Total:</span>
                          <span className="font-heading font-bold text-4xl text-white tracking-tight">${finalTotal.toFixed(2)}</span>
                       </div>
                   </div>

                   <Button size="lg" className="w-full text-lg shadow-xl shadow-primary-500/20" onClick={() => window.location.href='/checkout'}>
                      Checkout <ArrowRight className="w-5 h-5 ml-2" />
                   </Button>

                   <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-surface-400 uppercase tracking-wide">
                      <ShieldCheck className="w-4 h-4 text-green-500" /> 30-Day Money-Back Guarantee
                   </div>
                </Card>

                {/* Coupon Code Input */}
                {!appliedCoupon && (
                   <div className="space-y-2">
                     <div className="flex gap-2">
                        <Input 
                          placeholder="Enter coupon code" 
                          value={couponCode} 
                          onChange={e => setCouponCode(e.target.value)}
                          className="flex-1 bg-surface-900"
                          icon={<Tag className="w-4 h-4" />}
                        />
                        <Button onClick={handleApplyCoupon} variant="secondary">Apply</Button>
                     </div>
                     {couponError && <div className="text-red-400 text-sm font-bold pl-1">{couponError}</div>}
                   </div>
                )}

             </div>
          </div>
       )}

    </div>
  )
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}