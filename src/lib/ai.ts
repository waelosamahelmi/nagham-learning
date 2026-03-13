import OpenAI from "openai";

// ─── Provider Models ────────────────────────────────────────
const MODELS = {
  zai: {
    primary: "glm-4.7",
    fast: "glm-4.7-flash",
    vision: "glm-4.6v",
  },
  openrouter: {
    primary: "z-ai/glm-4.5-air:free",
    fast: "z-ai/glm-4.5-air:free",
    vision: "z-ai/glm-4.5-air:free",
  },
} as const;

// ─── Lazy Client Creation ───────────────────────────────────
type ProviderName = keyof typeof MODELS;

const clients: Partial<Record<ProviderName, OpenAI>> = {};

function getClient(name: ProviderName): OpenAI {
  if (!clients[name]) {
    if (name === "zai") {
      clients[name] = new OpenAI({
        apiKey: process.env.ZAI_API_KEY || "",
        baseURL: process.env.ZAI_BASE_URL || "https://api.z.ai/api/paas/v4/",
      });
    } else {
      clients[name] = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY || "",
        baseURL:
          process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "https://nagham.helmies.fi",
          "X-Title": "NaghamOS",
        },
      });
    }
  }
  return clients[name]!;
}

function getActiveProvider(): ProviderName {
  return (process.env.AI_PROVIDER as ProviderName) || "zai";
}

// ─── Core AI Function ───────────────────────────────────────
export type ModelTier = "primary" | "fast" | "vision";

export async function chatWithAI(
  messages: OpenAI.ChatCompletionMessageParam[],
  tier: ModelTier = "primary",
  stream: boolean = true
) {
  const active = getActiveProvider();
  const client = getClient(active);
  const model = MODELS[active][tier];

  try {
    const response = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.8,
      stream,
    });
    return response;
  } catch (error) {
    // Auto-fallback: if primary provider fails, try the other
    const fallbackName: ProviderName =
      active === "zai" ? "openrouter" : "zai";
    const fallbackClient = getClient(fallbackName);

    console.warn(
      `[AI] ${active} failed (${error instanceof Error ? error.message : "unknown"}), falling back to ${fallbackName}`
    );

    try {
      const response = await fallbackClient.chat.completions.create({
        model: MODELS[fallbackName][tier],
        messages,
        temperature: 0.8,
        stream,
      });
      return response;
    } catch (fallbackError) {
      console.error(
        `[AI] Fallback ${fallbackName} also failed:`,
        fallbackError instanceof Error ? fallbackError.message : fallbackError
      );
      throw fallbackError;
    }
  }
}

// ─── Convenience exports ────────────────────────────────────
export const ai = {
  lesson: (msgs: OpenAI.ChatCompletionMessageParam[]) =>
    chatWithAI(msgs, "primary"),
  quiz: (msgs: OpenAI.ChatCompletionMessageParam[]) =>
    chatWithAI(msgs, "fast"),
  vision: (msgs: OpenAI.ChatCompletionMessageParam[]) =>
    chatWithAI(msgs, "vision"),
};
