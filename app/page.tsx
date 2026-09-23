import { ChatApp } from "@/components/ChatApp";
import { SITE } from "@/lib/config";

export default function Page() {
  return (
    <>
      {/* SEO copy — visible to crawlers, out of the way of the chat UI */}
      <h1 className="sr-only">
        {SITE.name} ({SITE.ticker}) — {SITE.tagline} A Solana memecoin paired to
        OpenAI stock on stonkfun.xyz.{" "}
        {SITE.contract
          ? `Contract address ${SITE.contract}.`
          : "Not launched yet — the contract address is announced at launch, and anyone offering one before then is not us."}
      </h1>
      <ChatApp />
    </>
  );
}
