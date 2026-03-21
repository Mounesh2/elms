import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import QuizCard from './QuizCard';
import CourseCard from './CourseCard';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date | string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, timestamp }) => {
  const isBot = role === 'assistant';

  // Helper to parse JSON from markdown code blocks or raw text
  const parseSpecialContent = (text: string) => {
    try {
      // Look for JSON-like structures
      if (text.includes('"question"') && text.includes('"options"')) {
        const match = text.match(/\[\s*\{[\s\S]*\}\s*\]/) || text.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          return { type: 'quiz', data: Array.isArray(parsed) ? parsed : [parsed] };
        }
      }
      if (text.includes('"course_id"') || (text.includes('"slug"') && text.includes('"thumbnailUrl"'))) {
        const match = text.match(/\[\s*\{[\s\S]*\}\s*\]/) || text.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          return { type: 'course', data: Array.isArray(parsed) ? parsed : [parsed] };
        }
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const special = isBot ? parseSpecialContent(content) : null;
  
  return (
    <div className={cn("flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-200", isBot ? "justify-start" : "justify-end")}>
      <div className={cn("flex max-w-[80%] items-start space-x-2", !isBot && "flex-row-reverse space-x-reverse")}>
        {isBot && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
            <Bot size={18} />
          </div>
        )}
        
        <div className="flex flex-col min-w-0">
          <div className={cn(
            "px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed",
            isBot 
              ? "bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm"
              : "bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl rounded-tr-none shadow-lg shadow-purple-500/20"
          )}>
            <div className="prose prose-sm max-w-none prose-p:my-0 prose-pre:bg-[#1E1B4B] prose-pre:text-white prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1 prose-code:rounded">
              <ReactMarkdown 
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    if (!inline && match && match[1] === 'json') {
                      // Attempt to parse json for special cards
                      const jsonStr = String(children).replace(/\n$/, '');
                      const specialInCode = parseSpecialContent(jsonStr);
                      if (specialInCode?.type === 'quiz') return <QuizCard questions={specialInCode.data} />;
                      if (specialInCode?.type === 'course') return (
                        <div className="grid grid-cols-1 gap-4 py-2">
                          {specialInCode.data.map((c: any, i: number) => <CourseCard key={i} {...c} />)}
                        </div>
                      );
                    }
                    return <code className={className} {...props}>{children}</code>;
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            </div>

            {/* If JSON is not in a code block but raw in text */}
            {special?.type === 'quiz' && !content.includes('```') && (
              <div className="mt-3">
                <QuizCard questions={special.data} />
              </div>
            )}
            {special?.type === 'course' && !content.includes('```') && (
              <div className="mt-3 grid grid-cols-1 gap-4">
                {special.data.map((c: any, i: number) => <CourseCard key={i} {...c} />)}
              </div>
            )}
          </div>
          
          <span className={cn(
            "text-[10px] mt-1 px-1",
            isBot ? "text-gray-400 self-start" : "text-gray-500 self-end"
          )}>
            {timestamp ? format(new Date(timestamp), 'HH:mm') : format(new Date(), 'HH:mm')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
