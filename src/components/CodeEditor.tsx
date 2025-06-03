
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from './ui/sidebar';
import FileExplorer from './FileExplorer';
import FileTabs from './FileTabs';
import EnhancedAIChat from './EnhancedAIChat';
import GeminiChat from './GeminiChat';
import LandingPage from './LandingPage';
import { Code, Bot, Home, Palette } from 'lucide-react';

const CodeEditor = () => {
  const [activeTab, setActiveTab] = useState('landing');
  const [files, setFiles] = useState([
    { id: '1', name: 'index.tsx', content: '// Welcome to the AI Code Editor\nconsole.log("Hello World!");', language: 'typescript' },
    { id: '2', name: 'App.tsx', content: 'import React from "react";\n\nfunction App() {\n  return <div>Hello React!</div>;\n}', language: 'typescript' },
  ]);
  const [activeFile, setActiveFile] = useState(files[0]);
  const [openFiles, setOpenFiles] = useState([files[0]]);

  const handleCodeUpdate = (code: string) => {
    console.log('Code updated:', code);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-900 text-white">
        <Sidebar>
          <SidebarContent>
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-6">
                <Code className="w-6 h-6 text-purple-400" />
                <span className="font-bold text-lg">AI Dev Studio</span>
                <Badge className="bg-purple-600/20 text-purple-300 text-xs">Beta</Badge>
              </div>
              <FileExplorer 
                files={files}
                setFiles={setFiles}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
                openFiles={openFiles}
                setOpenFiles={setOpenFiles}
              />
            </div>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="border-b border-gray-700 p-4 flex items-center justify-between bg-gray-800/50">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold">AI-Powered Development Platform</h1>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="border-green-500/50 text-green-400">
                  Live Preview
                </Badge>
              </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border-b border-gray-700">
                <TabsTrigger value="landing" className="flex items-center space-x-2">
                  <Home className="w-4 h-4" />
                  <span>Landing</span>
                </TabsTrigger>
                <TabsTrigger value="editor" className="flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>Editor</span>
                </TabsTrigger>
                <TabsTrigger value="ai-chat" className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <span>AI Assistant</span>
                </TabsTrigger>
                <TabsTrigger value="gemini" className="flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>Gemini</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="landing" className="flex-1 overflow-auto">
                <LandingPage />
              </TabsContent>

              <TabsContent value="editor" className="flex-1 flex flex-col">
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                  {/* Code Editor Panel */}
                  <Card className="bg-gray-800/50 border-gray-700 flex flex-col">
                    <div className="border-b border-gray-700 p-3">
                      <FileTabs 
                        openFiles={openFiles}
                        activeFile={activeFile}
                        setActiveFile={setActiveFile}
                        setOpenFiles={setOpenFiles}
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="w-full h-full bg-gray-900 rounded border border-gray-600 p-4 font-mono text-sm">
                        <pre className="text-green-400 whitespace-pre-wrap">
                          {activeFile?.content || '// Select a file to edit'}
                        </pre>
                      </div>
                    </div>
                  </Card>

                  {/* Preview Panel */}
                  <Card className="bg-gray-800/50 border-gray-700 flex flex-col">
                    <div className="border-b border-gray-700 p-3">
                      <h3 className="font-semibold flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Live Preview</span>
                      </h3>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="w-full h-full bg-white rounded border border-gray-600 flex items-center justify-center">
                        <div className="text-gray-600 text-center">
                          <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Preview will appear here</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="ai-chat" className="flex-1">
                <EnhancedAIChat code={activeFile?.content || ''} onCodeUpdate={handleCodeUpdate} />
              </TabsContent>

              <TabsContent value="gemini" className="flex-1">
                <GeminiChat />
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CodeEditor;
