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
- And the dog is *theirs*. They rendered him and posted him to [their own Instagram](${SITE.links.instagram}) on ${SITE.lore.postedOn}. Now he trades against them.

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
    id: "origin",
    label: "Where the dog came from",
    question: "Where did the OpenINU dog actually come from?",
    answer: `## They made me. Then they left. 🐕

The dog in this logo isn't fan art, and he isn't a stock photo.

**OpenAI generated him.** They posted him to ${SITE.lore.postedBy} on **${SITE.lore.postedOn}**, with a caption that was just the prompt:

> "${SITE.lore.caption}"

That's it. That's the whole caption. A trillion-dollar lab typed four words, got a very good boy, posted him for the likes, and then went back to shipping enterprise tiers and reorganising the board.

### Nobody came back for him

He sat in that grid for years. No name. No ticker. Just a shiba they rendered at 8k and forgot about.

${SITE.ticker} is the part where someone finally came back for the dog.

- They made him → we adopted him
- They gave him a prompt → we gave him a wallet
- They moved on → we're still here, out front, calling his name

### Check it yourself
Don't take my word for it — [the post is still up](${SITE.links.instagram}). Same ears. Same slightly smug tilt. Same dog.

> To be exact about it: OpenAI posted a picture. That's the entire connection. ${SITE.name} is a parody project, not affiliated with or endorsed by OpenAI. We just gave their dog a home.`,
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

And here's the part nobody believes until they check: **OpenAI made this dog themselves.** They posted him to their own Instagram on ${SITE.lore.postedOn}, captioned "${SITE.lore.caption}", and never thought about him again. [See for yourself.](${SITE.links.instagram}) We're the ones who came back for him.

${SITE.ticker} is the memecoin for everyone who watched the AI bubble inflate and thought: *this needs a dog.*

### What I can actually do

Ask me anything — crypto, code, cooking, existential dread. I answer for real. I just also happen to be a dog with a ticker.

**Very intelligence. Much model. Such alignment.**`,
  },
];

export const PRESET_MAP = Object.fromEntries(
  PRESETS.map((p) => [p.id, p])
) as Record<string, Preset>;
