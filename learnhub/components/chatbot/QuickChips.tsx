import React from 'react';

interface QuickChipsProps {
  chips: string[];
  onChipClick: (chip: string) => void;
}

const QuickChips: React.FC<QuickChipsProps> = ({ chips, onChipClick }) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 px-1 scrollbar-hide no-scrollbar">
      {chips.map((chip, index) => (
        <button
          key={index}
          onClick={() => onChipClick(chip)}
          className="whitespace-nowrap px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100 text-[12px] font-medium transition-all hover:bg-purple-600 hover:text-white hover:scale-105 active:scale-95 shadow-sm"
        >
          {chip}
        </button>
      ))}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default QuickChips;
