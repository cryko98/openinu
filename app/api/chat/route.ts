import { fal } from "@fal-ai/client";
import { SYSTEM_PROMPT, offlineReply } from "@/lib/persona";

export const runtime = "nodejs";
export const maxDuration = 60;

type ChatMessage = { role: "user" | "assistant"; content: string };

const FAL_MODEL = process.env.FAL_MODEL || "google/gemini-2.5-flash";
const MAX_HISTORY = 12;

/** any-llm takes a single prompt string, so fold the transcript into it. */
function buildPrompt(messages: ChatMessage[]): string {
  const history = messages.slice(-MAX_HISTORY);
  const last = history[history.length - 1];

  if (history.length <= 1) return last?.content ?? "";

  const transcript = history
    .slice(0, -1)
    .map((m) => `${m.role === "user" ? "Human" : "OpenINU"}: ${m.content}`)
    .join("\n\n");

  return `Conversation so far:\n\n${transcript}\n\nHuman: ${last.content}\n\nOpenINU:`;
}

function textStream(text: string) {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder();
      const chunks = text.match(/[\s\S]{1,24}/g) ?? [text];
      let i = 0;
      const tick = () => {
        if (i >= chunks.length) {
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode(chunks[i++]));
        setTimeout(tick, 18);
      };
      tick();
    },
  });
}

const STREAM_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  "X-Accel-Buffering": "no",
};

export async function POST(req: Request) {
  let messages: ChatMessage[] = [];

  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return new Response("No message", { status: 400 });

  const key = process.env.FAL_KEY;

  // No key configured (e.g. before the Vercel env var is set) — stay useful.
  if (!key) {
    return new Response(textStream(offlineReply(lastUser.content)), {
      headers: STREAM_HEADERS,
    });
  }

  fal.config({ credentials: key });

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = "";
      try {
        const events = await fal.stream("fal-ai/any-llm", {
          input: {
            model: FAL_MODEL,
            system_prompt: SYSTEM_PROMPT,
            prompt: buildPrompt(messages),
            temperature: 0.8,
            max_tokens: 1024,
          },
        });

        for await (const event of events as AsyncIterable<{ output?: string }>) {
          const output = event?.output;
          if (typeof output !== "string") continue;
          // fal streams cumulative output — emit only the new tail.
          if (output.startsWith(sent)) {
            const delta = output.slice(sent.length);
            if (delta) controller.enqueue(encoder.encode(delta));
            sent = output;
          } else {
            controller.enqueue(encoder.encode(output));
            sent += output;
          }
        }

        // Depending on the client version, done() resolves to the output
        // object itself or to { data: output }.
        const result = (await events.done()) as
          | { output?: string; data?: { output?: string } }
          | undefined;
        const final = result?.output ?? result?.data?.output;
        if (typeof final === "string" && final.startsWith(sent)) {
          const delta = final.slice(sent.length);
          if (delta) controller.enqueue(encoder.encode(delta));
        }

        if (!sent.trim()) {
          controller.enqueue(
            encoder.encode(offlineReply(lastUser.content))
          );
        }
      } catch (err) {
        console.error("[openinu] fal.ai error:", err);
        if (!sent) {
          controller.enqueue(
            encoder.encode(
              "*Whimper.* My leash got tangled on the way to the server — try that again in a second. 🐕"
            )
          );
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: STREAM_HEADERS });
}
