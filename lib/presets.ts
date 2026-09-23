import { IS_LAUNCHED, SITE } from "./config";

export type Preset = {
  id: string;
  label: string;
  question: string;
  answer: string;
};

/** Before launch, every buying question becomes a scam warning instead. */
const PRE_LAUNCH_BUY = `## Not yet, friend 🐾

**${SITE.ticker} hasn't launched.** There is no contract address, no market, no chart, and nothing to buy.

### So if you see a CA right now

Someone is trying to take your money. Every single time, no exceptions:

- There is **no presale**, no whitelist, no private allocation, no early round.
- Nobody is DMing the contract address early. Not the team, not a "mod", not a friendly stranger in the replies.
- Any "${SITE.name}" token trading today is **not this one**.

### What actually happens at launch

The address gets posted on [X](${SITE.links.twitter}) and appears on this page at the same moment. That is the only place it comes from. Check it against both before you spend anything.

> Bookmark this page. Check the X account. Believe nothing else.

*He waited three years in an Instagram grid. A few more days won't hurt him.*`;

const LAUNCHED_BUY = `## Fetching you into the pack 🐾

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

> ${SITE.ticker} is a memecoin and a parody. Not financial advice, not affiliated with OpenAI. Only bring what you can afford to lose.`;

/** Instant, hand-written answers — no model call, no hallucinated numbers. */
export const PRESETS: Preset[] = [
  {
    id: "buy",
    label: IS_LAUNCHED ? "How to buy" : "When can I buy?",
    question: IS_LAUNCHED
      ? "How do I buy $OPENINU?"
      : "When can I buy $OPENINU?",
    answer: IS_LAUNCHED ? LAUNCHED_BUY : PRE_LAUNCH_BUY,
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
| **Contract** | ${IS_LAUNCHED ? `\`${SITE.contract}\`` : "**Coming soon**"} |
| **Venue** | ${IS_LAUNCHED ? `[stonkfun.xyz](${SITE.links.stonkfun})` : "stonkfun.xyz — at launch"} |
| **Paired against** | OpenAI stock |

### The honest version

There is no 47-page safety paper here. No presale deck, no board coup, no "capped-profit subsidiary". Just a dog, a chart, and a contract that anyone can read.

${
  IS_LAUNCHED
    ? `- **Supply and holders:** verify them yourself on [Solscan](${SITE.links.solscan}) — live numbers beat my promises.
- **Liquidity and price:** live on [stonkfun](${SITE.links.stonkfun}) and [DexScreener](${SITE.links.dexscreener}).
- **Utility:** I talk to you. That's it. That's the utility. Everything else is a chart.

**Don't trust, verify.** Every number that matters is on-chain, and the chain never sleeps — much like a shiba at 3am hearing a leaf.`
    : `- **Supply, liquidity, holders:** nothing exists on-chain yet, so there is nothing for me to quote and nothing for you to verify. I'd rather say that than invent a number.
- **Utility:** I talk to you. That's it. That's the utility. Everything else will be a chart.

**Don't trust, verify** — and right now there is nothing to verify, which is exactly why you should ignore anyone claiming otherwise.`
}`,
  },
  {
    id: "pairing",
    label: "The OpenAI pairing",
    question: "How is $OPENINU paired to OpenAI stock?",
    answer: `## Dog vs. Lab 🐕 vs 🤖

${
  IS_LAUNCHED
    ? `${SITE.ticker} trades on **[stonkfun.xyz](${SITE.links.stonkfun})**, where it is **paired to OpenAI stock** instead of the usual boring SOL pair.`
    : `At launch, ${SITE.ticker} will trade on **stonkfun.xyz** — **paired to OpenAI stock** instead of the usual boring SOL pair.`
}

### What that actually means

- Your position isn't just "coin go up" — it's **the dog measured against the lab**.
- When the market prices the AI giant one way and the shiba another, the pair moves. You're trading the *spread between hype and fur*.
- It's the purest expression of the thesis: **they raised billions to build a chatbot, we have a dog that already fetches.**
- And the dog is *theirs*. They rendered him and posted him to [their own Instagram](${SITE.links.instagram}) on ${SITE.lore.postedOn}. Now he trades against them.

### Where to look
${
  IS_LAUNCHED
    ? `- Live market → [stonkfun.xyz](${SITE.links.stonkfun})
- Chart and liquidity → [DexScreener](${SITE.links.dexscreener})`
    : `- Nowhere yet — there's no market until launch. The address and the link land on [X](${SITE.links.twitter}) and on this page at the same time.`
}

> Parody project. ${SITE.name} is not affiliated with, endorsed by, or connected to OpenAI in any way. We just like the ratio.`,
  },
  {
    id: "roadmap",
    label: "Roadmap",
    question: "What's on the OpenINU roadmap?",
    answer: `## Roadmap 🦴

### Phase 1 — *Sit*
- Ship this chat interface ✅
- Adopt the dog OpenAI left behind ✅
${
  IS_LAUNCHED
    ? `- Mint on Solana ✅
- Pair against OpenAI stock on stonkfun ✅
- First 1,000 humans in the pack`
    : `- Mint on Solana — **next**
- Pair against OpenAI stock on stonkfun — **next**
- First 1,000 humans in the pack`
}

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
${
  IS_LAUNCHED
    ? `- **CA:** \`${SITE.contract}\`
- **Paired to OpenAI stock** on [stonkfun.xyz](${SITE.links.stonkfun})`
    : `- **CA:** not launched yet — **coming soon**
- **Paired to OpenAI stock** on stonkfun.xyz, at launch`
}

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
