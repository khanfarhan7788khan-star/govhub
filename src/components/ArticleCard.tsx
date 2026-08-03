import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { Article } from "@/lib/types";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/blog/${article.slug}`} className="card">
      <div className="card-top">
        <div style={{ minWidth: 0 }}>
          <div className="card-cat">{article.category}</div>
          <h3 className="disp">{article.title}</h3>
        </div>
      </div>
      <p className="desc">{article.excerpt}</p>
      <div className="card-bottom">
        <span className="mono" style={{ fontSize: 11, color: "var(--ink-soft)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={11} /> {article.published_date}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={11} /> {article.reading_minutes} min read
          </span>
        </span>
      </div>
    </Link>
  );
}
