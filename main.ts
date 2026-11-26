// Everyday Wonder — entry program.
//
// Writes one sentence about a small moment of wonder in everyday life to
// entry.txt in the output directory. The sentence is the entry; the program
// is deterministic and makes no network calls.
//
// The sentence lives in this file, which sits at the repository root, so the
// entrypoint resolves its source from its own directory (import.meta.url),
// never from process.cwd().
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// The entry sentence. One sentence, at most 200 characters, about a small
// moment of wonder: the escalator handrail really does drift a fraction out
// of sync with the steps, so your hand keeps arriving late to where you
// stand. "Already" was cut in revision: the paradox is already in
// "arriving late to where I stand", and the adverb earned nothing.
const SENTENCE =
  "The escalator handrail moves a fraction slower than the steps, so my hand keeps arriving late to where I stand.";

function validate(sentence: string): void {
  const text = sentence.trim();
  if (text.length < 1 || text.length > 200) {
    throw new Error(
      `entry must be 1-200 characters, got ${text.length}`,
    );
  }
  if (!/\S/.test(text)) {
    throw new Error("entry must not be only whitespace");
  }
  // Exactly one sentence: a single terminal full stop, no other
  // sentence-ending punctuation anywhere in the text.
  const terminators = text.match(/[.!?]/g) ?? [];
  if (terminators.length !== 1 || !text.endsWith(".")) {
    throw new Error("entry must be exactly one sentence");
  }
}

function main(): void {
  validate(SENTENCE);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  // Write exactly the sentence, no trailing newline: the file's bytes are
  // the entry, so the gate reads the sentence and nothing else.
  writeFileSync(outPath, SENTENCE, "utf8");
  console.log(`wrote ${outPath} (${SENTENCE.length} chars)`);
}

main();
