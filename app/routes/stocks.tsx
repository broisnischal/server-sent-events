import type { MetaFunction } from "@remix-run/node";
import { useEventStream } from "@remix-sse/client";

export type Holding = {
  stock: string;
  latestPrice: number;
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  // Deserialize values as you wish
  // type = number
  const assetValue = useEventStream("/stock/subscribe", {
    channel: "assetValue",
    deserialize: (raw) => Number(raw),
    returnLatestOnly: true,
  });

  // type: Holding[]
  const holdings = useEventStream("/stock/subscribe", {
    channel: "holdingsArray",
    deserialize: (raw) => JSON.parse(raw) as Holding[],
    returnLatestOnly: true,
  });

  return (
    <div
      style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}
      className="p-4"
    >
      <h1 className="text-2xl font-bold">Stocks</h1>
      <br />
      <h2>Asset Value:</h2>
      {assetValue && <div>{assetValue}</div>}
      <br />
      <h2>Holdings</h2>
      {holdings &&
        holdings.map((holding) => (
          <div key={holding.stock}>
            {holding.stock}: {holding.latestPrice}
          </div>
        ))}
    </div>
  );
}
