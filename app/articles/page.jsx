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
    background: #383f46;
  }
  .articles-container {
    max-width: 600px;
    margin: 30px auto;
    font-family: 'Comfortaa', Arial, sans-serif;
    color: #ffffff; /* Default text color */
  }
  h1, h2 {
    font-family: Georgia, serif;
    color: #c9daf8;
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
    background: #424954; /* slightly lighter for cards */
    list-style: none;
    box-shadow: 0 2px 8px #4169e119;
    font-family: 'Comfortaa', Arial, sans-serif;
    color: #ffffff; /* ensure card text is white */
  }
  .article-summary,
  .article-tag,
  .article-link,
  .ai-summary-box,
  .loading-message,
  .error-message,
  p,
  div {
    color: #ffffff; /* make sure other texts are white */
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
    color: #383f46; /* tags: dark text for contrast */
  }
  .yellow-btn {
    margin-top: 8px;
    padding: 8px 16px;
    background: #000000;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-family: 'Comfortaa', Arial, sans-serif;
    font-size: 1em;
    transition: background 0.2s, color 0.2s;
  }
  .yellow-btn:disabled {
    background: #333333;
    color: #888888;
    cursor: not-allowed;
  }
  .yellow-btn:hover:not(:disabled) {
    background: #222222;
    color: #ffffff;
  }
  .article-link {
    margin-left: 10px;
    color: #c9daf8 !important;
    font-family: 'Comfortaa', Arial, sans-serif;
    text-decoration: none;
    font-size: 1em;
  }
  .ai-summary-box {
    margin-top: 12px;
    background: #424954;
    padding: 12px;
    border-radius: 8px;
    color: #ffffff;
  }
  .error-message {
    color: #ffb3b3;
  }
  .loading-message {
    color: #ffffff;
  }
  a, .article-link, .card-link, .itinerary-link {
    color: #c9daf8 !important;
  }
  .button-container {
    display: flex;
    justify-content: center; 
    margin: 20px 0;         
  }
  body {
  font-family: 'Comfortaa', Arial, sans-serif;
  background: #383f46;
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
