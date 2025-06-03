
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
}

interface LinearProcessFlowProps {
  steps: ProcessStep[];
}

const LinearProcessFlow = ({ steps }: LinearProcessFlowProps) => {
  return (
    <div className="space-y-4 p-4 bg-gray-700 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Process Flow</h3>
      <div className="flex items-center space-x-2 overflow-x-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`flex-shrink-0 p-3 rounded-lg border-2 ${
              step.status === 'completed' 
                ? 'bg-green-600 border-green-500 text-white' 
                : step.status === 'active'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-gray-600 border-gray-500 text-gray-300'
            }`}>
              <div className="font-medium text-sm">{step.title}</div>
              <div className="text-xs mt-1">{step.description}</div>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LinearProcessFlow;
