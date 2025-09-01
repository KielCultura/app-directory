import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { title, summary: inputSummary, tags = [] } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("Missing GROQ_API_KEY");
      return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });
    }

    const prompt = `
You are a helpful assistant that summarizes articles in 3–5 sentences.
Summarize the following article based on its metadata only:

Title: ${title}
Summary: ${inputSummary}
Tags: ${tags.join(", ")}

Be concise, informative, and relevant to Baguio City.
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You summarize articles based on metadata." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const groqData = await response.json();
    const aiSummary = groqData.choices?.[0]?.message?.content?.trim();

    if (!aiSummary) {
      return NextResponse.json({ summary: "No summary returned by Groq." }, { status: 200 });
    }

    return NextResponse.json({ summary: aiSummary });
  } catch (error) {
    console.error("Groq summarization error:", error);
    return NextResponse.json({ error: "Failed to summarize article." }, { status: 500 });
  }
}
