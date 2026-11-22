"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  Send,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  ShieldCheck,
  Bot,
  User,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import {
  queryAssistantChat,
  submitAssistantFeedback,
  type AssistantMessage,
  type AssistantCitation,
} from "@/lib/api";

const QUICK_PROMPTS = [
  "Is NSE open right now?",
  "What is ROCE and why does it matter?",
  "Explain Reliance Industries fundamentals",
  "Summarize today's top banking news",
  "How do I use the stock screener?",
];

export default function FloatingAssistantChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [feedbackSent, setFeedbackSent] = useState<Record<string, string>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect active symbol from route context
  const activeSymbolMatch = pathname.match(/\/company\/([A-Za-z0-9_]+)/);
  const activeSymbol = activeSymbolMatch ? activeSymbolMatch[1].toUpperCase() : undefined;

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    setInputQuery("");
    setLoading(true);

    // Optimistically add user message
    const tempUserMsg: AssistantMessage = {
      id: `usr_${Date.now()}`,
      conversation_id: conversationId || "temp",
      sender: "user",
      content: textToSend,
      intent: "GENERAL_FINANCE",
      citations: [],
      suggested_prompts: [],
      created_at: new Date().toISOString(),
      model_provider: "User",
      disclaimer: "",
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const response = await queryAssistantChat({
        message: textToSend,
        conversation_id: conversationId,
        context: {
          symbol: activeSymbol,
          route: pathname,
        },
      });

      if (!conversationId) {
        setConversationId(response.conversation_id);
      }
      setMessages((prev) => [...prev, response]);
    } catch (err: any) {
      const errorMsg: AssistantMessage = {
        id: `err_${Date.now()}`,
        conversation_id: conversationId || "err",
        sender: "assistant",
        content: `I encountered an issue retrieving real-time data: ${err.message || "Service temporarily unavailable"}. Please retry or consult our [Platform Documentation](/help).`,
        intent: "GENERAL_FINANCE",
        citations: [],
        suggested_prompts: ["Is NSE open today?", "What is ROCE?"],
        created_at: new Date().toISOString(),
        model_provider: "MarketScope Grounded Research Engine",
        disclaimer: "Non-advisory research assistant.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (msgId: string, rating: "positive" | "negative") => {
    if (feedbackSent[msgId] || !conversationId) return;
    setFeedbackSent((prev) => ({ ...prev, [msgId]: rating }));
    try {
      await submitAssistantFeedback({
        message_id: msgId,
        conversation_id: conversationId,
        rating,
      });
    } catch {
      // Non-blocking telemetry
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    setConversationId(undefined);
  };

  return (
    <>
      {/* ── FLOATING LAUNCHER BUTTON ─────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-2xl shadow-sky-500/30 transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label="Open MarketScope AI Research Assistant"
        >
          <Sparkles size={16} className="text-slate-950 animate-spin-slow" />
          <span className="tracking-wide">AI Assistant</span>
          {activeSymbol && (
            <span className="px-1.5 py-0.5 rounded-full bg-slate-950/20 text-[10px] font-mono font-bold text-slate-950 border border-slate-950/20">
              {activeSymbol}
            </span>
          )}
        </button>
      )}

      {/* ── FLOATING CHAT PANEL ───────────────────────────────────────── */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 ${
            isMinimized
              ? "bottom-6 right-6 w-72 h-14"
              : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[460px] h-[580px] max-h-[85vh]"
          } rounded-3xl bg-[#070D18]/95 border border-slate-700/80 shadow-2xl shadow-black/80 flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-sky-500/20">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 text-xs">MarketScope AI</span>
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Grounded
                  </span>
                </div>
                {activeSymbol && (
                  <p className="text-[10px] text-sky-400 font-mono">Context: {activeSymbol}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              {messages.length > 0 && !isMinimized && (
                <button
                  onClick={handleClearConversation}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg hover:text-rose-400 hover:bg-slate-800/60 transition"
                >
                  <Trash2 size={13} />
                </button>
              )}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimize"}
                className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition"
              >
                {isMinimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Body (only when not minimized) */}
          {!isMinimized && (
            <>
              {/* Message History Viewport */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center px-4 space-y-4 text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-center text-sky-400 shadow-inner">
                      <Bot size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-200 text-sm">Grounded Market Research Assistant</h4>
                      <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                        Ask about market status, exchange holidays, company ratios, financial news, or how to use the platform.
                      </p>
                    </div>

                    {/* Quick Starter Prompts */}
                    <div className="w-full space-y-1.5 pt-2">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold text-left">
                        Suggested Inquiries:
                      </p>
                      {QUICK_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => handleSendMessage(prompt)}
                          className="w-full text-left p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition flex items-center justify-between text-[11px] group"
                        >
                          <span className="truncate pr-2">{prompt}</span>
                          <ArrowRight size={12} className="text-slate-600 group-hover:text-sky-400 transition flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => {
                      const isUser = msg.sender === "user";
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1.5`}
                        >
                          <div
                            className={`max-w-[88%] rounded-2xl p-3.5 ${
                              isUser
                                ? "bg-sky-600 text-white rounded-br-xs shadow-md shadow-sky-600/10 font-medium"
                                : "bg-slate-900/90 text-slate-200 border border-slate-800/90 rounded-bl-xs leading-relaxed"
                            }`}
                          >
                            {/* Message content */}
                            <div className="whitespace-pre-wrap space-y-2 text-[12px]">
                              {msg.content}
                            </div>

                            {/* Citations block for Assistant responses */}
                            {!isUser && msg.citations && msg.citations.length > 0 && (
                              <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                                <span className="text-[10px] font-mono font-bold text-sky-400 flex items-center gap-1">
                                  <ShieldCheck size={11} className="text-emerald-400" /> Grounded Evidence Citations:
                                </span>
                                <div className="space-y-1">
                                  {msg.citations.map((cite) => (
                                    <div
                                      key={cite.citation_id}
                                      className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/60 text-[10px] space-y-0.5"
                                    >
                                      <div className="flex items-center justify-between font-bold text-slate-300">
                                        <span className="truncate pr-1">{cite.title}</span>
                                        <span className="text-[9px] font-mono text-sky-400 flex-shrink-0">
                                          {cite.citation_type}
                                        </span>
                                      </div>
                                      <p className="text-slate-400 line-clamp-2">{cite.snippet}</p>
                                      {cite.url && (
                                        <Link
                                          href={cite.url}
                                          className="text-sky-400 hover:underline flex items-center gap-1 pt-0.5"
                                        >
                                          View source
                                          <ExternalLink size={10} />
                                        </Link>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Assistant Footer with Disclaimer and Feedback */}
                            {!isUser && (
                              <div className="mt-2 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[9px] text-slate-500">
                                <span>{msg.model_provider}</span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleFeedback(msg.id, "positive")}
                                    className={`p-1 rounded hover:text-emerald-400 ${
                                      feedbackSent[msg.id] === "positive" ? "text-emerald-400" : ""
                                    }`}
                                    title="Helpful response"
                                  >
                                    <ThumbsUp size={11} />
                                  </button>
                                  <button
                                    onClick={() => handleFeedback(msg.id, "negative")}
                                    className={`p-1 rounded hover:text-rose-400 ${
                                      feedbackSent[msg.id] === "negative" ? "text-rose-400" : ""
                                    }`}
                                    title="Not helpful"
                                  >
                                    <ThumbsDown size={11} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Suggested Follow-up Prompts */}
                          {!isUser && msg.suggested_prompts && msg.suggested_prompts.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {msg.suggested_prompts.map((p) => (
                                <button
                                  key={p}
                                  onClick={() => handleSendMessage(p)}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/60 text-slate-300 hover:text-white transition"
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {loading && (
                      <div className="flex items-center gap-2 text-slate-400 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 max-w-[80%]">
                        <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                        <span className="text-[11px] font-mono">Synthesizing verified research...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-slate-800 bg-slate-900/70 flex-shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder={
                      activeSymbol
                        ? `Ask about ${activeSymbol}, indicators, or market hours...`
                        : "Ask about markets, ROCE, holidays, news..."
                    }
                    className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl px-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors font-sans"
                  />
                  <button
                    type="submit"
                    disabled={!inputQuery.trim() || loading}
                    className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 transition-colors shadow-md shadow-sky-500/20"
                    title="Send inquiry"
                  >
                    <Send size={14} />
                  </button>
                </form>
                <p className="text-[9px] text-slate-500 text-center pt-1.5 font-sans">
                  Educational research support only · Zero financial advice or order execution
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
