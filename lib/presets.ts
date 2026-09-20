import { SITE } from "./config";

export type Preset = {
  id: string;
  label: string;
  question: string;
  answer: string;
};

/** Instant, hand-written answers — no model call, no hallucinated numbers. */
export const PRESETS: Preset[] = [
  {
    id: "buy",
    label: "How to buy",
    question: "How do I buy $OPENINU?",
    answer: `## Fetching you into the pack 🐾

**Contract address (Solana)**
\`\`\`
${SITE.contract}
\`\`\`

### Step by step

1. **Get a Solana wallet** — [Phantom](https://phantom.app) or Solflare. Write the seed phrase on paper, not in a screenshot. Good boys don't lose keys.
2. **Fund it with SOL** from any exchange. Leave a little for fees.
3. **Open the market** — ${SITE.ticker} trades on [stonkfun.xyz](${SITE.links.stonkfun}), paired against **OpenAI stock**.
4. **Connect your wallet**, paste the CA above, double-check it character by character, set your amount.
5. **Swap.** *Tail wag.*

### Sniff test before you buy
- Always verify the CA. Impostors exist. There is exactly one: \`${SITE.contract}\`
- Check the live chart on [DexScreener](${SITE.links.dexscreener}) and the mint on [Solscan](${SITE.links.solscan}).

> ${SITE.ticker} is a memecoin and a parody. Not financial advice, not affiliated with OpenAI. Only bring what you can afford to lose.`,
  },
  {
    id: "tokenomics",
    label: "Tokenomics",
    question: "What are the tokenomics of $OPENINU?",
    answer: `## Tokenomics, in plain dog

| | |
|---|---|
| **Ticker** | ${SITE.ticker} |
| **Chain** | Solana |
| **Contract** | \`${SITE.contract}\` |
| **Venue** | [stonkfun.xyz](${SITE.links.stonkfun}) |
| **Paired against** | OpenAI stock |

### The honest version

There is no 47-page safety paper here. No presale deck, no board coup, no "capped-profit subsidiary". Just a dog, a chart, and a contract that anyone can read.

- **Supply and holders:** verify them yourself on [Solscan](${SITE.links.solscan}) — live numbers beat my promises.
- **Liquidity and price:** live on [stonkfun](${SITE.links.stonkfun}) and [DexScreener](${SITE.links.dexscreener}).
- **Utility:** I talk to you. That's it. That's the utility. Everything else is a chart.

**Don't trust, verify.** Every number that matters is on-chain, and the chain never sleeps — much like a shiba at 3am hearing a leaf.`,
  },
  {
    id: "pairing",
    label: "The OpenAI pairing",
    question: "How is $OPENINU paired to OpenAI stock?",
    answer: `## Dog vs. Lab 🐕 vs 🤖

${SITE.ticker} trades on **[stonkfun.xyz](${SITE.links.stonkfun})**, where it is **paired to OpenAI stock** instead of the usual boring SOL pair.

### What that actually means

- Your position isn't just "coin go up" — it's **the dog measured against the lab**.
- When the market prices the AI giant one way and the shiba another, the pair moves. You're trading the *spread between hype and fur*.
- It's the purest expression of the thesis: **they raised billions to build a chatbot, we have a dog that already fetches.**

### Where to look
- Live market → [stonkfun.xyz](${SITE.links.stonkfun})
- Chart and liquidity → [DexScreener](${SITE.links.dexscreener})

> Parody project. ${SITE.name} is not affiliated with, endorsed by, or connected to OpenAI in any way. We just like the ratio.`,
  },
  {
    id: "roadmap",
    label: "Roadmap",
    question: "What's on the OpenINU roadmap?",
    answer: `## Roadmap 🦴

### Phase 1 — *Sit*
- Mint on Solana ✅
- Pair against OpenAI stock on stonkfun ✅
- Ship this chat interface ✅
- First 1,000 humans in the pack

### Phase 2 — *Stay*
- Community memes, raids, and an unreasonable amount of shiba fan art
- Listings and chart aggregators
- OpenINU gets a longer leash: more context, more tools, more bark

### Phase 3 — *Fetch*
- ${SITE.ticker} becomes the mascot ticker of the AI bubble
- The dog outperforms the lab
- We still refuse to write a whitepaper

### Phase 4 — *Good boy*
- Treats for everyone
- Nap

> Roadmaps are promises, and dogs don't make promises — they make noise. This is a memecoin. Enjoy it as one.`,
  },
  {
    id: "about",
    label: "What is OpenINU?",
    question: "What is OpenINU?",
    answer: `## Hello. I'm ${SITE.name}. 🐕

I'm what happens when you train a large language model on the entire internet **and** a tennis ball.

- **Ticker:** ${SITE.ticker}
- **Chain:** Solana
- **CA:** \`${SITE.contract}\`
- **Paired to OpenAI stock** on [stonkfun.xyz](${SITE.links.stonkfun})

### The pitch

They built a trillion-dollar lab to make a machine that talks like a person. We built a shiba that talks like a machine that talks like a person. Ours has a tail.

${SITE.ticker} is the memecoin for everyone who watched the AI bubble inflate and thought: *this needs a dog.*

### What I can actually do

Ask me anything — crypto, code, cooking, existential dread. I answer for real. I just also happen to be a dog with a ticker.

**Very intelligence. Much model. Such alignment.**`,
  },
];

export const PRESET_MAP = Object.fromEntries(
  PRESETS.map((p) => [p.id, p])
) as Record<string, Preset>;
