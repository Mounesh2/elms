'use client'

const COMPANIES = [
  { name: 'Google',     logo: 'https://www.vectorlogo.zone/logos/google/google-ar21.svg' },
  { name: 'Amazon',     logo: 'https://www.vectorlogo.zone/logos/amazon/amazon-ar21.svg' },
  { name: 'Microsoft',  logo: 'https://www.vectorlogo.zone/logos/microsoft/microsoft-ar21.svg' },
  { name: 'Apple',      logo: 'https://www.vectorlogo.zone/logos/apple/apple-ar21.svg' },
  { name: 'Meta',       logo: 'https://www.vectorlogo.zone/logos/facebook/facebook-ar21.svg' },
  { name: 'Netflix',    logo: 'https://www.vectorlogo.zone/logos/netflix/netflix-ar21.svg' },
  { name: 'Adobe',      logo: 'https://www.vectorlogo.zone/logos/adobe/adobe-ar21.svg' },
]

export default function TrustedCompanies() {
  return (
    <div className="w-full bg-[#f7f4f0] py-12 border-b border-surface-200">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-base text-surface-500 mb-8">
            Trusted by over 17,000 companies and millions of learners around the world
        </h2>
        
        <div className="relative overflow-hidden group">
            <div className="flex items-center justify-between gap-8 md:gap-12 lg:gap-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 overflow-x-auto no-scrollbar pb-4 md:pb-0">
                {COMPANIES.map((company) => (
                    <div key={company.name} className="flex-shrink-0 flex items-center justify-center">
                        <img
                            src={company.logo}
                            alt={company.name}
                            className="h-8 w-24 lg:h-10 lg:w-32 object-contain"
                            onError={(e) => {
                              const t = e.currentTarget
                              t.style.display = 'none'
                              const span = document.createElement('span')
                              span.textContent = company.name
                              span.className = 'text-sm font-semibold text-surface-600 whitespace-nowrap'
                              t.parentElement?.appendChild(span)
                            }}
                        />
                    </div>
                ))}
            </div>
            
            {/* Gradient Overlays for smooth edges on mobile scroll */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#f7f4f0] to-transparent pointer-events-none md:hidden" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#f7f4f0] to-transparent pointer-events-none md:hidden" />
        </div>
      </div>
    </div>
  )
}
