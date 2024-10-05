import { LoaderFunctionArgs } from "@remix-run/node";
import { eventStream } from "remix-utils/sse/server";
// Import your AI worker or transformer.js

export async function loader({ request }: LoaderFunctionArgs) {
  return eventStream(request.signal, function setup(send) {
    // Set up your AI worker or transformer.js here
    // This function simulates a streaming AI response
    async function simulateStreamingAIResponse() {
      const words = [
        "Hello,",
        "I'm",
        "an",
        "AI",
        "assistant.",
        "I'm",
        "here",
        "to",
        "help",
        "you",
        "with",
        "any",
        "questions",
        "or",
        "tasks",
        "you",
        "might",
        "have.",
        "Feel",
        "free",
        "to",
        "ask",
        "me",
        "anything!",
      ];

      for (let i = 0; i < words.length; i++) {
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            if (request.signal.aborted) {
              return;
            }
            send({ event: "ai-message", data: words[i] });
            resolve();
          }, Math.random() * 200 + 100);
        });
      }
    }

    // Call the streaming AI function
    simulateStreamingAIResponse();

    return function cleanup() {
      // Clean up any resources if needed
    };
  });
}
