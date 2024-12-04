import { GoogleGenerativeAI } from '@google/generative-ai';
import { StreamingTextResponse } from 'ai';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI('AIzaSyBUJaaVSVsFP7cuwwjR5XvC7V9akrDn5q4');

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || messages.length === 0) {
      return new Response('Invalid input', { status: 400 });
    }

    // Convert messages to the format expected by the Gemini API
    const geminiMessages = messages.map((message: { role: string; content: string }) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    }));

    // Initialize the chat with historical messages (if any)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const chat = model.startChat({
      history: geminiMessages.slice(0, -1),
    });

    // Get the stream response for the latest message
    const result = await chat.sendMessageStream(
      geminiMessages[geminiMessages.length - 1].parts[0].text
    );

    // Create a ReadableStream to handle the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            controller.enqueue(chunk.text()); // Enqueue the text from each chunk
          }
          controller.close();
        } catch (error) {
          console.error('Error while streaming:', error);
          controller.error(error);
        }
      },
    });

    // Return the stream as a response
    return new StreamingTextResponse(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
