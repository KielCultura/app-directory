import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { title, summary: inputSummary, tags = [] } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });
    }

    const prompt = `
You are a helpful assistant that summarizes articles about Baguio City.
Summarize the following article in 3–5 sentences based on its metadata:

Title: ${title}
Summary: ${inputSummary}
Tags: ${tags.join(", ")}

Be concise, informative, and relevant to local culture, history, or tourism.
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          { role: "system", content: "You summarize articles based on metadata." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    const aiSummary = data?.choices?.[0]?.message?.content?.trim();

    if (!aiSummary) {
      console.warn("Groq returned no usable content:", JSON.stringify(data, null, 2));
      return NextResponse.json({ summary: "No summary returned by Groq." }, { status: 200 });
    }

    return NextResponse.json({ summary: aiSummary });
  } catch (error) {
    console.error("Groq summarization error:", error);
    return NextResponse.json({ error: "Failed to summarize article." }, { status: 500 });
  }
}
