"use client";
import { useState } from "react";

export default function ArticleCard({ article }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSummarize() {
    console.log("🖱️ Summarize button clicked");
    setLoading(true);
    setSummary(null);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          content: article.content,
          tags: article.tags || []
        })
      });

      const data = await res.json();
      console.log("🧠 API response:", data);

      if (data.summary) {
        setSummary(data.summary);
      } else {
        setSummary(`⚠️ No summary returned. Reason: ${data.reason || "Unknown"}`);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setSummary("❌ Failed to fetch summary.");
    }

    setLoading(false);
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", marginBottom: "20px", borderRadius: "8px" }}>
      <h2>{article.title}</h2>
      <p>{article.content}</p>
      <button onClick={handleSummarize} disabled={loading} style={{ marginTop: "10px" }}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      {summary && (
        <div style={{ marginTop: "15px", background: "#f9f9f9", padding: "10px", borderRadius: "6px" }}>
          <strong>Summary:</strong>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
