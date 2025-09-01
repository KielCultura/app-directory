import { NextResponse } from 'next/server';

// Simple extractive summarizer:
// - Split into sentences
// - Score sentences by word frequency (ignoring common stopwords)
// - Return top N sentences in original order
function summarize(text, maxSentences = 3) {
  const clean = String(text || '')
    .replace(/\s+/g, ' ')
    .replace(/\[[^\]]*\]/g, '') // strip refs like [1]
    .trim();

  const sentences = clean
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (sentences.length === 0) return '';
  if (sentences.length <= maxSentences) return clean;

  const stop = new Set([
    'the','is','are','a','an','and','or','of','to','in','for','on','with','by','as','that',
    'it','its','this','these','those','be','from','at','was','were','has','have','had',
    'but','not','their','they','you','we','he','she','his','her','them','our','your',
  ]);

  const words = clean
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w && !stop.has(w));

  const freq = new Map();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);

  const sentenceScores = sentences.map((s, idx) => {
    const ws = s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
    let score = 0;
    for (const w of ws) if (w && !stop.has(w)) score += freq.get(w) || 0;
    return { idx, s, score };
  });

  const top = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.idx - b.idx)
    .map(x => x.s);

  return top.join(' ');
}

export async function POST(req) {
  try {
    const { text, sentences = 3 } = await req.json();
    if (typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }
    const n = Math.min(Math.max(Number(sentences) || 3, 1), 6);
    const summary = summarize(text, n);
    return NextResponse.json({ summary });
  } catch (e) {
    console.error('Summarize error:', e);
    return NextResponse.json({ error: 'Failed to summarize' }, { status: 500 });
  }
}
