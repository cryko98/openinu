/**
 * Tests for the contract-address guard.
 *
 * A wrong contract address is the one bug on this site that costs people real
 * money, so this runs against lib/sanitize.ts itself rather than a copy of the
 * logic. Node strips the types; only the config import is swapped out, which
 * lets the same source be exercised in both modes:
 *
 *   - launched    — a near-miss address is repaired to the real one
 *   - pre-launch  — there is no real address, so anything address-shaped is
 *                   struck out rather than repaired
 *
 * The address below is a fixture, not the real one. The real address is never
 * committed to this repo; it arrives at runtime via NEXT_PUBLIC_TOKEN_CONTRACT.
 *
 *   npm test
 */
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

/** 44 base58 characters, the same shape as a Solana mint. */
const CA = "GuardSpecMint" + "A".repeat(31);
const COMING_SOON = "Coming soon";

assert.equal(CA.length, 44, "fixture must be a realistic address length");

const sanitizeSource = readFileSync(join(root, "lib/sanitize.ts"), "utf8");

assert.match(
  sanitizeSource,
  /^import .*from "\.\/config";$/m,
  "sanitize.ts no longer imports from ./config — this harness needs updating"
);

/** Load lib/sanitize.ts with a stubbed config, as launched or pre-launch. */
function load(contract) {
  const source = sanitizeSource.replace(
    /^import .*from "\.\/config";$/m,
    `const COMING_SOON = ${JSON.stringify(COMING_SOON)};
     const SITE = { contract: ${JSON.stringify(contract)} };`
  );
  const file = join(mkdtempSync(join(tmpdir(), "openinu-")), "sanitize.ts");
  writeFileSync(file, source);
  return import(pathToFileURL(file).href);
}

const launched = await load(CA);
const preLaunch = await load(null);

/** Feed text through the streaming guard in fixed-size chunks. */
function stream(mod, text, chunkSize) {
  const guard = mod.createContractGuard();
  let out = "";
  for (let i = 0; i < text.length; i += chunkSize) {
    out += guard.push(text.slice(i, i + chunkSize));
  }
  return out + guard.flush();
}

/** What production actually returned once: one extra character in the middle. */
const HALLUCINATED = CA.slice(0, 22) + "c" + CA.slice(22);
const USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

test("launched: repairs the hallucination seen in production", () => {
  assert.equal(HALLUCINATED.length, CA.length + 1);
  assert.equal(
    launched.fixContract(`the address is **${HALLUCINATED}**.`),
    `the address is **${CA}**.`
  );
});

test("launched: a longer run is repaired whole, no leftover character", () => {
  const fixed = launched.fixContract(HALLUCINATED);
  assert.equal(fixed, CA);
  assert.ok(!fixed.startsWith(CA + CA.slice(-1)), "leftover character survived");
});

test("launched: substitutes the placeholder", () => {
  assert.equal(launched.fixContract("CA: {{CA}}"), `CA: ${CA}`);
  assert.equal(launched.fixContract("{{ ca }}"), CA);
});

test("launched: leaves the correct address and unrelated mints alone", () => {
  assert.equal(launched.fixContract(`CA is ${CA}`), `CA is ${CA}`);
  assert.equal(launched.fixContract(`USDC is ${USDC}`), `USDC is ${USDC}`);
});

test("launched: streams correctly at every chunk size", () => {
  const text = `Woof! Address:\n\n\`\`\`\n${HALLUCINATED}\n\`\`\`\n\nBuy on stonkfun.`;
  const want = text.replace(HALLUCINATED, CA);
  for (const size of [1, 2, 3, 5, 7, 13, 64, 500]) {
    assert.equal(stream(launched, text, size), want, `chunk size ${size}`);
  }
});

test("pre-launch: never lets an address through, however plausible", () => {
  for (const address of [CA, HALLUCINATED, USDC]) {
    const out = preLaunch.fixContract(`the CA is ${address} ok`);
    assert.equal(out, `the CA is ${COMING_SOON} ok`);
    assert.ok(!out.includes(address.slice(0, 32)), "address leaked");
  }
});

test("pre-launch: the placeholder becomes Coming soon", () => {
  assert.equal(preLaunch.fixContract("CA: {{CA}}"), `CA: ${COMING_SOON}`);
});

test("pre-launch: no address survives the stream, at any chunk size", () => {
  const text = `Here it is:\n\n\`\`\`\n${USDC}\n\`\`\`\n\nApe in now.`;
  for (const size of [1, 2, 3, 7, 64, 500]) {
    const out = stream(preLaunch, text, size);
    assert.ok(!out.includes(USDC), `address leaked at chunk size ${size}`);
    assert.ok(out.includes(COMING_SOON), `no replacement at chunk size ${size}`);
  }
});

test("both modes: ordinary prose is untouched and nothing is truncated", () => {
  for (const mod of [launched, preLaunch]) {
    assert.equal(mod.fixContract("who is a good boy"), "who is a good boy");
    assert.equal(stream(mod, "Woof.", 1), "Woof.");
    assert.equal(stream(mod, "x".repeat(500), 3), "x".repeat(500));
  }
});

test("both modes: handles an address at either edge of the stream", () => {
  assert.equal(stream(launched, `CA: ${HALLUCINATED}`, 1), `CA: ${CA}`);
  assert.equal(stream(launched, `${HALLUCINATED} is it`, 1), `${CA} is it`);
  assert.equal(stream(preLaunch, `CA: ${CA}`, 1), `CA: ${COMING_SOON}`);
  assert.equal(stream(preLaunch, `${CA} is it`, 1), `${COMING_SOON} is it`);
});
