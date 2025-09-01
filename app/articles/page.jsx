'use client';
import { useEffect, useState } from 'react';

function isArticle(x) {
  return x && typeof x.title === 'string' && typeof x.content === 'string';
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

        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          console.warn('Unexpected content-type:', ct);
        }

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('articles.json is not an array');

        const cleaned = data
          .filter(isArticle)
          .map(a => ({
            ...a,
            title: typeof a.title === 'string' ? a.title : 'Untitled',
            content: typeof a.content === 'string' ? a.content : '',
          }));

        if (!cancelled) setArticles(cleaned);
      } catch (e) {
        console.error('Failed to load articles:', e);
        if (!cancelled) {
          setError('Failed to load articles. Check public/articles.json format and try disabling extensions.');
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

  const handleSummarize = (article) => {
    setSelectedArticle(article);
    setSummary('Summarizing...');
    const text = typeof article?.content === 'string' ? article.content : '';
    const mock = text.length ? text.slice(0, 160) + '…' : 'No content to summarize.';
    setSummary(mock);
    // To use your API route, replace the 3 lines above with a call to /api/summarize (see file below).
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Articles</h1>

      {loading && <p>Loading articles...</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}
      {!loading && !error && articles.length === 0 && <p className="text-gray-600">No articles found.</p>}

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
              <button
                onClick={() => handleSummarize(article)}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Summarize
              </button>
            </li>
          );
        })}
      </ul>

      {summary && selectedArticle && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Summary of: {selectedArticle.title || 'Untitled'}</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
