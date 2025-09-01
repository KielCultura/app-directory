export async function POST(req) {
  const { text } = await req.json();
  const apiKey = process.env.GROQ_API_KEY;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "Summarize the following article in 3-5 sentences." },
        { role: "user", content: text }
      ]
    })
  });

  const data = await response.json();
  const summary = data.choices?.[0]?.message?.content || "No summary available.";
  return Response.json({ summary });
}
