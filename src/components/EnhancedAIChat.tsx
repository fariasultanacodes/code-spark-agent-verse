
import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, AlertCircle, Loader2 } from 'lucide-react';
import LinearProcessFlow from './chat/LinearProcessFlow';
import Quiz from './chat/Quiz';
import MathRenderer from './chat/MathRenderer';
import CodeBlock from './chat/CodeBlock';
import ThinkingBlock from './chat/ThinkingBlock';
import WeatherWidget from './ai/WeatherWidget';
import StockWidget from './ai/StockWidget';
import CodeAnalysisWidget from './ai/CodeAnalysisWidget';

interface EnhancedAIChatProps {
  code: string;
  onCodeUpdate: (code: string) => void;
}

const EnhancedAIChat = ({ code, onCodeUpdate }: EnhancedAIChatProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    data,
    stop,
  } = useChat({
    api: '/api/chat',
    body: { apiKey },
    onError: (error) => {
      console.error('Chat error:', error);
    },
    onFinish: (message) => {
      console.log('Message completed:', message);
    },
  });

  const parseMessageComponents = (content: string) => {
    const components: Array<{
      type: string;
      props: any;
    }> = [];

    // Parse LinearProcessFlow components
    const processFlowRegex = /<LinearProcessFlow\s+steps=\{(\[.*?\])\}\s*\/>/gs;
    let match;
    while ((match = processFlowRegex.exec(content)) !== null) {
      try {
        const steps = JSON.parse(match[1]);
        components.push({
          type: 'LinearProcessFlow',
          props: { steps }
        });
      } catch (e) {
        console.error('Error parsing LinearProcessFlow:', e);
      }
    }

    // Parse Quiz components  
    const quizRegex = /<Quiz\s+questions=\{(\[.*?\])\}(?:\s+title="([^"]*)")?\s*\/>/gs;
    while ((match = quizRegex.exec(content)) !== null) {
      try {
        const questions = JSON.parse(match[1]);
        const title = match[2] || 'Quiz';
        components.push({
          type: 'Quiz',
          props: { questions, title }
        });
      } catch (e) {
        console.error('Error parsing Quiz:', e);
      }
    }

    // Parse Math components
    const mathRegex = /\$\$(.*?)\$\$/gs;
    while ((match = mathRegex.exec(content)) !== null) {
      components.push({
        type: 'Math',
        props: { children: match[1], inline: false }
      });
    }

    return components;
  };

  const renderToolInvocation = (toolInvocation: any) => {
    const { toolName, state, result } = toolInvocation;
    
    if (state === 'result') {
      switch (toolName) {
        case 'getWeather':
          return <WeatherWidget {...result} />;
        case 'getStockPrice':
          return <StockWidget {...result} />;
        case 'analyzeCode':
          return <CodeAnalysisWidget {...result} />;
        default:
          return null;
      }
    } else {
      return (
        <div className="flex items-center space-x-2 p-3 bg-gray-700 rounded-lg">
          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          <span className="text-sm text-gray-300">
            {toolName === 'getWeather' && 'Getting weather data...'}
            {toolName === 'getStockPrice' && 'Fetching stock information...'}
            {toolName === 'analyzeCode' && 'Analyzing code...'}
          </span>
        </div>
      );
    }
  };

  const renderMessageContent = (message: any) => {
    let content = message.content;
    const components = parseMessageComponents(content);

    // Remove component syntax from content
    content = content
      .replace(/<LinearProcessFlow\s+steps=\{.*?\}\s*\/>/gs, '')
      .replace(/<Quiz\s+questions=\{.*?\}(?:\s+title="[^"]*")?\s*\/>/gs, '')
      .replace(/\$\$(.*?)\$\$/gs, '');

    return (
      <div className="space-y-3">
        {content.trim() && (
          <p className="text-sm whitespace-pre-wrap text-gray-100">{content.trim()}</p>
        )}
        
        {components.map((component, index) => {
          switch (component.type) {
            case 'LinearProcessFlow':
              return <LinearProcessFlow key={index} {...component.props} />;
            case 'Quiz':
              return <Quiz key={index} {...component.props} />;
            case 'Math':
              return <MathRenderer key={index} {...component.props} />;
            default:
              return null;
          }
        })}

        {message.toolInvocations?.map((toolInvocation: any, index: number) => (
          <div key={index}>
            {renderToolInvocation(toolInvocation)}
          </div>
        ))}
      </div>
    );
  };

  if (showApiKeyInput) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
        <div className="text-center space-y-2">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto" />
          <h3 className="text-lg font-semibold text-white">API Key Required</h3>
          <p className="text-gray-400 text-sm">
            Enter your Google AI API key to start using the enhanced AI assistant
          </p>
        </div>
        <div className="w-full space-y-3">
          <Input
            type="password"
            placeholder="Enter your Google AI API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
          <Button
            onClick={() => setShowApiKeyInput(false)}
            disabled={!apiKey.trim()}
            className="w-full"
          >
            Start Enhanced AI Chat
          </Button>
        </div>
        <p className="text-xs text-gray-500 text-center">
          Get your API key from{' '}
          <a 
            href="https://makersuite.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Google AI Studio
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-400" />
          <h2 className="font-semibold text-white">Enhanced AI Assistant</h2>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Powered by Google AI with advanced tools and components
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {data && data.length > 0 && (
            <div className="bg-purple-900/30 p-3 rounded-lg">
              <p className="text-xs text-purple-300">System Status</p>
              <div className="text-sm text-purple-100">
                {data.map((item, index) => (
                  <div key={index}>{JSON.stringify(item)}</div>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-purple-600'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className={`flex-1 ${
                message.role === 'user' ? 'text-right' : ''
              }`}>
                <div className={`inline-block rounded-lg max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white p-3'
                    : 'bg-gray-700 text-gray-100 p-3'
                }`}>
                  {message.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    renderMessageContent(message)
                  )}
                </div>
                
                {message.annotations && (
                  <div className="text-xs text-gray-500 mt-1">
                    <pre>{JSON.stringify(message.annotations, null, 2)}</pre>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(message.createdAt || Date.now()).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="text-sm text-gray-300">AI is thinking...</span>
                  <Button
                    onClick={stop}
                    size="sm"
                    variant="outline"
                    className="ml-2 h-6 text-xs"
                  >
                    Stop
                  </Button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-600/50 p-3 rounded-lg">
              <p className="text-red-300 text-sm">Error: {error.message}</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <Input
            placeholder="Ask about code, request weather, stocks, or get AI assistance..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedAIChat;
