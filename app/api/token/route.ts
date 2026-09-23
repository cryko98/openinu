import { SITE } from "@/lib/config";

export const runtime = "nodejs";
export const revalidate = 0;

const RPC = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

type Pair = {
  priceUsd?: string;
  priceChange?: { h24?: number };
  liquidity?: { usd?: number };
  volume?: { h24?: number };
  fdv?: number;
  marketCap?: number;
  url?: string;
  dexId?: string;
  pairAddress?: string;
};

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    p,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]).catch(() => null);
}

async function fetchPair(contract: string): Promise<Pair | null> {
  const res = await withTimeout(
    fetch(`https://api.dexscreener.com/latest/dex/tokens/${contract}`, {
      cache: "no-store",
    }),
    6000
  );
  if (!res || !res.ok) return null;
  const json = (await res.json()) as { pairs?: Pair[] };
  const pairs = json?.pairs ?? [];
  if (!pairs.length) return null;
  return pairs.reduce((best, p) =>
    (p.liquidity?.usd ?? 0) > (best.liquidity?.usd ?? 0) ? p : best
  );
}

async function fetchSupply(contract: string): Promise<number | null> {
  const res = await withTimeout(
    fetch(RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenSupply",
        params: [contract],
      }),
    }),
    6000
  );
  if (!res || !res.ok) return null;
  const json = (await res.json()) as {
    result?: { value?: { uiAmount?: number } };
  };
  const amount = json?.result?.value?.uiAmount;
  return typeof amount === "number" ? amount : null;
}

export async function GET() {
  const contract = SITE.contract;

  // Pre-launch: nothing is deployed, so there is nothing to look up. Answer
  // without touching DexScreener or the RPC — and without naming an address.
  if (contract === null) {
    return Response.json(
      { launched: false, contract: null },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
    );
  }

  const [pair, supply] = await Promise.all([
    fetchPair(contract).catch(() => null),
    fetchSupply(contract).catch(() => null),
  ]);

  return Response.json(
    {
      launched: true,
      contract,
      priceUsd: pair?.priceUsd ? Number(pair.priceUsd) : null,
      change24h: pair?.priceChange?.h24 ?? null,
      liquidityUsd: pair?.liquidity?.usd ?? null,
      volume24h: pair?.volume?.h24 ?? null,
      marketCap: pair?.marketCap ?? pair?.fdv ?? null,
      supply,
      chartUrl: pair?.url ?? SITE.links.dexscreener,
      updatedAt: Date.now(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    }
  );
}
