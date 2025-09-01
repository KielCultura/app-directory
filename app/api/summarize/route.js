import { NextResponse } from 'next/server';

function getOrigin(req) {
  return req.nextUrl?.origin ||
    `${req.headers.get('x-forwarded-proto') || 'https'}://${req.headers.get('x-forwarded-host') || req.headers.get('host')}`;
}

async function getArticles(req) {
  const origin = getOrigin(req);
  const res = await fetch(`${origin}/articles.json`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load articles.json: ${res.status}`);
  return res.json();
}

function findArticleUrl(articles, index) {
  const entry = articles[index];
  if (!entry || !entry.url || !/^https?:\/\/.+\.pdf$/i.test(entry.url)) return null;
  return entry.url;
}

async function fetchPdfText(pdfUrl) {
  const res = await fetch(pdfUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ArticleSummary/1.0)',
      'Accept': 'application/pdf',
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`PDF fetch failed: ${res.status}`);
  const buffer = await res.arrayBuffer();

  // Use Groq directly with raw PDF content
  const base64 = Buffer.from(buffer).toString('base64');
  return base64;
}

async function summarizeWithGroq(base64Pdf) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768',
      messages
