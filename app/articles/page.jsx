'use client';
import { useState, useEffect } from 'react';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/articles.json')
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load articles:', err);
        setLoading(false);
      });
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(normalizedQuery) ||
    article.summary.toLowerCase().includes(normalizedQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Baguio Articles</h1>

      <input
        type="text"
        placeholder="Search by title, tags, or summary..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading ? (
        <p className="text-gray-500">Loading articles...</p>
      ) : filteredArticles.length === 0 ? (
        <p className="text-gray-500">No articles match your search.</p>
      ) : (
        <ul className="space-y-6">
          {filteredArticles.map((article, index) => (
            <li key={index} className="border-b pb-4">
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-gray-700 mt-2">{article.summary}</p>
              <div className="mt-2 text-sm text-blue-600">
                {article.tags.map((tag, i) => (
                  <span key={i} className="mr-2">#{tag}</span>
                ))}
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-500 hover:underline"
              >
                Read full article
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
