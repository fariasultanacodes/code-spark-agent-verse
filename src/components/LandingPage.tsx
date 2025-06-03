
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Code, Zap, Smartphone, Globe, Brain, Rocket } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
            AI-Powered Development Platform
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Build Fullstack Apps
            <br />
            <span className="text-purple-400">In Your Browser</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Revolutionary AI agent for developing modern web applications with real-time streaming, 
            mobile-responsive design, and advanced code sandbox capabilities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Building Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 text-lg px-8 py-3"
            >
              <Code className="w-5 h-5 mr-2" />
              View Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Next-Generation Development Experience
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to build, deploy, and scale modern web applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
            <CardHeader>
              <Brain className="w-10 h-10 text-purple-400 mb-4" />
              <CardTitle className="text-white">Advanced AI Agent</CardTitle>
              <CardDescription className="text-gray-400">
                Intelligent code generation, debugging, and optimization powered by cutting-edge LLMs
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
            <CardHeader>
              <Smartphone className="w-10 h-10 text-blue-400 mb-4" />
              <CardTitle className="text-white">Mobile-First Design</CardTitle>
              <CardDescription className="text-gray-400">
                Responsive components built with Shadcn UI and Tailwind CSS for perfect mobile experience
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50 hover:border-green-500/50 transition-all duration-300">
            <CardHeader>
              <Zap className="w-10 h-10 text-green-400 mb-4" />
              <CardTitle className="text-white">Real-time Streaming</CardTitle>
              <CardDescription className="text-gray-400">
                Live code execution and streaming updates for instant feedback and collaboration
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300">
            <CardHeader>
              <Code className="w-10 h-10 text-yellow-400 mb-4" />
              <CardTitle className="text-white">Code Sandbox</CardTitle>
              <CardDescription className="text-gray-400">
                Integrated development environment with multi-file support and live preview
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50 hover:border-red-500/50 transition-all duration-300">
            <CardHeader>
              <Globe className="w-10 h-10 text-red-400 mb-4" />
              <CardTitle className="text-white">SEO Optimized</CardTitle>
              <CardDescription className="text-gray-400">
                Built-in SEO best practices and performance optimization for maximum visibility
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
            <CardHeader>
              <Rocket className="w-10 h-10 text-purple-400 mb-4" />
              <CardTitle className="text-white">Production Ready</CardTitle>
              <CardDescription className="text-gray-400">
                Deploy instantly with optimized builds and modern DevOps practices
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-2xl p-8 md:p-16 text-center border border-purple-500/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Development Workflow?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of developers building the future with our AI-powered platform.
            Start creating amazing web applications today.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-12 py-4"
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
