'use client'

import { useState, useEffect } from 'react'
import { Card, Button } from '@/components/ui'
import { CheckCircle2, XCircle, Clock, ChevronRight, ChevronLeft, RefreshCcw, Award } from 'lucide-react'

export type Question = {
  id: string
  type: 'multiple-choice' | 'true-false'
  prompt: string
  options: { id: string, text: string }[]
  correctOptionId: string
  explanation: string
}

export type QuizData = {
  id: string
  title: string
  timeLimitSeconds?: number
  passPercentage: number
  questions: Question[]
}

interface QuizPlayerProps {
  quiz: QuizData
  onComplete: (score: number, passed: boolean) => void
}

export function QuizPlayer({ quiz, onComplete }: QuizPlayerProps) {
  const [hasStarted, setHasStarted] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(quiz.timeLimitSeconds || null)

  // Timer logic
  useEffect(() => {
    if (hasStarted && !isSubmitted && timeLeft !== null && timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft(prev => (prev! > 0 ? prev! - 1 : 0)), 1000)
      return () => clearInterval(timerId)
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit()
    }
  }, [hasStarted, isSubmitted, timeLeft])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const handleSelect = (questionId: string, optionId: string) => {
    if (isSubmitted) return
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    
    // Calculate score
    let correctCount = 0
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctOptionId) correctCount++
    })
    
    const percentage = Math.round((correctCount / quiz.questions.length) * 100)
    const passed = percentage >= quiz.passPercentage
    
    onComplete(percentage, passed)
  }

  const handleRetry = () => {
    setAnswers({})
    setIsSubmitted(false)
    setCurrentIdx(0)
    setTimeLeft(quiz.timeLimitSeconds || null)
  }

  // 1. Welcome Screen
  if (!hasStarted) {
    return (
      <Card className="p-8 md:p-12 text-center bg-surface-900 border-surface-800 max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-primary-500/10 text-primary-400 rounded-full flex items-center justify-center mx-auto mb-6">
           <Award className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{quiz.title}</h2>
        <p className="text-surface-300 mb-8 max-w-md mx-auto">Test your knowledge on the concepts covered in this section. You need {quiz.passPercentage}% to pass.</p>
        
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-surface-400 font-bold tracking-wide uppercase mb-10">
           <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {quiz.questions.length} Questions</span>
           {quiz.timeLimitSeconds && (
             <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {Math.round(quiz.timeLimitSeconds / 60)} Minutes</span>
           )}
        </div>
        
        <Button size="lg" className="w-full sm:w-auto px-12" onClick={() => setHasStarted(true)}>
           Start Quiz
        </Button>
      </Card>
    )
  }

  // 3. Results Screen
  if (isSubmitted) {
    let correctCount = 0
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctOptionId) correctCount++
    })
    const percentage = Math.round((correctCount / quiz.questions.length) * 100)
    const passed = percentage >= quiz.passPercentage

    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Score Card */}
        <Card className={`p-8 text-center border-2 ${passed ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
           <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {passed ? <Award className="w-10 h-10" /> : <RefreshCcw className="w-10 h-10" />}
           </div>
           
           <h2 className="text-3xl font-bold text-white mb-2">{passed ? 'Quiz Passed!' : 'Quiz Failed'}</h2>
           <div className="text-surface-300 text-lg mb-6">You scored <strong className={passed ? 'text-green-400' : 'text-red-400'}>{percentage}%</strong> ({correctCount} / {quiz.questions.length})</div>
           
           <div className="flex justify-center gap-4">
             {!passed && (
               <Button onClick={handleRetry}><RefreshCcw className="w-4 h-4 mr-2" /> Retry Quiz</Button>
             )}
             {passed && (
               <Button onClick={() => window.location.href='#'}>Continue to Next Lecture <ChevronRight className="w-4 h-4 ml-2" /></Button>
             )}
           </div>
        </Card>

        {/* Review Answers */}
        <div className="space-y-6">
           <h3 className="text-xl font-bold text-white mb-4">Review your answers</h3>
           {quiz.questions.map((q, idx) => {
              const selectedOpt = answers[q.id]
              const isCorrect = selectedOpt === q.correctOptionId
              const isSkipped = !selectedOpt

              return (
                <Card key={q.id} className="p-6 bg-surface-900 border-surface-800">
                   <div className="flex gap-4 mb-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isCorrect ? 'bg-green-500 text-white' : isSkipped ? 'bg-surface-700 text-surface-400' : 'bg-red-500 text-white'}`}>
                         {idx + 1}
                      </div>
                      <div className="flex-1">
                         <h4 className="font-bold text-white text-lg mb-4 leading-relaxed">{q.prompt}</h4>
                         
                         <div className="space-y-2 mb-6">
                            {q.options.map(opt => {
                               const isThisSelected = opt.id === selectedOpt
                               const isThisCorrectAnswers = opt.id === q.correctOptionId
                               
                               let bgParams = "bg-surface-950 border-surface-800 text-surface-300"
                               if (isThisCorrectAnswers) {
                                 bgParams = "bg-green-500/10 border-green-500/50 text-green-400 font-medium"
                               } else if (isThisSelected && !isThisCorrectAnswers) {
                                 bgParams = "bg-red-500/10 border-red-500/50 text-red-400"
                               }

                               return (
                                 <div key={opt.id} className={`p-4 rounded-xl border flex items-center justify-between ${bgParams}`}>
                                    <span>{opt.text}</span>
                                    {isThisCorrectAnswers && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                                    {isThisSelected && !isThisCorrectAnswers && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                                 </div>
                               )
                            })}
                         </div>

                         {/* Explanation Box */}
                         <div className="p-4 bg-surface-950 rounded-lg border border-surface-800">
                            <div className="text-xs font-bold text-surface-400 uppercase tracking-wide mb-1">Explanation</div>
                            <div className="text-sm text-surface-200">{q.explanation}</div>
                         </div>
                      </div>
                   </div>
                </Card>
              )
           })}
        </div>
      </div>
    )
  }

  // 2. Quiz Active State
  const q = quiz.questions[currentIdx]
  const isLastQuestion = currentIdx === quiz.questions.length - 1
  const answeredCount = Object.keys(answers).length

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Quiz Header & Progress */}
      <div className="flex items-center justify-between bg-surface-900 p-4 rounded-xl border border-surface-800">
         <div>
            <div className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-1">Question {currentIdx + 1} of {quiz.questions.length}</div>
            <div className="font-bold text-white">{quiz.title}</div>
         </div>
         {timeLeft !== null && (
           <div className={`font-mono text-lg font-bold flex items-center gap-2 ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-primary-400'}`}>
              <Clock className="w-5 h-5" /> {formatTime(timeLeft)}
           </div>
         )}
      </div>

      {/* Progress Track */}
      <div className="flex gap-1 mb-8">
         {quiz.questions.map((_, i) => (
           <div 
             key={i} 
             onClick={() => setCurrentIdx(i)}
             className={`h-2 flex-1 rounded-full cursor-pointer transition-all ${
               i === currentIdx ? 'bg-primary-500 ring-2 ring-primary-500/20 ring-offset-2 ring-offset-surface-950' : 
               answers[quiz.questions[i].id] ? 'bg-primary-500/50' : 'bg-surface-800 hover:bg-surface-700'
             }`}
           />
         ))}
      </div>

      {/* Active Question Card */}
      <Card className="p-6 md:p-8 bg-surface-900 border-surface-800 min-h-[400px] flex flex-col">
         <h3 className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">{q.prompt}</h3>
         
         <div className="space-y-3 mb-8 flex-1">
            {q.options.map(opt => {
              const isSelected = answers[q.id] === opt.id
              return (
                <div 
                  key={opt.id}
                  onClick={() => handleSelect(q.id, opt.id)}
                  className={`
                    p-4 md:p-5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4
                    ${isSelected 
                      ? 'bg-primary-500/10 border-primary-500' 
                      : 'bg-surface-950 border-surface-800 hover:border-surface-600'
                    }
                  `}
                >
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-primary-500' : 'border-surface-600'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />}
                   </div>
                   <span className={`text-base md:text-lg ${isSelected ? 'text-white font-medium' : 'text-surface-300'}`}>{opt.text}</span>
                </div>
              )
            })}
         </div>

         <div className="flex items-center justify-between pt-6 border-t border-surface-800">
            <Button 
               variant="outline" 
               disabled={currentIdx === 0} 
               onClick={() => setCurrentIdx(prev => prev - 1)}
            >
               <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            
            {!isLastQuestion ? (
              <Button onClick={() => setCurrentIdx(prev => prev + 1)}>
                 Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                className={answeredCount === quiz.questions.length ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
              >
                 <CheckCircle2 className="w-4 h-4 mr-2" /> Submit Quiz
              </Button>
            )}
         </div>
      </Card>

    </div>
  )
}
