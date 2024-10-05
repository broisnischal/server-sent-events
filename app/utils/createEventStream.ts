import { eventStream } from "remix-utils/sse/server";
import { emitter } from "~/services/emitter.server";

export function createEventStream(request: Request, eventName: string) {
  return eventStream(request.signal, (send) => {
    const handle = () => {
      send({
        event: eventName,
        data: String(Date.now()),
      });
    };

    emitter.addListener(eventName, handle);

    return () => {
      emitter.removeListener(eventName, handle);
    };
  });
}
