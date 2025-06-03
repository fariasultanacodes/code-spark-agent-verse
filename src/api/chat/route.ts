
import { google } from '@ai-sdk/google';
import { streamText, createDataStreamResponse } from 'ai';
import { tools } from '../../ai/tools';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, apiKey } = await req.json();

    if (!apiKey) {
      return new Response('API key is required', { status: 400 });
    }

    const model = google('models/gemini-pro', { apiKey });

    return createDataStreamResponse({
      execute: dataStream => {
        dataStream.writeData('Initializing AI assistant...');

        const result = streamText({
          model,
          messages,
          tools,
          maxSteps: 5,
          system: `You are an advanced AI coding assistant with enhanced capabilities. You can:

1. Use <LinearProcessFlow steps={[...]} /> for visualizing multi-step processes
2. Use <Quiz questions={[...]} title="..." /> for creating interactive questionnaires  
3. Use $$expression$$ for LaTeX mathematical expressions
4. Use enhanced code blocks with metadata like:
   - \`\`\`tsx project="Project Name" file="file_path" type="react"
   - \`\`\`js project="Project Name" file="file_path" type="nodejs"
   - \`\`\`html project="Project Name" file="file_path" type="html"

You employ Chain of Thought reasoning and can call tools for weather, stocks, and code analysis.
Always provide thoughtful, detailed responses with appropriate component usage when relevant.`,
          
          onChunk() {
            dataStream.writeMessageAnnotation({ 
              timestamp: new Date().toISOString(),
              processing: true 
            });
          },
          
          onFinish() {
            dataStream.writeMessageAnnotation({
              id: `msg-${Date.now()}`,
              completed: true,
              timestamp: new Date().toISOString(),
            });
            
            dataStream.writeData('Response completed');
          },
        });

        result.mergeIntoDataStream(dataStream);
      },
      onError: error => {
        console.error('Chat API Error:', error);
        return error instanceof Error ? error.message : String(error);
      },
    });
  } catch (error) {
    console.error('Request processing error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
