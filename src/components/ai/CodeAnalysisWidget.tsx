
import React from 'react';
import { Code2, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface CodeAnalysisWidgetProps {
  language: string;
  linesOfCode: number;
  complexity: string;
  suggestions: string[];
  performance: number;
}

const CodeAnalysisWidget = ({ 
  language, 
  linesOfCode, 
  complexity, 
  suggestions, 
  performance 
}: CodeAnalysisWidgetProps) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <Code2 className="w-6 h-6 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Code Analysis</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-400">Language</p>
          <p className="text-white font-medium">{language}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Lines of Code</p>
          <p className="text-white font-medium">{linesOfCode}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Complexity</p>
          <p className={`font-medium capitalize ${getComplexityColor(complexity)}`}>
            {complexity}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Performance Score</p>
          <p className={`font-medium ${getPerformanceColor(performance)}`}>
            {performance}/100
          </p>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-gray-400 mb-2">Suggestions</p>
        <ul className="space-y-1">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-center space-x-2 text-sm">
              <Info className="w-3 h-3 text-blue-400 flex-shrink-0" />
              <span className="text-gray-300">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CodeAnalysisWidget;
