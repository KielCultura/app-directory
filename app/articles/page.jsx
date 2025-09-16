'use client';
import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';

export default function Page() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        const res = await fetch(`${basePath}/articles.json`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setArticles(data);
        setFilteredArticles(data);
      } catch (e) {
        setError('Failed to load articles.');
        setArticles([]);
        // Add this to help debugging
        console.error('Articles fetch error:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "30px auto", fontFamily: "sans-serif" }}>
      <h1>Articles</h1>
      <SearchBar articles={articles} onResults={setFilteredArticles} />
      {loading && <p>Loading articles...</p>}
      {!loading && error && <p style={{ color: "red" }}>{error}</p>}
      <ul style={{ padding: 0 }}>
        {filteredArticles.map((article, idx) => (
          <ArticleCard key={idx} article={article} />
        ))}
      </ul>
    </div>
  );
}

// ... (rest of your ArticleCard code remains unchanged)
// Individual article card component, manages its own summary state
function ArticleCard({ article }) {
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);

  const handleSummarize = async () => {
    setSummarizing(true);
    setSummary('Summarizing...');
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: article.summary, url: article.url }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSummary(data.summary || 'No summary returned.');
    } catch (e) {
      setSummary('Failed to generate summary.');
    }
    setSummarizing(false);
  };

  return (
    <li style={{
      border: "1px solid #e2e4ed", borderRadius: 8, padding: 14, marginBottom: 18, listStyle: "none"
    }}>
      <h2 style={{ fontSize: "1.18em", fontWeight: "bold" }}>{article.title}</h2>
      <p>{article.summary}</p>
      <div>
        {article.tags && article.tags.map(tag => (
          <span key={tag} style={{
            display: "inline-block", background: "#e3eafe", borderRadius: 5,
            padding: "2px 8px", marginRight: 7, fontSize: "0.97em"
          }}>{tag}</span>
        ))}
      </div>
      <button
        onClick={handleSummarize}
        disabled={summarizing}
        style={{ marginTop: 8, padding: "8px 16px", background: "#183ba8", color: "#fff", border: "none", borderRadius: 4 }}
      >
        Summarize
      </button>
      {article.url && (
        <a href={article.url} target="_blank" rel="noreferrer" style={{ marginLeft: 10, color: "#183ba8" }}>
          Open
        </a>
      )}
      {summary && (
        <div style={{ marginTop: 12, background: "#fafdff", padding: 12, borderRadius: 8 }}>
          <strong>AI Summary:</strong>
          <p style={{ margin: 0 }}>{summary}</p>
        </div>
      )}
    </li>
  );
}
