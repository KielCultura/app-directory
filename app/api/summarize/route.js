import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { url, text } = body || {};
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Missing GROQ_API_KEY");

    let contentToSummarize = text || "";
    if (url && /^https?:\/\/.+\.pdf$/i.test(url)) {
      // (Note: For real PDF support, extract text from PDF here)
      contentToSummarize = `PDF at ${url}`;
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          { role: "system", content: "You summarize academic articles and PDFs." },
          { role: "user", content: contentToSummarize }
        ],
        temperature: 0.7,
      }),
    });

    const groqData = await groqRes.json();
    const summary = groqData.choices?.[0]?.message?.content || "No summary available.";
    return NextResponse.json({ summary });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Failed to generate summary" }, { status: 500 });
  }
}
