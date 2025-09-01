import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { title, summary: inputSummary, tags = [] } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY", reason: "Environment variable not set" },
        { status: 500 }
      );
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
        model: "mixtral-8x7b-32768", // You can switch to llama3-70b-8192 if needed
        messages: [
          { role: "system", content: "You summarize articles based on metadata." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    console.log("🔍 Groq raw response:", JSON.stringify(data, null, 2));

    // Diagnostic checks
    if (!data?.choices) {
      return NextResponse.json({
        summary: null,
        reason: "Groq response missing 'choices' array",
        raw: data
      });
    }

    if (!data.choices[0]?.message) {
      return NextResponse.json({
        summary: null,
        reason: "Groq response missing 'message' object in choices[0]",
        raw: data
      });
    }

    const aiSummary = data.choices[0].message.content?.trim();

    if (!aiSummary) {
      return NextResponse.json({
        summary: null,
        reason: "Groq returned empty or undefined 'content'",
        raw: data
      });
    }

    return NextResponse.json({ summary: aiSummary });
  } catch (error) {
    console.error("❌ Groq summarization error:", error);
    return NextResponse.json({
      error: "Failed to summarize article.",
      reason: error.message || "Unknown error"
    }, { status: 500 });
  }
}
