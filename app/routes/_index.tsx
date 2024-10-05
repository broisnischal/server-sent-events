import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEventSource } from "remix-utils/sse/react";

export async function loader() {
  return json({ time: new Date().toISOString() });
}

export default function Time() {
  let loaderData = useLoaderData<typeof loader>();
  let time = useEventSource("/sse/time", { event: "time" }) ?? loaderData.time;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <time dateTime={time} className="text-4xl font-bold">
        {new Date(time).toLocaleTimeString("en", {
          minute: "2-digit",
          second: "2-digit",
          hour: "2-digit",
        })}
      </time>
    </div>
  );
}
