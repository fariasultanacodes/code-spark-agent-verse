
import React from 'react';

interface MathRendererProps {
  children: string;
  inline?: boolean;
}

const MathRenderer = ({ children, inline = false }: MathRendererProps) => {
  // This is a simple placeholder for LaTeX rendering
  // In a real implementation, you'd use a library like KaTeX or MathJax
  const renderMath = (expression: string) => {
    // Basic LaTeX-like rendering for common expressions
    return expression
      .replace(/\^(\w+)/g, '<sup>$1</sup>')
      .replace(/_(\w+)/g, '<sub>$1</sub>')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="fraction"><span class="numerator">$1</span>/<span class="denominator">$2</span></span>')
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\pi/g, 'π')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\delta/g, 'δ')
      .replace(/\\sum/g, '∑')
      .replace(/\\int/g, '∫');
  };

  const rendered = renderMath(children);

  if (inline) {
    return (
      <span 
        className="inline-block bg-gray-600 px-2 py-1 rounded text-blue-300 font-mono text-sm"
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    );
  }

  return (
    <div className="p-4 bg-gray-700 rounded-lg my-2">
      <div 
        className="text-center text-blue-300 font-mono text-lg"
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    </div>
  );
};

export default MathRenderer;
