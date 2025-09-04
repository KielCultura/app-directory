import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { url, text } = body || {};
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Missing GROQ_API_KEY");

    let prompt = "";

    if (url && /^https?:\/\/.+\.pdf$/i.test(url)) {
      prompt = `Please summarize the academic PDF at this URL: ${url}`;
    } else if (text) {
      prompt = `Please summarize the following article:\n\n${text}`;
    } else {
      return NextResponse.json({ error: "Must provide a PDF URL or text" }, { status: 400 });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // <-- UPDATED MODEL NAME
        messages: [
          { role: "system", content: "You summarize academic articles and PDFs clearly and concisely." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const groqData = await groqRes.json();
    // Return Groq's raw response for debugging
    return NextResponse.json({
      summary: groqData.choices?.[0]?.message?.content || "No summary available.",
      debug: groqData
    });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Failed to generate summary" }, { status: 500 });
  }
}
