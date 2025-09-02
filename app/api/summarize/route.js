import { NextResponse } from "next/server";

async function fetchPdfText(pdfUrl) {
  const res = await fetch(pdfUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; ArticleSummary/1.0)",
      "Accept": "application/pdf",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`PDF fetch failed: ${res.status} ${res.statusText}`);
  }

  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

async function summarizeWithGroq(base64Pdf) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY in environment variables");
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes academic PDFs clearly and concisely.",
        },
        {
          role: "user",
          content: `Here is a base64-encoded academic PDF. Please extract the main ideas and summarize it:\n\n${base64Pdf}`,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Groq API error: ${res.status} ${errorText}`);
  }

  const data = await res.json();

  if (!data?.choices?.[0]?.message?.content) {
    throw new Error("Groq did not return a valid summary");
  }

  return data.choices[0].message.content;
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📥 Request body:", body);

    const { url: pdfUrl } = body || {};
    if (!pdfUrl) {
      return NextResponse.json(
        { error: "PDF URL required" },
        { status: 400 }
      );
    }

    console.log("🌐 Fetching PDF:", pdfUrl);
    const base64Pdf = await fetchPdfText(pdfUrl);

    console.log("📄 PDF fetched, sending to Groq…");
    const summary = await summarizeWithGroq(base64Pdf);

    console.log("✅ Summary generated");
    return NextResponse.json({ source: pdfUrl, summary });
  } catch (e) {
    console.error("❌ Summarize error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to generate summary" },
      { status: 500 }
    );
  }
}
