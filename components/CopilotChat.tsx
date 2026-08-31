"use client";

import { useState } from "react";
import { SendHorizonal } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function CopilotChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed
    };

    setMessages((current) => [...current, userMessage]);
    setQuery("");
    setLoading(true);

    const response = await fetch("/api/copilot/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: trimmed })
    });
    const data = (await response.json()) as { answer: string };

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer
      }
    ]);
    setLoading(false);
  }

  return (
    <section className="flex min-h-[620px] flex-col rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-ink">AI Copilot</h2>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[360px] items-center justify-center rounded-md bg-slate-50 text-center">
            <div>
              <p className="text-lg font-semibold text-ink">Ask about HR operations</p>
              <p className="mt-2 max-w-md text-sm text-slate-600">
                Try asking about attendance exceptions, employee records, or policy
                readiness.
              </p>
            </div>
          </div>
        ) : null}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${
                message.role === "user"
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {loading ? <p className="text-sm text-slate-500">Thinking...</p> : null}
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void sendMessage();
              }
            }}
            className="field"
            placeholder="Ask the copilot"
          />
          <button
            type="button"
            onClick={sendMessage}
            className="rounded-md bg-brand-600 p-3 text-white transition hover:bg-brand-700"
            aria-label="Send message"
          >
            <SendHorizonal aria-hidden="true" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
