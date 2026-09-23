import { COMING_SOON, SITE } from "./config";

/**
 * The model cannot be trusted to copy a 44 character base58 string without
 * slipping a character. A wrong contract address on a memecoin site sends
 * people's money somewhere it can never come back from, so the real address
 * is stitched in server-side and anything address-shaped that came close to
 * it is overwritten.
 *
 * Before launch there is no address at all, and the rule gets stricter: an
 * address invented by the model would be the only one on the official site,
 * which is exactly the lookalike a scammer wants circulating. So pre-launch
 * every address-shaped run is struck out, not repaired.
 */

const CA = SITE.contract;

/**
 * base58: no 0, O, I or l. The whole run is matched, not a bounded slice: a
 * hallucination with an inserted character is 45 long, and matching only the
 * first 44 would "repair" it into the correct address followed by the leftover
 * character — still wrong, and far more convincing. The length is judged after
 * matching instead, by MAX_ADDRESS_LEN.
 */
const B58_RUN = /[1-9A-HJ-NP-Za-km-z]{32,}/g;

/**
 * A Solana address is 32-44 characters. A little slack catches a hallucinated
 * near-miss that ran long; well past it is a hash, a blob or a long identifier,
 * which is not an address and must be left exactly as the model wrote it.
 */
const MAX_ADDRESS_LEN = 48;
const B58_CHAR = /[1-9A-HJ-NP-Za-km-z]/;
const PLACEHOLDER = /\{\{\s*CA\s*\}\}/gi;

/** Hold back enough tail that a full address can never straddle a flush. */
const HOLD = 96;

/** A hallucinated address is a near-copy; an unrelated mint is ~40 edits away. */
const MAX_EDITS = 10;

function editDistance(a: string, b: string): number {
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);

  for (let i = 1; i <= a.length; i++) {
    const cur = new Array<number>(n + 1);
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
    prev = cur;
  }
  return prev[n];
}

/**
 * Replace the {{CA}} placeholder and make sure no wrong address gets out.
 * After launch a near-miss is repaired to the real address; before launch
 * anything address-shaped is replaced with "Coming soon".
 */
export function fixContract(text: string): string {
  if (CA === null) {
    return text
      .replace(PLACEHOLDER, COMING_SOON)
      .replace(B58_RUN, (match) =>
        match.length <= MAX_ADDRESS_LEN ? COMING_SOON : match
      );
  }

  return text.replace(PLACEHOLDER, CA).replace(B58_RUN, (match) => {
    if (match === CA) return match;
    if (match.length > MAX_ADDRESS_LEN) return match;
    return editDistance(match, CA) <= MAX_EDITS ? CA : match;
  });
}

/**
 * Streaming wrapper: emits text as it arrives but never cuts inside a
 * base58 run, so an address is always rewritten as a whole.
 */
export function createContractGuard() {
  let buffer = "";

  return {
    push(chunk: string): string {
      buffer += chunk;
      if (buffer.length <= HOLD) return "";

      let cut = buffer.length - HOLD;
      while (cut > 0 && B58_CHAR.test(buffer[cut])) cut--;
      if (cut <= 0) return "";

      const head = buffer.slice(0, cut);
      buffer = buffer.slice(cut);
      return fixContract(head);
    },

    flush(): string {
      const out = fixContract(buffer);
      buffer = "";
      return out;
    },
  };
}
