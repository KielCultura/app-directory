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
  return Buffer.from(buffer).toString('base64');
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
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that summarizes academic PDFs clearly and concisely.',
        },
        {
          role: 'user',
          content: `Here is a base64-encoded academic PDF. Please extract the main ideas and summarize it:\n\n${base64Pdf}`,
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { index, url: directUrl } = body || {};

    let pdfUrl = directUrl;

    if (!pdfUrl) {
      const articles = await getArticles(req);
      pdfUrl = findArticleUrl(articles, index);
      if (!pdfUrl) {
        return NextResponse.json(
          { error: 'Valid PDF URL not found. Provide index or url.' },
          { status: 400 }
        );
      }
    }

    const base64Pdf = await fetchPdfText(pdfUrl);
    const summary = await summarizeWithGroq(base64Pdf);

    return NextResponse.json({ source: pdfUrl, summary });
  } catch (e) {
    console.error('Summarize error:', e);
    return NextResponse.json({ error: 'Failed to summarize' }, { status: 500 });
  }
}
