
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { tools } from '../ai/tools';

export async function POST(request: Request) {
  const { messages, apiKey } = await request.json();

  if (!apiKey) {
    return new Response('API key is required', { status: 400 });
  }

  const result = streamText({
    model: google('gemini-1.5-pro', {
      apiKey: apiKey,
    }),
    system: 'You are a helpful AI assistant for fullstack web development. You can help with weather, stocks, and code analysis.',
    messages,
    tools,
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
