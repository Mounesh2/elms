'use client'

import { Check, Zap, Rocket, Star, ShieldCheck } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    name: 'Basic',
    price: '0',
    description: 'Perfect for individual learners starting their journey.',
    features: [
      'Access to all free courses',
      'Course completion certificates',
      'Community forum access',
      'Basic learner profile',
      'Mobile app access'
    ],
    cta: 'Get Started',
    popular: false,
    icon: Star,
    iconColor: 'text-surface-400'
  },
  {
    name: 'Pro',
    price: '29',
    description: 'The best value for serious students and professionals.',
    features: [
      'Everything in Basic',
      'Access to 2,000+ Premium courses',
      'Offline viewing',
      'Priority instructor support',
      'Live Q&A sessions',
      'Exclusive workshops'
    ],
    cta: 'Start 7-Day Free Trial',
    popular: true,
    icon: Zap,
    iconColor: 'text-primary-400'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Custom learning solutions for teams and organizations.',
    features: [
      'Everything in Pro',
      'Single Sign-On (SSO)',
      'Advanced analytics & reporting',
      'Dedicated success manager',
      'Custom learning paths',
      'API access'
    ],
    cta: 'Contact Sales',
    popular: false,
    icon: Rocket,
    iconColor: 'text-accent-400'
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-surface-950 py-24 pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <h1 className="text-4xl sm:text-6xl font-heading font-bold text-white tracking-tight">
            Simple, Transparent <span className="text-primary-500">Pricing</span>
          </h1>
          <p className="text-lg sm:text-xl text-surface-400 leading-relaxed font-medium">
            Invest in your future with our flexible plans. Choose the one that&apos;s right for your learning goals.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className="text-sm font-bold text-surface-300">Monthly</span>
            <button className="relative w-14 h-7 rounded-full bg-surface-800 border border-surface-700 transition-colors p-1 group">
              <div className="absolute right-1 top-1 w-5 h-5 rounded-full bg-primary-500 transition-transform group-active:scale-95 shadow-lg" />
            </button>
            <span className="text-sm font-bold text-surface-500 flex items-center gap-2">
              Yearly 
              <span className="bg-green-500/10 text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-500/20 uppercase font-black tracking-widest">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => (
            <Card 
              key={plan.name} 
              className={cn(
                "relative flex flex-col p-8 bg-surface-900 border-surface-800 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-900/10",
                plan.popular && "border-primary-500/50 ring-1 ring-primary-500/50 bg-gradient-to-b from-primary-500/10 to-surface-900"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-xl">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <div className={cn("inline-flex p-3 rounded-2xl bg-surface-950 border border-surface-800 mb-6 shadow-inner", plan.iconColor)}>
                  <plan.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-surface-400 text-sm font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8 items-baseline">
                {plan.price === 'Custom' ? (
                  <span className="text-4xl font-heading font-black text-white">Custom</span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-heading font-black text-white">${plan.price}</span>
                    <span className="text-surface-500 font-bold text-lg">/mo</span>
                  </div>
                )}
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-surface-300 leading-relaxed font-bold">
                    <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5 opacity-80" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.popular ? 'primary' : 'outline'} 
                size="lg" 
                className={cn(
                  "w-full h-14 text-base font-bold transition-all",
                  plan.popular ? "shadow-xl shadow-primary-900/40" : "border-surface-700 hover:border-surface-600"
                )}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* FAQ Preview */}
        <div className="mt-32 text-center">
          <p className="text-surface-500 font-bold uppercase tracking-widest text-xs mb-4">Trusted by 50,000+ Students</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all">
             <div className="font-heading text-2xl font-black text-white italic">TECHCORP</div>
             <div className="font-heading text-2xl font-black text-white">GlobalEDU</div>
             <div className="font-heading text-2xl font-black text-white italic">InnovateX</div>
             <div className="font-heading text-2xl font-black text-white">CloudScale</div>
          </div>
        </div>

      </div>
    </div>
  )
}
