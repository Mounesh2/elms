'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, Button, Input } from '@/components/ui'
import { Lock, ShieldCheck, CheckCircle2, ChevronRight, CreditCard } from 'lucide-react'

// MOCK DATA for Checkout Panel
const MOCK_ORDER = {
  items: [
    {
      id: 'c1',
      title: 'Complete Python Bootcamp: Go from zero to hero in Python 3',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?w=800&q=80',
      price: 14.99,
      originalPrice: 84.99,
    },
    {
      id: 'c3',
      title: 'Machine Learning A-Z: AI, Python & R',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
      price: 19.99,
      originalPrice: 94.99,
    }
  ],
  total: 34.98
}

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate Stripe Processing
    setTimeout(() => {
       setIsProcessing(false)
       setIsSuccess(true)
    }, 2000)
  }

  if (isSuccess) {
     return (
        <div className="max-w-2xl mx-auto py-24 text-center px-4">
           <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in">
              <CheckCircle2 className="w-12 h-12" />
           </div>
           <h1 className="text-4xl font-heading font-bold text-white mb-4">Payment Successful!</h1>
           <p className="text-surface-300 mb-8 max-w-md mx-auto">
              Welcome aboard! You have successfully enrolled in your new courses. A receipt has been sent to your email.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                 <Button size="lg" className="w-full">Go to Dashboard</Button>
              </Link>
              <Link href="/my-courses" className="w-full sm:w-auto">
                 <Button size="lg" variant="outline" className="w-full">Start Learning</Button>
              </Link>
           </div>
        </div>
     )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 min-h-screen pb-24 px-4 sm:px-6 lg:px-8">
       <div className="flex items-center gap-2 text-sm font-bold text-surface-400 uppercase tracking-widest border-b border-surface-800 pb-4">
          <Link href="/cart" className="hover:text-primary-400 transition-colors">Cart</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Checkout</span>
       </div>

       <div className="flex flex-col-reverse lg:flex-row gap-8 items-start">
          
          {/* ─── LEFT: PAYMENT FORM ─── */}
          <div className="flex-1 w-full space-y-8">
             <h1 className="text-3xl font-heading font-bold text-white">Checkout</h1>
             
             <Card className="p-6 md:p-8 bg-surface-900 border-surface-800">
                <h2 className="text-xl font-bold text-white mb-6 border-b border-surface-800 pb-4">Billing Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-sm font-medium text-surface-300">First Name</label>
                      <Input placeholder="John" className="bg-surface-950" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-sm font-medium text-surface-300">Last Name</label>
                      <Input placeholder="Doe" className="bg-surface-950" />
                   </div>
                   <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-medium text-surface-300">Country</label>
                      <select className="flex h-10 w-full rounded-md border border-surface-700 bg-surface-950 px-3 py-2 text-sm text-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                         <option>United States</option>
                         <option>United Kingdom</option>
                         <option>Canada</option>
                         <option>Australia</option>
                         <option>India</option>
                      </select>
                   </div>
                </div>
             </Card>

             <Card className="p-6 md:p-8 bg-surface-900 border-surface-800">
                <h2 className="text-xl font-bold text-white mb-6 border-b border-surface-800 pb-4">Payment Method</h2>
                
                <div className="flex items-center gap-4 mb-8">
                   <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                         paymentMethod === 'card' 
                         ? 'border-primary-500 bg-primary-500/10 text-primary-400' 
                         : 'border-surface-700 bg-surface-950 text-surface-400 hover:border-surface-600'
                      }`}
                   >
                      <CreditCard className="w-5 h-5" /> Credit/Debit Card
                   </button>
                   <button 
                      onClick={() => setPaymentMethod('paypal')}
                      className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                         paymentMethod === 'paypal' 
                         ? 'border-[#003087] bg-[#003087]/10 text-[#0070ba]' 
                         : 'border-surface-700 bg-surface-950 text-surface-400 hover:border-surface-600'
                      }`}
                   >
                      <svg viewBox="0 0 100 32" className="h-5" fill="currentColor">
                         <path d="M11.666 4.604h-5.465c-.863 0-1.58.643-1.728 1.492L2.094 22.09c-.114.66.402 1.25 1.077 1.25h3.9c.475 0 .888-.352.97-.818l.824-4.803c.094-.539.559-.94 1.107-.94h2.158c3.55 0 6.273-1.465 7.027-5.592.361-1.956.09-3.486-1.12-4.646-1.346-1.288-3.49-1.937-6.37-1.937zm1.185 8.165c-.328 1.88-2.02 1.88-3.834 1.88h-1.614l.758-4.43c.036-.208.212-.363.424-.363h1.033c1.233 0 2.22.122 2.684.567.432.417.65 1.096.55 2.346z"/>
                         {/* Simplified for demo layout */}
                         <text x="30" y="24" fontSize="24" fontFamily="sans-serif" fontWeight="bold" letterSpacing="-1">PayPal</text>
                      </svg>
                   </button>
                </div>

                {paymentMethod === 'card' && (
                  <form onSubmit={handleCheckout} className="space-y-4">
                     {/* Mock Stripe Elements container */}
                     <div className="p-4 rounded-md border border-surface-700 bg-surface-950/50 space-y-4">
                        <div className="space-y-1">
                           <label className="text-xs font-medium text-surface-400 uppercase tracking-wide">Card Information</label>
                           <div className="relative">
                              <Input placeholder="0000 0000 0000 0000" className="bg-surface-950 pl-10 font-mono tracking-widest text-white" required />
                              <CreditCard className="w-5 h-5 text-surface-500 absolute left-3 top-2.5" />
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <Input placeholder="MM / YY" className="bg-surface-950 font-mono" required />
                           <Input placeholder="CVC" className="bg-surface-950 font-mono" required />
                        </div>
                        <div className="space-y-1">
                           <label className="text-xs font-medium text-surface-400 uppercase tracking-wide">Name on Card</label>
                           <Input placeholder="John Doe" className="bg-surface-950" required />
                        </div>
                     </div>
                     <Button type="submit" size="lg" className="w-full py-4 text-lg mt-6 shadow-xl shadow-primary-500/10" disabled={isProcessing}>
                        {isProcessing ? (
                          <span className="flex items-center"><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing Payment...</span>
                        ) : (
                          `Pay $${MOCK_ORDER.total.toFixed(2)}`
                        )}
                     </Button>
                  </form>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="p-8 text-center border border-surface-800 rounded-xl bg-surface-950 flex flex-col items-center">
                     <p className="text-surface-300 mb-6 font-medium">You will be redirected to PayPal to securely complete your purchase.</p>
                     <Button size="lg" className="w-full max-w-sm bg-[#ffc439] hover:bg-[#ffc439]/90 text-[#003087]" onClick={handleCheckout} disabled={isProcessing}>
                        {isProcessing ? 'Redirecting...' : 'Pay with PayPal'}
                     </Button>
                  </div>
                )}
             </Card>

          </div>

          {/* ─── RIGHT: ORDER SUMMARY ─── */}
          <div className="w-full lg:w-[420px] shrink-0 sticky top-24">
             <Card className="bg-surface-900 border-surface-800 overflow-hidden">
                <div className="p-6 bg-surface-950 border-b border-surface-800">
                   <h3 className="font-bold text-white text-xl">Order Review</h3>
                </div>
                
                <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                   {MOCK_ORDER.items.map(item => (
                      <div key={item.id} className="flex gap-4 group">
                         <div className="w-16 h-12 relative rounded border border-surface-800 overflow-hidden shrink-0">
                            <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                         </div>
                         <div className="flex-1">
                            <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-primary-400 transition-colors">{item.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="font-bold text-white">${item.price}</span>
                               <span className="text-xs text-surface-500 line-through">${item.originalPrice}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="p-6 bg-surface-950 border-t border-surface-800 space-y-4">
                   <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-2xl text-white">${MOCK_ORDER.total.toFixed(2)}</span>
                   </div>
                   
                   <p className="text-xs text-surface-500 leading-relaxed text-center">
                      By completing your purchase you agree to these <Link href="#" className="underline hover:text-white">Terms of Service</Link>.
                   </p>
                </div>
             </Card>

             <div className="mt-6 space-y-4 text-sm">
                <div className="flex gap-3 items-start p-4 rounded-xl bg-surface-900 border border-surface-800">
                   <Lock className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                   <div>
                      <div className="font-bold text-white">Secure Payment</div>
                      <div className="text-surface-400 text-xs mt-0.5 leading-relaxed">All payments are encrypted and securely processed via Stripe.</div>
                   </div>
                </div>
                <div className="flex gap-3 items-start p-4 rounded-xl bg-surface-900 border border-surface-800">
                   <ShieldCheck className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                   <div>
                      <div className="font-bold text-white">30-Day Guarantee</div>
                      <div className="text-surface-400 text-xs mt-0.5 leading-relaxed">Not satisfied? Get a full refund within 30 days of purchase.</div>
                   </div>
                </div>
             </div>
          </div>

       </div>
    </div>
  )
}