'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Send, Paperclip, BookOpen, Bot, RefreshCw } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ChatMessage from './ChatMessage';
import QuickChips from './QuickChips';
import TypingIndicator from './TypingIndicator';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

interface ChatWindowProps {
  onClose: () => void;
  onMinimize: () => void;
}

const DEFAULT_CHIPS = ['Quiz me', 'Explain this', 'Give example', 'Summarize', 'Translate'];
const CONTEXT_CHIPS = ['What did I just learn?', 'Next topic?', 'Related courses'];

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, onMinimize }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [courseContext, setCourseContext] = useState<{ courseSlug?: string; lectureId?: string; courseName?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session and context
  useEffect(() => {
    let storedSessionId = sessionStorage.getItem('chatbot_session_id');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      sessionStorage.setItem('chatbot_session_id', storedSessionId);
    }
    setSessionId(storedSessionId);

    // Detect context from URL
    const learnMatch = pathname.match(/\/learn\/([^/]+)\/([^/]+)/);
    const courseMatch = pathname.match(/\/courses\/([^/]+)/);

    if (learnMatch) {
      setCourseContext({ courseSlug: learnMatch[1], lectureId: learnMatch[2] });
    } else if (courseMatch) {
      setCourseContext({ courseSlug: courseMatch[1] });
    } else {
      setCourseContext({});
    }

    // Load history
    fetchHistory(storedSessionId);
  }, [pathname]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchHistory = async (sid: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/chatbot/history?sessionId=${sid}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: Message = { id: uuidv4(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);
    setError(null);

    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId,
          courseId: courseContext.courseSlug, // API will handle slug-to-ID if needed, or we adapt
          lectureId: courseContext.lectureId,
          history: messages.slice(-5),
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const data = await response.json();
          setError(data.error);
        } else {
          throw new Error('Failed to get response');
        }
        setIsStreaming(false);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader found');

      const decoder = new TextEncoder();
      let assistantMsg: Message = { id: uuidv4(), role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') break;
            try {
              const { text: chunkText } = JSON.parse(dataStr);
              assistantMsg.content += chunkText;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { ...assistantMsg };
                return newMessages;
              });
            } catch (e) {
              // Ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsStreaming(false);
    }
  };

  const startNewChat = () => {
    const newSid = uuidv4();
    sessionStorage.setItem('chatbot_session_id', newSid);
    setSessionId(newSid);
    setMessages([]);
    setError(null);
  };

  const currentChips = courseContext.courseSlug ? [...DEFAULT_CHIPS, ...CONTEXT_CHIPS] : DEFAULT_CHIPS;

  return (
    <div className="flex flex-col h-full bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 duration-300">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#7C3AED] text-white shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#7C3AED] shadow-sm">
            <Bot size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight">LearnHub AI</span>
            <span className="text-[11px] opacity-80">Online — ask me anything</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={startNewChat} className="p-1.5 hover:bg-white/10 rounded-full transition-colors" title="Start New Chat">
            <RefreshCw size={16} />
          </button>
          <button onClick={onMinimize} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <Minus size={18} />
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* CONTEXT BAR */}
      {courseContext.courseSlug && (
        <div className="px-4 py-1.5 bg-[#EDE9FE] text-[#534AB7] text-[11px] font-medium flex items-center shrink-0 border-b border-purple-100">
          <BookOpen size={12} className="mr-2" />
          <span className="truncate">Helping with: {courseContext.courseSlug} {courseContext.lectureId ? `— ${courseContext.lectureId}` : ''}</span>
        </div>
      )}

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFAFA] scrollbar-thin scrollbar-thumb-gray-200">
        {isLoading ? (
          <div className="flex flex-col space-y-4 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg w-2/3"></div>
            <div className="h-10 bg-gray-100 rounded-lg w-1/2 self-end"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-3/4"></div>
          </div>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2 opacity-60">
                <Bot size={48} className="text-purple-600 mb-2" />
                <p className="text-sm font-semibold text-gray-800">Hi {session?.user?.name || 'there'}!</p>
                <p className="text-xs text-gray-500">I'm your LearnHub assistant. Ask me anything about your courses or hit "Quiz me" to test your knowledge.</p>
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
            ))}
            {isStreaming && messages[messages.length - 1]?.role === 'user' && (
              <TypingIndicator />
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100 flex items-center justify-between">
          <span className="text-[11px] text-red-600 font-medium">{error}</span>
          <button onClick={startNewChat} className="text-[11px] text-red-600 underline">Start new</button>
        </div>
      )}

      {/* FOOTER */}
      <div className="p-3 bg-white border-t border-gray-100 space-y-3 shrink-0">
        <QuickChips chips={currentChips} onChipClick={handleSend} />
        
        <div className="relative flex items-end space-x-2">
          <button disabled className="p-2 text-gray-400 hover:text-gray-600 cursor-not-allowed">
            <Paperclip size={20} />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="Ask anything about this course..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 pr-10 text-[13px] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none max-h-32 min-h-[42px]"
              rows={1}
              maxLength={500}
            />
            {input.length > 400 && (
              <span className="absolute right-3 bottom-1.5 text-[10px] text-gray-400">
                {input.length}/500
              </span>
            )}
          </div>

          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isStreaming}
            className={cn(
              "p-2.5 rounded-full shadow-md transition-all active:scale-90",
              input.trim() && !isStreaming 
                ? "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
            )}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Utility to merge classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default ChatWindow;
