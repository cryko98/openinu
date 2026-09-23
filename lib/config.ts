/**
 * The contract address lives in an environment variable, not in the source.
 *
 * Before launch it is simply unset, so it is not in this public repo and not
 * in the client bundle — there is nothing to leak and nothing for a scammer to
 * front-run with a lookalike mint. The whole site reads `IS_LAUNCHED` and
 * shows "Coming soon" wherever the address, its links or its live market data
 * would otherwise appear.
 *
 * To go live: set NEXT_PUBLIC_TOKEN_CONTRACT on Vercel and redeploy. Nothing
 * else needs editing — the address, every explorer link and the stats bar all
 * come back on together.
 */
const CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT?.trim() || null;

export const IS_LAUNCHED = CONTRACT !== null;

/** Shown anywhere the address or one of its links would be. */
export const COMING_SOON = "Coming soon";

export const SITE = {
  name: "OpenINU",
  ticker: "$OPENINU",
  tagline: "The good boy of artificial intelligence.",
  description: CONTRACT
    ? "OpenINU ($OPENINU) — the shiba OpenAI generated, posted to their own Instagram, and left behind. Now an AI on Solana, paired to OpenAI stock on stonkfun.xyz."
    : "OpenINU ($OPENINU) — the shiba OpenAI generated, posted to their own Instagram, and left behind. Launching on Solana, paired to OpenAI stock. Contract address coming soon.",
  contract: CONTRACT,
  chain: "Solana",
  pairedStock: "OpenAI",
  links: {
    stonkfun: CONTRACT
      ? `https://www.stonkfun.xyz/token/${CONTRACT}`
      : null,
    dexscreener: CONTRACT
      ? `https://dexscreener.com/solana/${CONTRACT}`
      : null,
    solscan: CONTRACT ? `https://solscan.io/token/${CONTRACT}` : null,
    twitter: "https://x.com/openinu_",
    instagram: "https://www.instagram.com/p/CjQeCdTL51i/",
  },
  modelLabel: "OpenINU-4o",
  /**
   * Verified against the post itself: OpenAI's own verified Instagram
   * account, 3 October 2022, caption exactly as written below. Keep it
   * accurate — it is a factual claim about a real company, and it is the
   * whole joke. It is not a claim of any affiliation.
   */
  lore: {
    postedBy: "OpenAI's official Instagram",
    postedOn: "3 October 2022",
    caption: "shiba inu portrait, 8k, rendering",
  },
} as const;

/**
 * `presetId` routes the card to a hand-written answer instead of the model —
 * used where the facts have to come out exactly right.
 */
export const SUGGESTIONS: {
  title: string;
  subtitle: string;
  prompt: string;
  presetId?: string;
}[] = [
  {
    title: "OpenAI made this dog",
    subtitle: "and then left him there",
    prompt: "Where did the OpenINU dog actually come from?",
    presetId: "origin",
  },
  {
    title: "What is $OPENINU?",
    subtitle: "the dog that ate the AI bubble",
    prompt: "What is $OPENINU and why should I care?",
  },
  IS_LAUNCHED
    ? {
        title: "How do I buy it?",
        subtitle: "step by step on Solana",
        prompt: "How do I buy $OPENINU step by step?",
      }
    : {
        // Routed to the preset: the answer is a scam warning, and it has to be
        // the exact wording rather than whatever the model improvises.
        title: "When can I buy?",
        subtitle: "and why any CA today is fake",
        prompt: "When can I buy $OPENINU?",
        presetId: "buy",
      },
  {
    title: "Explain the OpenAI pairing",
    subtitle: "stonkfun.xyz mechanics",
    prompt:
      "Explain how $OPENINU is paired to OpenAI stock on stonkfun.xyz.",
  },
];
