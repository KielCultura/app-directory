import { NextResponse } from "next/server";

// --- Helpers ---
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

async function summarizeWithGroq(content) {
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
            "You are a helpful assistant that summarizes academic articles and PDFs clearly and concisely.",
        },
        {
          role: "user",
          content: `Summarize this content:\n\n${content}`,
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

// --- API Route ---
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📥 Request body:", body);

    const { url, text } = body || {};
    let contentToSummarize = "";

    if (url && /^https?:\/\/.+\.pdf$/i.test(url)) {
      console.log("🌐 Fetching PDF:", url);
      const base64Pdf = await fetchPdfText(url);
      contentToSummarize = `Here is a base64-encoded academic PDF:\n\n${base64Pdf}`;
    } else if (text) {
      console.log("📝 Using provided text content");
      contentToSummarize = text;
    } else {
      return NextResponse.json(
        { error: "Must provide either a PDF URL or text content" },
        { status: 400 }
      );
    }

    console.log("📄 Sending to Groq…");
    const summary = await summarizeWithGroq(contentToSummarize);

    console.log("✅ Summary generated");
    return NextResponse.json({ source: url || "text", summary });
  } catch (e) {
    console.error("❌ Summarize error:", e);
    return NextResponse.json(
      { error: e.message || "Failed to generate summary" },
      { status: 500 }
    );
  }
}
