import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useResolvedPath,
  useRevalidator,
} from "@remix-run/react";
import { useEventStream } from "@remix-sse/client";
import { useEffect, useRef, useState } from "react";
import { useEventSource } from "remix-utils/sse/react";

import { db } from "~/db.server";
import { emitter } from "~/services/emitter.server";
import { useLiveLoader } from "~/utils/useLiveLoader";

export async function loader({ request }: LoaderFunctionArgs) {
  let messages = await db.message.findMany();
  return json({ messages });
}

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();

  let message = formData.get("message") as string;

  try {
    let data = await db.message.create({ data: { content: message } });

    // emitter.emit("message", data.id);
    emitter.emit("chat");

    return json(null, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}

export default function Chat() {
  const { messages } = useLiveLoader<typeof loader>({
    eventName: "chat",
  });

  let actionData = useActionData<typeof action>();
  let { state } = useNavigation();

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      const scrollToBottom = () => {
        divRef.current!.scrollTop = divRef.current!.scrollHeight;
      };

      // Scroll to bottom on initial load
      scrollToBottom();

      // Check if we're near the bottom before scrolling on updates
      const handleUpdate = () => {
        const diff = Math.abs(
          divRef.current!.offsetHeight +
            divRef.current!.scrollTop -
            divRef.current!.scrollHeight
        );

        if (diff <= 100) {
          scrollToBottom();
        }
      };

      // Call handleUpdate on subsequent renders
      if (messages.length > 0) {
        handleUpdate();
      }
    }
  }, [messages]);

  return (
    <div className="p-4">
      <Form
        method="post"
        className="flex items-center gap-2 fixed bg-zinc-950 w-full top-0 p-2 border-b border-white/25"
      >
        <input
          type="text"
          name="message"
          id="message"
          key={state}
          disabled={state === "loading"}
          required
          className="border border-gray-300 rounded-md p-2 min-w-[300px]"
        />
        <button className="bg-white text-black py-2 px-4 rounded-md ">
          Send
        </button>
      </Form>
      <br />
      <br />
      <div ref={divRef} className="h-[calc(100vh-100px)] overflow-y-auto">
        <ul>
          {messages.map((message) => {
            return (
              <li className="text-4xl font-bold" key={message.id}>
                {message.content}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
