
import React, { useState } from 'react';
import { Copy, Play, Download } from 'lucide-react';
import { Button } from '../ui/button';

interface CodeBlockProps {
  code: string;
  language: string;
  project?: string;
  file?: string;
  type?: 'react' | 'nodejs' | 'html' | 'markdown' | 'diagram' | 'code';
  title?: string;
}

const CodeBlock = ({ code, language, project, file, type, title }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'react':
        return '⚛️';
      case 'nodejs':
        return '🟢';
      case 'html':
        return '🌐';
      case 'markdown':
        return '📝';
      case 'diagram':
        return '📊';
      default:
        return '💻';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden my-3">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-700 border-b border-gray-600">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getTypeIcon()}</span>
          <span className="text-sm text-gray-300">
            {title || `${language}${project ? ` - ${project}` : ''}${file ? ` (${file})` : ''}`}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {type === 'react' && (
            <Button size="sm" variant="ghost" className="h-6 px-2">
              <Play className="w-3 h-3" />
            </Button>
          )}
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={copyToClipboard}
            className="h-6 px-2"
          >
            <Copy className="w-3 h-3" />
            <span className="ml-1 text-xs">{copied ? 'Copied!' : 'Copy'}</span>
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm text-gray-300">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>

      {/* Footer with metadata */}
      {(project || file || type) && (
        <div className="px-4 py-2 bg-gray-750 border-t border-gray-600 text-xs text-gray-400">
          {project && <span>Project: {project}</span>}
          {file && <span className="ml-3">File: {file}</span>}
          {type && <span className="ml-3">Type: {type}</span>}
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
