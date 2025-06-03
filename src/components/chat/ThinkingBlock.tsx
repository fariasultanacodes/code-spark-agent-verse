
import React, { useState, useEffect } from 'react';
import { Brain, ChevronDown, ChevronUp } from 'lucide-react';

interface ThinkingBlockProps {
  content: string;
  isGenerating?: boolean;
}

const ThinkingBlock = ({ content, isGenerating = false }: ThinkingBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    if (isGenerating && content) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < content.length) {
          setDisplayedContent(content.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 20);
      return () => clearInterval(interval);
    } else {
      setDisplayedContent(content);
    }
  }, [content, isGenerating]);

  return (
    <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg my-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-purple-900/20"
      >
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">
            {isGenerating ? 'Thinking...' : 'Chain of Thought'}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-purple-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-purple-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-3 pb-3">
          <div className="text-sm text-purple-200 whitespace-pre-wrap font-mono">
            {displayedContent}
            {isGenerating && <span className="animate-pulse">|</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThinkingBlock;
