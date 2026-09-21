/**
 * Tests for the contract-address guard.
 *
 * A wrong contract address is the one bug on this site that costs people real
 * money, so this runs against lib/sanitize.ts itself rather than a copy of the
 * logic. Node strips the types; the only thing swapped out is the config
 * import, so the address under test is read straight from lib/config.ts.
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

const CA = readFileSync(join(root, "lib/config.ts"), "utf8").match(
  /contract:\s*"([^"]+)"/
)?.[1];
assert.ok(CA, "could not read the contract address out of lib/config.ts");

const source = readFileSync(join(root, "lib/sanitize.ts"), "utf8").replace(
  /^import .*from "\.\/config";$/m,
  `const SITE = { contract: ${JSON.stringify(CA)} };`
);

const dir = mkdtempSync(join(tmpdir(), "openinu-"));
const file = join(dir, "sanitize.ts");
writeFileSync(file, source);

const { fixContract, createContractGuard } = await import(
  pathToFileURL(file).href
);

/** Feed text through the streaming guard in fixed-size chunks. */
function stream(text, chunkSize) {
  const guard = createContractGuard();
  let out = "";
  for (let i = 0; i < text.length; i += chunkSize) {
    out += guard.push(text.slice(i, i + chunkSize));
  }
  return out + guard.flush();
}

/** What production actually returned: one extra character in the middle. */
const HALLUCINATED = CA.slice(0, 22) + "c" + CA.slice(22);

test("repairs the hallucination seen in production", () => {
  assert.equal(HALLUCINATED.length, CA.length + 1);
  assert.equal(
    fixContract(`the address is **${HALLUCINATED}**.`),
    `the address is **${CA}**.`
  );
});

test("a longer run is repaired whole, leaving no leftover character", () => {
  const fixed = fixContract(HALLUCINATED);
  assert.equal(fixed, CA);
  assert.ok(!fixed.startsWith(CA + CA.slice(-1)), "leftover character survived");
});

test("substitutes the placeholder", () => {
  assert.equal(fixContract("CA: {{CA}}"), `CA: ${CA}`);
  assert.equal(fixContract("{{ ca }}"), CA);
});

test("leaves the correct address untouched", () => {
  assert.equal(fixContract(`CA is ${CA}`), `CA is ${CA}`);
});

test("leaves an unrelated mint and ordinary prose untouched", () => {
  const usdc = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  assert.equal(fixContract(`USDC is ${usdc}`), `USDC is ${usdc}`);
  assert.equal(fixContract("who is a good boy"), "who is a good boy");
});

test("streams correctly at every chunk size", () => {
  const text = `Woof! Address:\n\n\`\`\`\n${HALLUCINATED}\n\`\`\`\n\nBuy on stonkfun, much alpha.`;
  const want = text.replace(HALLUCINATED, CA);
  for (const size of [1, 2, 3, 5, 7, 13, 64, 500]) {
    assert.equal(stream(text, size), want, `chunk size ${size}`);
  }
});

test("never truncates, whatever the length", () => {
  assert.equal(stream("Woof.", 1), "Woof.");
  assert.equal(stream("x".repeat(96), 7), "x".repeat(96));
  assert.equal(stream("x".repeat(500), 3), "x".repeat(500));
});

test("handles an address at either edge of the stream", () => {
  assert.equal(stream(`CA: ${HALLUCINATED}`, 1), `CA: ${CA}`);
  assert.equal(stream(`${HALLUCINATED} is the CA`, 1), `${CA} is the CA`);
});
