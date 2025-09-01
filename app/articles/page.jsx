'use client';
import { useEffect, useState } from 'react';

// Try multiple likely keys without forcing a schema change.
function pick(obj, keys) {
  for (const k of keys) {
    if (obj && typeof obj[k] === 'string' && obj[k].trim().length) return obj[k];
  }
  return '';
}

function normalizeArticle(raw) {
  // Title candidates
  const title = pick(raw, ['title', 'name', 'headline', 'label']) || 'Untitled';

  // Content/body candidates
  const content = pick(raw, ['content', 'body', 'text', 'article', 'description']);

  // Optional: url/slug candidates (used if present)
  const url = pick(raw, ['url', 'href', 'link', 'permalink', 'slug']);

  return { ...raw, title, content, url };
}

export default function Page() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/articles.json', {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status} for /articles.json`);

        const data = await res.json();

        if (!Array.isArray(data)) throw new Error('articles.json must be an array');

        const normalized = data.map(normalizeArticle);

        if (!cancelled) setArticles(normalized);
      } catch (e) {
        console.error('Failed to load articles:', e);
        if (!cancelled) {
          setError('Failed to load articles. Validate /public/articles.json and try again.');
          setArticles([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSummarize = async (article) => {
    setSelectedArticle(article);
    setSummary('Summarizing...');
    const text = typeof article?.content === 'string' ? article.content : '';

    // Mock summary without changing your data format
    const mock = text
      ? (text.length > 200 ? text.slice(0, 200) + '…' : text)
      : 'No content to summarize.';
    setSummary(mock);

    // To use a real API summarizer, replace with a POST to /api/summarize
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Articles</h1>

      {loading && <p>Loading articles...</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}
      {!loading && !error && articles.length === 0 && (
        <p className="text-gray-600">No articles found.</p>
      )}

      <ul className="space-y-4">
        {articles.map((article, idx) => {
          const preview =
            typeof article.content === 'string' && article.content.length
              ? article.content.slice(0, 120) + '…'
              : 'No preview available.';

          return (
            <li key={idx} className="border p-4 rounded">
              <h2 className="text-lg font-semibold">{article.title || 'Untitled'}</h2>
              <p className="text-sm text-gray-600">{preview}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => handleSummarize(article)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Summarize
                </button>
                {article.url && (
                  <a
                    className="text-blue-700 underline"
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {summary && selectedArticle && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">
            Summary of: {selectedArticle.title || 'Untitled'}
          </h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
