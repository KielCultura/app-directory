// app/api/summarize/route.js

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes articles in 3–5 sentences. Be concise and informative."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      return NextResponse.json({ summary: "No summary returned by Groq." }, { status: 200 });
    }

    const summary = data.choices[0].message.content;
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Groq summarization error:", error);
    return NextResponse.json({ error: "Failed to summarize article." }, { status: 500 });
  }
}
