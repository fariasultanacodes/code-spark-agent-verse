import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import LinearProcessFlow from './chat/LinearProcessFlow';
import Quiz from './chat/Quiz';
import MathRenderer from './chat/MathRenderer';
import CodeBlock from './chat/CodeBlock';
import ThinkingBlock from './chat/ThinkingBlock';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  thinking?: string;
  components?: Array<{
    type: 'LinearProcessFlow' | 'Quiz' | 'Math' | 'CodeBlock' | 'Thinking';
    props: any;
  }>;
}

interface GeminiChatProps {
  code: string;
  onCodeUpdate: (code: string) => void;
}

const GeminiChat = ({ code, onCodeUpdate }: GeminiChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your advanced AI coding assistant powered by Google Gemini. I can help you with code, create interactive components like quizzes and process flows, render mathematical expressions, and provide enhanced code blocks with metadata. What would you like to work on?',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const parseMessageComponents = (content: string) => {
    const components: Array<{
      type: 'LinearProcessFlow' | 'Quiz' | 'Math' | 'CodeBlock' | 'Thinking';
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

    // Parse enhanced code blocks
    const codeBlockRegex = /```(\w+)(?:\s+project="([^"]*)")?(?:\s+file="([^"]*)")?(?:\s+type="([^"]*)")?(?:\s+title="([^"]*)")?\n([\s\S]*?)```/g;
    while ((match = codeBlockRegex.exec(content)) !== null) {
      components.push({
        type: 'CodeBlock',
        props: {
          language: match[1],
          project: match[2],
          file: match[3],
          type: match[4],
          title: match[5],
          code: match[6].trim()
        }
      });
    }

    return components;
  };

  const renderMessageContent = (message: Message) => {
    let content = message.content;
    const components = message.components || parseMessageComponents(content);

    // Remove component syntax from content
    content = content
      .replace(/<LinearProcessFlow\s+steps=\{.*?\}\s*\/>/gs, '')
      .replace(/<Quiz\s+questions=\{.*?\}(?:\s+title="[^"]*")?\s*\/>/gs, '')
      .replace(/\$\$(.*?)\$\$/gs, '')
      .replace(/```(\w+)(?:\s+project="[^"]*")?(?:\s+file="[^"]*")?(?:\s+type="[^"]*")?(?:\s+title="[^"]*")?\n[\s\S]*?```/g, '');

    return (
      <div>
        {message.thinking && (
          <ThinkingBlock content={message.thinking} />
        )}
        
        {content.trim() && (
          <p className="text-sm whitespace-pre-wrap mb-3">{content.trim()}</p>
        )}
        
        {components.map((component, index) => {
          switch (component.type) {
            case 'LinearProcessFlow':
              return <LinearProcessFlow key={index} {...component.props} />;
            case 'Quiz':
              return <Quiz key={index} {...component.props} />;
            case 'Math':
              return <MathRenderer key={index} {...component.props} />;
            case 'CodeBlock':
              return <CodeBlock key={index} {...component.props} />;
            case 'Thinking':
              return <ThinkingBlock key={index} {...component.props} />;
            default:
              return null;
          }
        })}
      </div>
    );
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !apiKey.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-pro',
        systemInstruction: `You are an advanced AI coding assistant with enhanced capabilities. You can use special components and formatting:

1. LinearProcessFlow: Use <LinearProcessFlow steps={[{"id":"1","title":"Step 1","description":"Description","status":"completed"}]} /> for multi-step processes
2. Quiz: Use <Quiz questions={[{"id":"1","question":"What is React?","options":["Library","Framework","Language"],"correctAnswer":0}]} title="React Quiz" /> for interactive quizzes
3. Math: Use $$expression$$ for LaTeX mathematical expressions
4. Enhanced Code Blocks: Use \`\`\`tsx project="Project Name" file="file_path" type="react" for code with metadata

Always provide thoughtful, detailed responses with appropriate component usage when relevant.`
      });

      const prompt = `Context: User is working with this code:

\`\`\`javascript
${code}
\`\`\`

User question: ${input}

Provide a helpful response with appropriate components when relevant. Use LinearProcessFlow for processes, Quiz for learning, Math for equations, and enhanced code blocks for code examples.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: text,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling Gemini:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error while processing your request. Please check your API key and try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (showApiKeyInput) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
        <div className="text-center space-y-2">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto" />
          <h3 className="text-lg font-semibold text-white">API Key Required</h3>
          <p className="text-gray-400 text-sm">
            Enter your Google Gemini API key to start using the AI assistant
          </p>
        </div>
        <div className="w-full space-y-3">
          <Input
            type="password"
            placeholder="Enter your Gemini API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
          />
          <Button
            onClick={() => setShowApiKeyInput(false)}
            disabled={!apiKey.trim()}
            className="w-full"
          >
            Start Coding with AI
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
        <p className="text-xs text-gray-400 mt-1">Powered by Google Gemini with advanced components</p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-purple-600'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`flex-1 ${
                message.sender === 'user' ? 'text-right' : ''
              }`}>
                <div className={`inline-block rounded-lg max-w-[85%] ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white p-3'
                    : 'bg-gray-700 text-gray-100'
                }`}>
                  {message.sender === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="p-3">
                      {renderMessageContent(message)}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
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
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <Input
            placeholder="Ask me about your code, request components, or get help..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;
