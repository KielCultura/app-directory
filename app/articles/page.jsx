'use client';
import { useEffect, useState } from 'react';

function toPlainText(input) {
  if (typeof input !== 'string') return '';
  const noHtml = input.replace(/<[^>]+>/g, ' ');
  return noHtml.replace(/\s+/g, ' ').trim();
}

function extractText(val) {
  if (!val) return '';
  if (typeof val === 'string') return toPlainText(val);
  if (Array.isArray(val)) {
    return val.map(extractText).filter(Boolean).join(' ');
  }
  if (typeof val === 'object') {
    const fields = ['content','body','text','article','description','excerpt','html','markdown','rendered','value'];
    for (const f of fields) if (f in val) {
      const t = extractText(val[f]);
      if (t) return t;
    }
    return Object.values(val).map(extractText).filter(Boolean).join(' ');
  }
  return '';
}

function extractTitle(obj) {
  if (!obj || typeof obj !== 'object') return 'Untitled';
  const candidates = ['title','name','headline','label'];
  for (const k of candidates) {
    const v = obj[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (v && typeof v === 'object') {
      const t = extractText(v);
      if (t) return t;
    }
  }
  return 'Untitled';
}

function normalizeArticle(raw) {
  const title = extractTitle(raw);
  const content =
    extractText(raw.content) ||
    extractText(raw.body) ||
    extractText(raw.text) ||
    extractText(raw.article) ||
    extractText(raw.description) ||
    extractText(raw.excerpt) ||
    extractText(raw);

  const url =
    (typeof raw.url === 'string' && raw.url) ||
    (typeof raw.href === 'string' && raw.href) ||
    (typeof raw.link === 'string' && raw.link) ||
    (typeof raw.permalink === 'string' && raw.permalink) ||
    (typeof raw.slug === 'string' && raw.slug) ||
    '';

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
          setError('Failed to load articles. Check public/articles.json and try again.');
          setArticles([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const handleSummarize = async (article) => {
    setSelectedArticle(article);
    setSummary('Summarizing...');

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: article.url }), // ✅ send URL
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSummary(typeof data.summary === 'string' ? data.summary : 'No summary returned.');
    } catch (e) {
      console.error(e);
      setSummary('Failed to generate summary.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Articles</h1>

      {loading && <p>Loading articles...</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}
      {!loading && !error &&
