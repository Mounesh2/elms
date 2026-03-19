'use client';

import React, { useState } from 'react';
import { Check, X, ArrowRight } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

interface QuizCardProps {
  questions: Question[];
}

const QuizCard: React.FC<QuizCardProps> = ({ questions }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionClick = (idx: number) => {
    if (selectedIdx !== null) return;
    
    setSelectedIdx(idx);
    setShowExplanation(true);
    if (idx === questions[currentIdx].correct_index) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedIdx(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="bg-white border-2 border-purple-100 rounded-xl p-4 text-center space-y-3 shadow-sm">
        <div className="text-3xl">🎉</div>
        <h3 className="font-bold text-gray-800">Quiz Complete!</h3>
        <p className="text-sm text-gray-600">You scored <span className="text-purple-600 font-bold">{score}/{questions.length}</span></p>
        <p className="text-xs text-gray-500 italic">
          {score === questions.length ? "Perfect! You're a master!" : "Great effort! Keep learning!"}
        </p>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-purple-50 px-4 py-2 border-b border-purple-100 flex justify-between items-center">
        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Question {currentIdx + 1}/{questions.length}</span>
      </div>
      
      <div className="p-4 space-y-3">
        <p className="text-[13px] font-semibold text-gray-800">{q.question}</p>
        
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isSelected = selectedIdx === i;
            const isCorrect = i === q.correct_index;
            const showCorrect = showExplanation && isCorrect;
            const showWrong = showExplanation && isSelected && !isCorrect;

            return (
              <button
                key={i}
                disabled={selectedIdx !== null}
                onClick={() => handleOptionClick(i)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-xs transition-all border",
                  !showExplanation && "hover:bg-purple-50 hover:border-purple-200 active:scale-[0.98]",
                  showCorrect && "bg-green-50 border-green-200 text-green-700 font-medium",
                  showWrong && "bg-red-50 border-red-200 text-red-700",
                  !showCorrect && !showWrong && (isSelected ? "bg-purple-50 border-purple-300" : "bg-white border-gray-100")
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {showCorrect && <Check size={14} />}
                  {showWrong && <X size={14} />}
                </div>
              </button>
            );
          })}
        </div>
        
        {showExplanation && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
            <p className="text-[11px] text-gray-600 leading-relaxed">
              <span className="font-bold text-gray-700">Explanation:</span> {q.explanation}
            </p>
            <button 
              onClick={handleNext}
              className="mt-2 w-full py-1.5 bg-purple-600 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-purple-700"
            >
              {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} <ArrowRight size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default QuizCard;
