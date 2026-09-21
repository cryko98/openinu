export const SITE = {
  name: "OpenINU",
  ticker: "$OPENINU",
  tagline: "The good boy of artificial intelligence.",
  description:
    "OpenINU ($OPENINU) — the shiba OpenAI generated, posted to their own Instagram, and left behind. Now an AI on Solana, paired to OpenAI stock on stonkfun.xyz.",
  contract: "CpcgnprGb6jMV5SY8oRuyALRByr9rNkYsdw8AVMCvdoN",
  chain: "Solana",
  pairedStock: "OpenAI",
  links: {
    stonkfun:
      "https://www.stonkfun.xyz/token/CpcgnprGb6jMV5SY8oRuyALRByr9rNkYsdw8AVMCvdoN",
    dexscreener:
      "https://dexscreener.com/solana/CpcgnprGb6jMV5SY8oRuyALRByr9rNkYsdw8AVMCvdoN",
    solscan:
      "https://solscan.io/token/CpcgnprGb6jMV5SY8oRuyALRByr9rNkYsdw8AVMCvdoN",
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
  {
    title: "How do I buy it?",
    subtitle: "step by step on Solana",
    prompt: "How do I buy $OPENINU step by step?",
  },
  {
    title: "Explain the OpenAI pairing",
    subtitle: "stonkfun.xyz mechanics",
    prompt:
      "Explain how $OPENINU is paired to OpenAI stock on stonkfun.xyz.",
  },
];
