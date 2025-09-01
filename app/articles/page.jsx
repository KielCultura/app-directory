"use client";
import React, { useState, useEffect } from "react";

// ArticleCard component with Summarize button
function ArticleCard({ article }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSummarize() {
    setLoading(true);
    setSummary(null);
    // Uses your API route to get a summary
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: article.summary || article.title })
    });
    const data = await res.json();
    setSummary(data.summary);
    setLoading(false);
  }

  return (
    <li
      style={{
        marginBottom: 18,
        background: "#fafdff",
        borderRadius: 8,
        padding: 14,
        border: "1px solid #e2e4ed",
        listStyle: "none",
      }}
    >
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontWeight: "bold", fontSize: "1.18em", color: "#183ba8" }}
      >
        {article.title}
      </a>
      <div style={{ color: "#555", margin: "7px 0" }}>{article.summary}</div>
      <div style={{ fontSize: "0.95em", color: "#4169e1" }}>
        {article.tags &&
          article.tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: "inline-block",
                background: "#e3eafe",
                borderRadius: 5,
                padding: "2px 8px",
                marginRight: 7,
                fontSize: "0.97em",
              }}
            >
              {tag}
            </span>
          ))}
      </div>
      <button onClick={handleSummarize} disabled={loading} style={{marginTop:8}}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      {summary && (
        <div style={{marginTop:8, color:"#0b2e13"}}>
          <b>Summary:</b> {summary}
        </div>
      )}
    </li>
  );
}

export default function ArticlesPage() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/articles/articles.json")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoaded(true);
      });
  }, []);

  const filtered = articles.filter((article) => {
    const q = query.toLowerCase();
    return (
      article.title.toLowerCase().includes(q) ||
      (article.summary && article.summary.toLowerCase().includes(q)) ||
      (article.tags && article.tags.join(" ").toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ maxWidth: 600, margin: "30px auto", fontFamily: "sans-serif" }}>
      <h1>Explore Baguio Articles</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title, tag, or summary..."
        style={{ width: "100%", padding: 10, marginBottom: 20, fontSize: "1.1em" }}
      />
      {!loaded ? (
        <div>Loading articles...</div>
      ) : (
        <ul style={{ padding: 0 }}>
          {filtered.map((article, i) => (
            <ArticleCard article={article} key={i} />
          ))}
          {filtered.length === 0 && <li>No articles found.</li>}
        </ul>
      )}
    </div>
  );
}
