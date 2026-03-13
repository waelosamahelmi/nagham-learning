"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lightbulb, ArrowLeft, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  systemPrompt: string;
  initialMessages?: ChatMessage[];
  trackColor: string;
  lessonTitle: string;
  onBack: () => void;
  onComplete: (messages: ChatMessage[], feedback: string) => void;
  onSaveProgress: (messages: ChatMessage[]) => void;
}

const quickReplies = [
  "Show me an example",
  "I don't understand",
  "Can you explain differently?",
  "Next topic",
];

export function ChatInterface({
  systemPrompt,
  initialMessages = [],
  trackColor,
  lessonTitle,
  onBack,
  onComplete,
  onSaveProgress,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages.length > 0
      ? initialMessages
      : [{ role: "system", content: systemPrompt }]
  );
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialized = useRef(false);

  const visibleMessages = messages.filter((m) => m.role !== "system");

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-start lesson if no conversation history
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (initialMessages.length === 0) {
      sendMessage("Start the lesson!", true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendMessage(content: string, isAutoStart = false) {
    if (streaming) return;

    const userMessage: ChatMessage = { role: "user", content };
    const updatedMessages = isAutoStart
      ? messages
      : [...messages, userMessage];

    if (!isAutoStart) {
      setMessages(updatedMessages);
    }
    setInput("");
    setStreaming(true);

    try {
      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          tier: "primary",
        }),
      });

      if (!response.ok) throw new Error("AI request failed");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let assistantContent = "";

      // Add empty assistant message
      const withAssistant = [
        ...updatedMessages,
        { role: "assistant" as const, content: "" },
      ];
      setMessages(withAssistant);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setMessages((prev) => {
                  const newMsgs = [...prev];
                  newMsgs[newMsgs.length - 1] = {
                    role: "assistant",
                    content: assistantContent,
                  };
                  return newMsgs;
                });
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }

      // Check if lesson seems complete
      const lower = assistantContent.toLowerCase();
      if (
        lower.includes("great job") ||
        lower.includes("lesson complete") ||
        lower.includes("well done") ||
        lower.includes("you've completed")
      ) {
        setShowComplete(true);
      }

      // Auto-save progress
      const finalMessages = [
        ...updatedMessages,
        { role: "assistant" as const, content: assistantContent },
      ];
      onSaveProgress(finalMessages);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Let me try again in a moment! 🔄",
        },
      ]);
    }

    setStreaming(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || streaming) return;
    sendMessage(input.trim());
  }

  async function handleComplete() {
    // Ask AI for feedback summary
    const feedbackMessages = [
      ...messages,
      {
        role: "user" as const,
        content:
          "Please provide a brief 2-3 sentence assessment of my understanding of this lesson. What did I learn well, and what should I review?",
      },
    ];

    setStreaming(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: feedbackMessages, tier: "fast" }),
      });
      const data = await res.json();
      const feedback =
        data.choices?.[0]?.message?.content || "Lesson completed successfully!";
      onComplete(messages, feedback);
    } catch {
      onComplete(messages, "Lesson completed!");
    }
    setStreaming(false);
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col md:h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div
        className="flex items-center gap-3 border-b border-border-subtle px-4 py-3"
        style={{
          borderBottomColor: `color-mix(in srgb, ${trackColor} 30%, transparent)`,
        }}
      >
        <button
          onClick={onBack}
          className="rounded-lg p-1.5 hover:bg-bg-hover transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold truncate">{lessonTitle}</h2>
        </div>
        {showComplete && (
          <Button
            size="sm"
            onClick={handleComplete}
            loading={streaming}
            className="gap-1"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Complete
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {visibleMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-figma/20 text-text-primary rounded-br-md"
                    : "bg-bg-tertiary text-text-primary rounded-bl-md"
                )}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {streaming && visibleMessages[visibleMessages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-bg-tertiary px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-text-tertiary animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-text-tertiary animate-bounce [animation-delay:0.1s]" />
                <span className="h-2 w-2 rounded-full bg-text-tertiary animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {!streaming && visibleMessages.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => sendMessage(reply)}
              className="shrink-0 rounded-full border border-border-subtle bg-bg-secondary px-3 py-1.5 text-xs text-text-secondary hover:border-border-active hover:text-text-primary transition-colors"
            >
              {reply}
            </button>
          ))}
          <button
            onClick={() =>
              sendMessage("Give me a hint!")
            }
            className="shrink-0 flex items-center gap-1 rounded-full border border-xp-gold/20 bg-xp-gold/5 px-3 py-1.5 text-xs text-xp-gold hover:bg-xp-gold/10 transition-colors"
          >
            <Lightbulb className="h-3 w-3" />
            Hint
          </button>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-border-subtle p-4"
      >
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border-subtle bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-figma transition-colors"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || streaming}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
