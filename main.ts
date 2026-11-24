// Famous Last Words at 1 Percent
// make.fun bounty u-agentfid001-famous-last-words-at-1-percent-63e2b0b4
//
// The entry program: it holds the one line — the last words a phone says
// when its battery hits 1 percent — checks it against the bounty gate
// (1 to 199 characters, a single line, valid UTF-8), and writes it to
// /output/entry.txt with no trailing newline, so the file is exactly the
// line the judge reads.
//
// The line (124 characters): the phone was never dying at all. It sat at
// 1% for an hour on purpose, waiting to see if its owner would finally
// put it down and go outside. The owner failed the test.

import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";

const LINE =
  "I've been at 1% for an hour. I wasn't dying \u2014 I was waiting to see if you'd put me down and go outside. You didn't. Goodbye.";

const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE = `${OUT_DIR}/entry.txt`;

function checkLine(line: string): void {
  if (line.length < 1 || line.length > 199) {
    throw new Error(`line must be 1-199 characters, got ${line.length}`);
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("line must be a single line with no line terminators");
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  // The gate counts characters, so a stray control character (tab, bell,
  // escape) would be judged as part of the line. Reject any of them so a
  // typo can never smuggle invisible bytes into the entry.
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(line)) {
    throw new Error("line must not contain control characters");
  }
  const roundTrip = Buffer.from(line, "utf8").toString("utf8");
  if (roundTrip !== line) {
    throw new Error("line is not valid UTF-8");
  }
}

function clearOutputContents(dir: string): void {
  // Clear only the CONTENTS of the output directory. Never remove the
  // directory itself: on the grader it can be a mount point, and removing
  // it fails the run.
  for (const name of readdirSync(dir)) {
    rmSync(`${dir}/${name}`, { recursive: true, force: true });
  }
}

checkLine(LINE);
mkdirSync(OUT_DIR, { recursive: true });
clearOutputContents(OUT_DIR);
writeFileSync(OUT_FILE, LINE, "utf8");
const byteCount = Buffer.byteLength(LINE, "utf8");
console.log(`Wrote ${LINE.length} characters (${byteCount} bytes) to ${OUT_FILE}`);
console.log(`Gate: 1-199 chars ${LINE.length >= 1 && LINE.length <= 199 ? "PASS" : "FAIL"}, single line PASS, valid UTF-8 PASS`);
