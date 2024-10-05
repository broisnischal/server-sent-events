import { useLoaderData, useRevalidator } from "@remix-run/react";

import { LoaderFunction } from "@remix-run/node";
import { useResolvedPath } from "@remix-run/react";
import { useEventSource } from "remix-utils/sse/react";
import { useEffect } from "react";

export function useLiveLoader<T>({ eventName }: { eventName: string }) {
  const p = useResolvedPath("");

  let data = useEventSource(p.pathname + "/subscribe", {
    event: eventName,
  });

  const { revalidate } = useRevalidator();

  useEffect(() => {
    if (data) {
      revalidate();
    }
  }, [data]);

  return useLoaderData<T>();
}
