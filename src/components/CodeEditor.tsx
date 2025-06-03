
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Sandpack } from '@codesandbox/sandpack-react';
import GeminiChat from './GeminiChat';
import FileExplorer from './FileExplorer';
import FileTabs from './FileTabs';
import { Button } from './ui/button';
import { Play, Code, MessageSquare, Settings, Sidebar } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileItem[];
  isOpen?: boolean;
}

const CodeEditor = () => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: 'app-js',
      name: 'App.js',
      type: 'file',
      content: `import React from 'react';

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

export default App;`
    },
    {
      id: 'components-js',
      name: 'Components.js',
      type: 'file',
      content: `import React from 'react';

export const Button = ({ children, onClick, variant = 'primary' }) => {
  const baseStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const variantStyles = {
    primary: { backgroundColor: '#007acc', color: 'white' },
    secondary: { backgroundColor: '#6c757d', color: 'white' },
    danger: { backgroundColor: '#dc3545', color: 'white' }
  };

  return (
    <button 
      style={{ ...baseStyle, ...variantStyles[variant] }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};`
    }
  ]);

  const [openTabs, setOpenTabs] = useState<string[]>(['app-js']);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [activeFileId, setActiveFileId] = useState<string>('app-js');
  const [chatVisible, setChatVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const activeFile = files.find(f => f.id === activeFileId);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFileId) {
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.id === activeFileId 
            ? { ...file, content: value }
            : file
        )
      );
    }
  };

  const handleFileSelect = (fileId: string) => {
    setActiveFileId(fileId);
    if (!openTabs.includes(fileId)) {
      setOpenTabs(prev => [...prev, fileId]);
    }
  };

  const handleTabClose = (tabId: string) => {
    const newTabs = openTabs.filter(id => id !== tabId);
    setOpenTabs(newTabs);
    
    if (tabId === activeFileId && newTabs.length > 0) {
      setActiveFileId(newTabs[newTabs.length - 1]);
    }
  };

  const handleFileCreate = (name: string, type: 'file' | 'folder') => {
    const newFile: FileItem = {
      id: `${name}-${Date.now()}`,
      name,
      type,
      content: type === 'file' ? '' : undefined,
      children: type === 'folder' ? [] : undefined,
      isOpen: type === 'folder' ? false : undefined
    };
    
    setFiles(prev => [...prev, newFile]);
  };

  const handleFileDelete = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setOpenTabs(prev => prev.filter(id => id !== fileId));
    
    if (fileId === activeFileId && openTabs.length > 1) {
      const remainingTabs = openTabs.filter(id => id !== fileId);
      setActiveFileId(remainingTabs[remainingTabs.length - 1]);
    }
  };

  const handleFileRename = (fileId: string, newName: string) => {
    setFiles(prev => 
      prev.map(file => 
        file.id === fileId ? { ...file, name: newName } : file
      )
    );
  };

  const getSandpackFiles = () => {
    const sandpackFiles: Record<string, string> = {};
    files.forEach(file => {
      if (file.type === 'file' && file.content) {
        sandpackFiles[`/${file.name}`] = file.content;
      }
    });
    return sandpackFiles;
  };

  const openTabsData = openTabs.map(tabId => {
    const file = files.find(f => f.id === tabId);
    return file ? { id: file.id, name: file.name } : null;
  }).filter(Boolean) as { id: string; name: string }[];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarVisible(!sidebarVisible)}
              className="text-gray-300 hover:text-white p-1"
            >
              <Sidebar className="w-4 h-4" />
            </Button>
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
        {/* Sidebar */}
        {sidebarVisible && (
          <div className="w-64 border-r border-gray-700">
            <FileExplorer
              files={files}
              activeFileId={activeFileId}
              onFileSelect={handleFileSelect}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
              onFileRename={handleFileRename}
            />
          </div>
        )}

        {/* Code/Preview Area */}
        <div className={`${chatVisible ? 'w-2/3' : 'flex-1'} transition-all duration-300 flex flex-col`}>
          {activeTab === 'code' && (
            <>
              <FileTabs
                tabs={openTabsData}
                activeTabId={activeFileId}
                onTabSelect={setActiveFileId}
                onTabClose={handleTabClose}
              />
              <div className="flex-1">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={activeFile?.content || ''}
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
            </>
          )}
          
          {activeTab === 'preview' && (
            <div className="h-full bg-white">
              <Sandpack
                template="react"
                files={getSandpackFiles()}
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
            <GeminiChat 
              code={activeFile?.content || ''} 
              onCodeUpdate={(newCode) => {
                if (activeFileId) {
                  setFiles(prevFiles => 
                    prevFiles.map(file => 
                      file.id === activeFileId 
                        ? { ...file, content: newCode }
                        : file
                    )
                  );
                }
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
