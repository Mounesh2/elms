'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Cpu, 
  Database, 
  Rocket, 
  Layers, 
  Code, 
  Share2, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react'

export default function HuggingFacePage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <div className="min-h-screen bg-white text-[#1c1d1f] font-sans">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-[#FFD21E]/10">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#FFD21E] blur-[150px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#FFD21E] blur-[120px]" />
        </div>
        
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeIn} className="max-w-4xl">
            <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#FFD21E] p-2 rounded-lg">
                    <Sparkles className="h-5 w-5 text-black" />
                </div>
                <span className="text-sm font-bold tracking-widest uppercase text-surface-500">Resource Guide</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1]">
                Understanding <span className="text-[#FFD21E] drop-shadow-sm text-shadow-black">Hugging Face</span>
            </h1>
            <p className="text-xl md:text-2xl text-surface-600 leading-relaxed max-w-2xl mb-10">
                The central platform for AI and Machine Learning. Learn how it has become the &quot;GitHub for AI&quot; and how you can use it to build next-generation applications.
            </p>
            <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-[#1c1d1f] text-white font-bold rounded-sm hover:bg-surface-800 transition-all flex items-center gap-2">
                    Start Learning <ChevronRight className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-4 px-6 py-4 bg-white border border-surface-200 rounded-sm">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-surface-200" />
                        ))}
                    </div>
                    <span className="text-sm font-medium text-surface-500">Joined by 10k+ students</span>
                </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Sidebar / Table of Contents */}
          <aside className="lg:col-span-3 hidden lg:block sticky top-32 h-fit">
            <h4 className="text-xs font-bold uppercase tracking-widest text-surface-400 mb-6">Content</h4>
            <nav className="flex flex-col gap-4">
                {['What is Hugging Face?', 'Why Students Love It', 'The Model Hub', 'What is a Space?', 'Deployment Guide', 'Accessing via API'].map((item, i) => (
                    <a key={i} href={`#step-${i}`} className="text-sm font-medium text-surface-600 hover:text-primary-700 transition-colors flex items-center gap-2 group">
                        <span className="w-6 h-[1px] bg-surface-200 group-hover:bg-primary-700 transition-all" />
                        {item}
                    </a>
                ))}
            </nav>
          </aside>

          {/* Article Body */}
          <main className="lg:col-span-9 space-y-24">
            
            {/* Intro */}
            <section id="step-0" className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
                    <BookOpen className="h-8 w-8 text-[#FFD21E]" />
                    What is Hugging Face?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="text-lg leading-relaxed text-surface-700 mb-6">
                            Hugging Face is a platform and community where developers and researchers share AI models, datasets, and tools.
                        </p>
                        <div className="bg-surface-50 p-6 border-l-4 border-[#FFD21E] space-y-4">
                            <div className="flex items-center gap-3">
                                <Code className="h-5 w-5 text-surface-400" />
                                <span className="font-bold">GitHub:</span> Used for sharing code
                            </div>
                            <div className="flex items-center gap-3">
                                <Cpu className="h-5 w-5 text-[#FFD21E]" />
                                <span className="font-bold text-[#FFD21E]">Hugging Face:</span> Used for sharing AI models
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-surface-200 p-8 rounded-sm shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD21E]/10 rounded-bl-full" />
                        <h4 className="font-bold mb-4">Core Workflow</h4>
                        <ul className="space-y-3">
                            {['Find an existing model', 'Download it', 'Use in your application', 'Fine-tune with your data'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-surface-600">
                                    <div className="w-5 h-5 rounded-full bg-[#FFD21E] text-black flex items-center justify-center text-[10px] font-bold">
                                        {i + 1}
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Why for Students */}
            <section id="step-1" className="space-y-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4">Why Hugging Face is Useful for Students</h2>
                    <p className="text-surface-600">Breaking down the barriers to AI development</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Database, title: 'No Large Datasets', desc: 'Use pre-trained models instead of gathering millions of data points.' },
                        { icon: Zap, title: 'No Expensive GPUs', desc: 'Experiment with real models without needing extreme hardware power.' },
                        { icon: Rocket, title: 'Deploy Easily', desc: 'Share your work with the world instantly through Spaces.' },
                        { icon: Globe, title: 'Global Community', desc: 'Learn from the best researchers and open-source contributors.' }
                    ].map((item, i) => (
                        <div key={i} className="p-8 border border-surface-200 hover:border-[#FFD21E] transition-all group">
                            <item.icon className="h-10 w-10 text-surface-300 group-hover:text-[#FFD21E] transition-colors mb-6" />
                            <h4 className="font-bold mb-3">{item.title}</h4>
                            <p className="text-sm text-surface-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Model Hub */}
            <section id="step-2" className="bg-[#1c1d1f] text-white p-12 md:p-24 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD21E]/10 blur-[100px] pointer-events-none" />
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-bold">The Hugging Face Model Hub</h2>
                        <p className="text-surface-400 text-lg">
                            One of the most important parts of Hugging Face is the Model Hub—a library containing thousands of ready-made AI models.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {['Researchers', 'Companies', 'Developers', 'Open-source'].map(t => (
                                <div key={t} className="flex items-center gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 bg-[#FFD21E] rounded-full" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-sm backdrop-blur-md">
                        <h4 className="font-bold mb-6 flex items-center gap-3">
                            <Layers className="h-5 w-5 text-[#FFD21E]" />
                            Search by Task
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {['Summarization', 'Translation', 'Image Generation', 'Speech Processing', 'Question Answering', 'Object Detection'].map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white/10 text-xs rounded-full hover:bg-[#FFD21E] hover:text-black transition-all cursor-pointer">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Spaces */}
            <section id="step-3" className="space-y-12">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold mb-6">What is a Hugging Face Space?</h2>
                        <p className="text-lg text-surface-600 mb-8 leading-relaxed">
                            A Space is a way to host and run AI applications. It turns a complex model into a usable web application that anyone can interact with.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-surface-100 p-2 rounded-sm text-surface-500">
                                    <Share2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <h5 className="font-bold">Interaction Flow</h5>
                                    <p className="text-sm text-surface-500">User input → AI Model processes → Visual Output shown on screen.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 w-full aspect-video bg-surface-100 rounded-sm border border-surface-200 overflow-hidden relative group">
                        <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-64 h-48 bg-white border border-surface-200 shadow-2xl relative animate-float">
                                <div className="h-8 bg-surface-50 border-b border-surface-200 flex items-center gap-2 px-3">
                                    <div className="w-2 h-2 rounded-full bg-red-400" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="h-4 bg-surface-100 w-3/4 rounded-sm" />
                                    <div className="h-12 bg-surface-50 border border-surface-200 w-full rounded-sm" />
                                    <div className="h-8 bg-[#FFD21E] w-1/2 rounded-sm" />
                                </div>
                             </div>
                        </div>
                        <div className="absolute bottom-4 left-4 bg-[#1c1d1f] text-white px-3 py-1 text-xs font-bold">
                            Live Space Preview
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech & API */}
            <section id="step-5" className="py-24 border-t border-surface-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Accessing Through API</h2>
                            <p className="text-lg text-surface-600 leading-relaxed mb-6">
                                Integrate Hugging Face models directly into your apps. An API allows one application to communicate with another service programmatically.
                            </p>
                            <div className="bg-[#1c1d1f] p-8 rounded-sm font-mono text-sm text-surface-300">
                                <div className="flex items-center gap-2 mb-4 text-surface-500 border-b border-white/10 pb-4">
                                    <span className="text-green-400">POST</span> /models/sentiment-analysis
                                </div>
                                <div className="space-y-1">
                                    <div>{'{'}</div>
                                    <div className="pl-4">&quot;inputs&quot;: &quot;Hugging Face is amazing!&quot;</div>
                                    <div>{'}'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="p-8 bg-[#FFD21E]/5 rounded-sm border border-[#FFD21E]/20">
                            <h4 className="font-bold mb-4 flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Tech Stack
                            </h4>
                            <ul className="space-y-2 text-sm text-surface-600">
                                <li>• Gradio (Python UI)</li>
                                <li>• Streamlit (Dashboard UI)</li>
                                <li>• Python Transfomers</li>
                                <li>• Docker</li>
                            </ul>
                        </div>
                        <div className="p-8 bg-surface-50 rounded-sm">
                             <h4 className="font-bold mb-4">Integrate into:</h4>
                             <ul className="space-y-2 text-sm text-surface-500 italic">
                                <li>- Next.js Websites</li>
                                <li>- Mobile Applications</li>
                                <li>- Python Backends</li>
                             </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Summary CTA */}
            <section className="text-center py-24 bg-surface-50 rounded-sm border border-surface-200">
                <div className="max-w-2xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8">Ready to experiment?</h2>
                    <p className="text-surface-600 mb-10">
                        Create your Hugging Face account today and start deploying your own AI experiments.
                    </p>
                    <a href="https://huggingface.co/join" target="_blank" className="inline-flex items-center gap-2 px-10 py-5 bg-[#FFD21E] text-black font-bold text-lg hover:shadow-2xl transition-all active:scale-95 leading-none">
                        Create Account <ExternalLink className="h-5 w-5" />
                    </a>
                </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  )
}
