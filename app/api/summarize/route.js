// app/api/summarize/route.js

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { title, summary, tags = [] } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("Missing GROQ_API_KEY");
      return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });
    }

    const prompt = `
You are a helpful assistant that summarizes articles in 3–5 sentences.
Summarize the following article based on its metadata only:

Title: ${title}
Summary: ${summary}
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
        model: "llama3-8b-8192", // You can try "mixtral-8x7b-32768" if needed
       
