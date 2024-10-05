import { useEventSource } from "remix-utils/sse/react";
import { useState, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const aiResponse = useEventSource("/message/sse", {
    event: "ai-message",
  });

  useEffect(() => {
    if (aiResponse) {
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    }
  }, [aiResponse]);

  return (
    <div className="flex flex-col items-start h-screen p-10">
      <h1 className="text-4xl font-bold">Chat</h1>
      <br />
      <p className="flex flex-wrap gap-1">
        {messages.map((message, index) => (
          <span key={index}>{message}</span>
        ))}
      </p>
    </div>
  );
}
