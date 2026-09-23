# OpenINU — $OPENINU

> The good boy of artificial intelligence.

A ChatGPT-style web app for **$OPENINU**, a Shiba Inu themed memecoin on **Solana**, paired to **OpenAI stock** on stonkfun.xyz.

The dog is not fan art. OpenAI generated him and posted him to their own Instagram on **3 October 2022**, captioned *"shiba inu portrait, 8k, rendering"* — [the post is still up](https://www.instagram.com/p/CjQeCdTL51i/). They made him, posted him, and moved on. $OPENINU is the part where someone came back for him.

## 🚧 Not launched yet

**There is no contract address.** It is deliberately not in this repo.

The site runs in pre-launch mode until `NEXT_PUBLIC_TOKEN_CONTRACT` is set, which means the CA, the stonkfun/DexScreener/Solscan links and the live stats bar all read **"Coming soon"**, and the assistant refuses to produce an address at all — it cannot leak what it does not have.

> Anyone circulating a $OPENINU contract address right now is not us. The real one is announced on [X](https://x.com/openinu_) and appears on the site at the same moment.

**To go live:** set `NEXT_PUBLIC_TOKEN_CONTRACT` on Vercel and redeploy. Every address, link and live number comes back on together — no code changes.

---

## What's in here

- **A real chat interface** — streaming responses, chat history in `localStorage`, stop/regenerate, markdown rendering, light & dark themes. Built to feel like the real thing.
- **fal.ai powered** — the assistant runs on [`fal-ai/any-llm`](https://fal.ai/models/fal-ai/any-llm) with a Shiba Inu system prompt.
- **Live token stats** — price, 24h change, market cap, liquidity, volume and on-chain supply, pulled from DexScreener + Solana RPC.
- **Instant preset answers** — "How to buy", "Tokenomics", "The OpenAI pairing", "Roadmap" are hand-written and typed out locally, so they never hallucinate a contract address.
- **Graceful degradation** — with no `FAL_KEY` set the dog still answers the essentials instead of erroring.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · `@fal-ai/client`

---

## Local development

```bash
npm install
cp .env.example .env.local   # then paste your FAL_KEY
npm run dev
```

Open http://localhost:3000.

## Deploying on Vercel

1. Import the repo at [vercel.com/new](https://vercel.com/new). Framework preset: **Next.js** (auto-detected).
2. Add the environment variables under **Settings → Environment Variables**:

   | Name | Required | Value |
   |---|---|---|
   | `FAL_KEY` | **yes** | Your key from [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys) |
   | `FAL_MODEL` | no | Defaults to `google/gemini-2.5-flash` |
   | `SOLANA_RPC_URL` | no | A private RPC; defaults to the public mainnet endpoint |

3. Deploy. `FAL_KEY` is read server-side only in `app/api/chat/route.ts` — it is never exposed to the browser.

> After adding or changing an environment variable, redeploy so the new value is picked up.

## Project layout

```
app/
  api/chat/route.ts    streaming chat endpoint (fal.ai)
  api/token/route.ts   live price / supply stats
  layout.tsx           metadata, favicon, theme bootstrap
  page.tsx
components/            chat UI (sidebar, composer, messages, stats)
lib/
  config.ts            ticker, contract, links — edit these first
  persona.ts           the system prompt and offline fallback
  presets.ts           hand-written answers
public/logo.png        logo, favicon and agent avatar
```

Changing the token details? Everything lives in [`lib/config.ts`](lib/config.ts).

---

**Disclaimer.** OpenINU is a parody memecoin project. It is **not** affiliated with, endorsed by, or connected to OpenAI, ChatGPT or Anthropic. Nothing here is financial advice.
