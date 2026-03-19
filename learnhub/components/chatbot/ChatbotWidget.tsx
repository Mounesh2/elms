'use client';

import React, { useState, useEffect } from 'react';
import { Bot, X, MessageSquare } from 'lucide-react';
import ChatWindow from './ChatWindow';
import { useSession } from 'next-auth/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ChatbotWidget = () => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPulse, setShowPulse] = useState(true);

  // Stop pulse after 3 cycles (approx 6s)
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (status === 'unauthenticated' || !session) {
    return null; // Don't show for logged out users or show a "Login" message if desired
  }

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setUnreadCount(0);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans antialiased">
      {/* CHAT WINDOW */}
      {isOpen && (
        <div 
          className={cn(
            "fixed bottom-[90px] right-6 z-[9998] transition-all duration-300 ease-out transform origin-bottom-right",
            "w-[360px] h-[520px] max-sm:w-[100vw] max-sm:h-[85vh] max-sm:bottom-0 max-sm:right-0 max-sm:rounded-t-2xl max-sm:rounded-b-none shadow-2xl overflow-hidden",
            isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95 pointer-events-none"
          )}
        >
          <ChatWindow 
            onClose={() => setIsOpen(false)} 
            onMinimize={() => setIsOpen(false)} 
          />
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        className={cn(
          "relative w-14 h-14 rounded-full bg-[#7C3AED] shadow-lg text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 z-[9999]",
          showPulse && !isOpen && "pulse-animation"
        )}
      >
        {isOpen ? (
          <X size={28} className="animate-in fade-in zoom-in duration-200" />
        ) : (
          <Bot size={28} className="animate-in fade-in zoom-in duration-200" />
        )}

        {/* UNREAD BADGE */}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      <style jsx global>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(124, 58, 237, 0); }
          100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
        }
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        /* Smooth animations for messages area */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ChatbotWidget;
