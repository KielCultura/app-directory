import { NextResponse } from "next/server";

export async function POST(req) {
  const { title, content, tags } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ reason: "Missing title or content" }, { status: 400 });
  }

  const mockSummary = `📝 Summary of "${title}": ${content.slice(0, 100)}...`;

  return NextResponse.json({ summary: mockSummary });
}
