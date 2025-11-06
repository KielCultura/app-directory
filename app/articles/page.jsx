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
    <div className="articles-container">
      {/* Global styles for the page */}
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Comfortaa:400,700&display=swap');
        @import url('https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap');
        body {
          font-family: 'Comfortaa', Arial, sans-serif;
          background: #f5f8fa;
        }
        .articles-container {
          max-width: 600px;
          margin: 30px auto;
          font-family: 'Comfortaa', Arial, sans-serif;
        }
        h1, h2 {
          font-family: Georgia, serif;
          color: #ffce10;
        }
        h1 {
          font-size: 2.2em;
          font-weight: 700;
          text-align: center;
          margin-bottom: 22px;
        }
        h2 {
          font-size: 1.18em;
          font-weight: bold;
          margin-bottom: 6px;
        }
        .article-list {
          padding: 0;
        }
        .article-card {
          border: 1px solid #e2e4ed;
          border-radius: 10px;
          padding: 18px 20px 16px 20px;
          margin-bottom: 22px;
          background: #fafdff;
          list-style: none;
          box-shadow: 0 2px 8px #4169e119;
          font-family: 'Comfortaa', Arial, sans-serif;
        }
        .article-summary {
          margin-bottom: 10px;
        }
        .article-tags {
          margin-bottom: 10px;
        }
        .article-tag {
          display: inline-block;
          background: #e3eafe;
          border-radius: 5px;
          padding: 2px 8px;
          margin-right: 7px;
          font-size: 0.97em;
        }
        .yellow-btn {
          margin-top: 8px;
          padding: 8px 16px;
          background: #ffce10;
          color: #333;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Comfortaa', Arial, sans-serif;
          font-size: 1em;
          transition: background 0.2s, color 0.2s;
        }
        .yellow-btn:disabled {
          background: #ccc;
          color: #888;
          cursor: not-allowed;
        }
        .yellow-btn:hover:not(:disabled) {
          background: #e0b808;
        }
        .article-link {
          margin-left: 10px;
          color: #4169e1;
          font-family: 'Comfortaa', Arial, sans-serif;
          text-decoration: none;
          font-size: 1em;
        }
        .ai-summary-box {
          margin-top: 12px;
          background: #fafdff;
          padding: 12px;
          border-radius: 8px;
        }
        .error-message {
          color: red;
        }
        .loading-message {
          color: #888;
        }
      a, .article-link, .card-link, .itinerary-link {
  color: #93c47d !important;
}
.button-container {
  display: flex;
  justify-content: center; 
  margin: 20px 0;         
}

      `}</style>
      <h1>Articles</h1>
      <div className="button-container">
           <a
        href="https://sites.google.com/view/bagrovrph/tutotial-2"
        rel="noopener noreferrer"
        target="_blank"

      >
        <button className="yellow-btn">Help</button>
      </a> 
        </div>
      
      <SearchBar articles={articles} onResults={setFilteredArticles} />
      {loading && <p className="loading-message">Loading articles...</p>}
      {!loading && error && <p className="error-message">{error}</p>}
      <ul className="article-list">
        {filteredArticles.map((article, idx) => (
          <ArticleCard key={idx} article={article} />
        ))}
      </ul>
    </div>
  );
}

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
    <li className="article-card">
      <h2>{article.title}</h2>
      <p className="article-summary">{article.summary}</p>
      <div className="article-tags">
        {article.tags && article.tags.map(tag => (
          <span key={tag} className="article-tag">{tag}</span>
        ))}
      </div>
      <button
        onClick={handleSummarize}
        disabled={summarizing}
        className="yellow-btn"
      >
        Summarize
      </button >
      {article.url && (
        <a href={article.url} target="_blank" rel="noreferrer" className="article-link">
          Open
        </a>
      )}
      {summary && (
        <div className="ai-summary-box">
          <strong>AI Summary:</strong>
          <p style={{ margin: 0 }}>{summary}</p>
        </div>
      )}
    </li>
  );
}
