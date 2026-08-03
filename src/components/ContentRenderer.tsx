import { parseContent } from "@/lib/content";
import Link from "next/link";

export default function ContentRenderer({ text }: { text: string }) {
  const blocks = parseContent(text);
  return (
    <div className="article-body">
      {blocks.map((b, i) => {
        if (b.type === "h2") return <h2 key={i} className="disp">{b.text}</h2>;
        if (b.type === "h3") return <h3 key={i} className="disp">{b.text}</h3>;
        if (b.type === "ul")
          return (
            <ul key={i}>
              {b.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        return <p key={i}>{renderInline(b.text)}</p>;
      })}
    </div>
  );
}

/** Handles the two inline conventions used in seed content: **bold** and [text](/path) links. */
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        const isInternal = linkMatch[2].startsWith("/");
        parts.push(
          isInternal ? (
            <Link key={key++} href={linkMatch[2]} style={{ color: "var(--saffron)" }}>
              {linkMatch[1]}
            </Link>
          ) : (
            <a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" style={{ color: "var(--saffron)" }}>
              {linkMatch[1]}
            </a>
          )
        );
      }
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}
