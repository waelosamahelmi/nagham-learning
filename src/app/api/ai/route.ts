import { NextRequest, NextResponse } from "next/server";
import { chatWithAI, type ModelTier } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { messages, tier = "primary" } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const response = await chatWithAI(messages, tier as ModelTier, false);

    return NextResponse.json(response);
  } catch (error) {
    console.error("[AI API]", error);
    return NextResponse.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}
