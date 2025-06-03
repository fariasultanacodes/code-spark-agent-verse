
import { z } from 'zod';
import { createTool } from 'ai';

export const weatherTool = createTool({
  description: 'Get weather information for a location',
  parameters: z.object({
    location: z.string().describe('The city and country to get weather for'),
  }),
  execute: async function ({ location }) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate weather data
    const conditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'partly cloudy'];
    const temperature = Math.floor(Math.random() * 30) + 5;
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      location,
      temperature,
      condition,
      humidity: Math.floor(Math.random() * 100),
      windSpeed: Math.floor(Math.random() * 20),
    };
  },
});

export const stockTool = createTool({
  description: 'Get stock price information',
  parameters: z.object({
    symbol: z.string().describe('Stock symbol (e.g., AAPL, GOOGL)'),
  }),
  execute: async function ({ symbol }) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      symbol: symbol.toUpperCase(),
      price: Math.floor(Math.random() * 500) + 50,
      change: (Math.random() - 0.5) * 20,
      volume: Math.floor(Math.random() * 1000000),
    };
  },
});

export const codeAnalysisTool = createTool({
  description: 'Analyze code and provide insights',
  parameters: z.object({
    code: z.string().describe('The code to analyze'),
    language: z.string().describe('Programming language'),
  }),
  execute: async function ({ code, language }) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const lines = code.split('\n').length;
    const complexity = lines > 50 ? 'high' : lines > 20 ? 'medium' : 'low';
    
    return {
      language,
      linesOfCode: lines,
      complexity,
      suggestions: [
        'Consider adding more comments',
        'Break down large functions',
        'Add error handling',
      ],
      performance: Math.floor(Math.random() * 100),
    };
  },
});

export const tools = {
  getWeather: weatherTool,
  getStockPrice: stockTool,
  analyzeCode: codeAnalysisTool,
};
