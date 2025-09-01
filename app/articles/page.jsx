'use client';
import { useState, useEffect } from 'react';

export default function Page() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

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

  const handleSummarize = async (article) => {
    setSelectedArticle(article);
    setSummary('Summarizing...');
    const mockSummary = article.content.slice(0, 100) + '...';
    setSummary(mockSummary);
    // Or call your API route at /api/summarize
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Articles</h1>
      {loading && <p>Loading articles...</p>}
      {!loading && articles.length === 0 && (
        <p className="text-red-500">⚠️ No articles found.</p>
      )}
      <ul className="space-y-4">
        {articles.map((article, idx) => (
          <li key={idx} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-600">
              {article.content.slice(0, 120)}...
            </p>
            <button
              onClick={() => handleSummarize(article)}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Summarize
            </button>
          </li>
        ))}
      </ul>
      {summary && selectedArticle && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">
            Summary of: {selectedArticle.title}
          </h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
