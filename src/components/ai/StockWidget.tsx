
import React from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface StockWidgetProps {
  symbol: string;
  price: number;
  change: number;
  volume: number;
}

const StockWidget = ({ symbol, price, change, volume }: StockWidgetProps) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">{symbol}</h3>
        </div>
        {isPositive ? (
          <TrendingUp className="w-6 h-6 text-green-400" />
        ) : (
          <TrendingDown className="w-6 h-6 text-red-400" />
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-white">${price.toFixed(2)}</span>
          <span className={`text-sm font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? '+' : ''}{change.toFixed(2)}
          </span>
        </div>
        
        <div className="text-sm text-gray-400">
          Volume: {volume.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default StockWidget;
