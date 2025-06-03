
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Sandpack } from '@codesandbox/sandpack-react';
import GeminiChat from './GeminiChat';
import { Button } from './ui/button';
import { Play, Code, MessageSquare, Settings } from 'lucide-react';

const CodeEditor = () => {
  const [code, setCode] = useState(`import React from 'react';

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center' 
    }}>
      <h1>React Counter App</h1>
      <div style={{ margin: '20px 0' }}>
        <p>Count: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Increment
        </button>
        <button 
          onClick={() => setCount(count - 1)}
          style={{
            padding: '10px 20px',
            margin: '0 10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}

export default App;`);

  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'chat'>('code');
  const [chatVisible, setChatVisible] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Code className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl font-bold text-white">AI Code Studio</h1>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant={activeTab === 'code' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('code')}
              className="text-gray-300 hover:text-white"
            >
              <Code className="w-4 h-4 mr-2" />
              Code
            </Button>
            <Button
              variant={activeTab === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('preview')}
              className="text-gray-300 hover:text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={chatVisible ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChatVisible(!chatVisible)}
            className="text-gray-300 hover:text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            AI Assistant
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Code/Preview Area */}
        <div className={`${chatVisible ? 'w-2/3' : 'w-full'} transition-all duration-300`}>
          {activeTab === 'code' && (
            <div className="h-full">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: 'on',
                }}
              />
            </div>
          )}
          
          {activeTab === 'preview' && (
            <div className="h-full bg-white">
              <Sandpack
                template="react"
                files={{
                  '/App.js': code,
                }}
                options={{
                  showNavigator: false,
                  showTabs: false,
                  showLineNumbers: true,
                  editorHeight: '100%',
                  layout: 'preview',
                }}
                theme="dark"
              />
            </div>
          )}
        </div>

        {/* AI Chat Panel */}
        {chatVisible && (
          <div className="w-1/3 border-l border-gray-700 bg-gray-800">
            <GeminiChat code={code} onCodeUpdate={setCode} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
