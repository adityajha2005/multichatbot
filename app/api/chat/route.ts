import { GoogleGenerativeAI } from '@google/generative-ai';
import { StreamingTextResponse } from 'ai';

export async function POST(req: Request) {
  try {
    const genAI = new GoogleGenerativeAI('AIzaSyBUJaaVSVsFP7cuwwjR5XvC7V9akrDn5q4');

    const { messages } = await req.json();
    
    if (!messages || messages.length === 0) {
      return new Response('Invalid input', { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const lastMessage = messages[messages.length - 1].content;

    const result = await model.generateContentStream(lastMessage);

    // Use StreamingTextResponse for compatibility with Vercel AI SDK
    return new StreamingTextResponse(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              controller.enqueue(text);
            }
            controller.close();
          } catch (error) {
            console.error('Streaming error:', error);
            controller.error(error);
          }
        }
      })
    );

  } catch (error) {
    console.error('Request processing error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}