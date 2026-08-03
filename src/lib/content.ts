export type ContentBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

/**
 * Turns a simple text format into structured blocks:
 *   "## Heading"   -> h2
 *   "### Heading"  -> h3
 *   "- item"       -> collected into <ul>
 *   blank-line separated text -> <p>
 * No HTML is ever parsed from this input, so there's no injection risk even
 * though the source is admin-authored free text.
 */
export function parseContent(raw: string): ContentBlock[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const blocks: ContentBlock[] = [];
  let para: string[] = [];
  let list: string[] = [];

  function flushPara() {
    if (para.length) {
      blocks.push({ type: "p", text: para.join(" ").trim() });
      para = [];
    }
  }
  function flushList() {
    if (list.length) {
      blocks.push({ type: "ul", items: list });
      list = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      flushPara();
      flushList();
      blocks.push({ type: "h3", text: trimmed.slice(4) });
    } else if (trimmed.startsWith("## ")) {
      flushPara();
      flushList();
      blocks.push({ type: "h2", text: trimmed.slice(3) });
    } else if (trimmed.startsWith("- ")) {
      flushPara();
      list.push(trimmed.slice(2));
    } else if (trimmed === "") {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(trimmed);
    }
  }
  flushPara();
  flushList();
  return blocks;
}

export function parseBullets(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((l) => l.replace(/^-\s*/, "").trim())
    .filter(Boolean);
}

export type FaqPair = { q: string; a: string };

/** Format: "Q: ...\nA: ...\n\nQ: ...\nA: ..." */
export function parseFaqPairs(raw: string | null | undefined): FaqPair[] {
  if (!raw) return [];
  const chunks = raw.split(/\n\s*\n/);
  const pairs: FaqPair[] = [];
  for (const chunk of chunks) {
    const qMatch = chunk.match(/Q:\s*(.+)/);
    const aMatch = chunk.match(/A:\s*([\s\S]+)/);
    if (qMatch && aMatch) {
      pairs.push({ q: qMatch[1].trim(), a: aMatch[1].trim() });
    }
  }
  return pairs;
}

export function estimateReadingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
