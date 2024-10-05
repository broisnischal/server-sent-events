import type { LoaderFunctionArgs } from "@remix-run/node";
import type { Message } from "@prisma/client";

import { eventStream } from "remix-utils/sse/server";
import { emitter } from "~/services/emitter.server";
import { createEventStream } from "~/utils/createEventStream";

export async function loader({ request }: LoaderFunctionArgs) {
  // return eventStream(request.signal, function setup(send) {
  //   function handle(message: Message) {
  //     send({ event: "new-message", data: message.id });
  //   }

  //   emitter.addListener("message", handle);

  //   return () => {
  //     emitter.removeListener("message", handle);
  //   };
  // });
  return createEventStream(request, "chat");
}
