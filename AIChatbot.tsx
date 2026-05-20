import React, { useState, useRef, useEffect } from "react";
import { type ChatMessage } from "../types";
import { Send, Sparkles, MessageSquare, X, Shield, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playHorologySound } from "./CanvasWatch";

export default function AIChatbot({ themeColor = "#C5A059" }: { themeColor?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "concierge",
      text: "Greetings. I am the Aetheris Horology Concierge, your bespoke AI advisor. I stand ready to assist you in exploring our high-frequency calibers, aerospace titanium structures, and customized mechanical configurations. How may I guide your journey into haute horlogerie today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    playHorologySound("click");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    playHorologySound("tick");

    try {
      // Direct POST to Server API endpoint (Gemini API server-side proxy)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputText,
          history: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "model",
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Conduit connection compromised");
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "concierge",
        text: data.reply || "My apologies, the digital clock-conduits are currently fluctuating. How can I assist you otherwise?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      const systemErrorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "system",
        text: "CONDUIT STATUS: Offline. Please verify that your local Gemini API Key has been configured inside the AI Studio Secrets panel.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, systemErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Speaks assistant messages using the browser TTS API
  const handleSpeak = (text: string) => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.95;
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
      playHorologySound("tick");
    } catch (err) {
      // Sound system not initialized / supported
    }
  };

  return (
    <>
      {/* Floating Launcher Action Indicator with sharp design */}
      <motion.button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-none border border-[#C5A059]/40 shadow-2xl bg-black/90 hover:bg-[#C5A059]/10 backdrop-blur-md cursor-pointer group"
        whileHover={{ scale: 1.05 }}
        style={{
          boxShadow: `0 0 25px -5px ${themeColor}40`,
        }}
      >
        <div className="absolute inset-0 border border-[#C5A059]/10 animate-pulse" />
        <MessageSquare className="w-5 h-5 text-[#C5A059] group-hover:rotate-12 transition-transform duration-300" />
      </motion.button>

      {/* Bespoke Chat Module Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[500px] rounded-none border border-[#C5A059]/30 shadow-2xl bg-[#050505] flex flex-col overflow-hidden z-[45] select-text backdrop-blur-2xl"
          >
            {/* Header branding info */}
            <div className="p-4 bg-neutral-950 border-b border-[#C5A059]/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="p-1.5 border border-[#C5A059]/35 bg-[#C5A059]/5 text-[#C5A059]"
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs uppercase font-sans font-bold text-[#E0D8D0] tracking-widest flex items-center gap-1.5">
                    Aetheris Concierge
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                  </h3>
                  <span className="text-[8px] font-sans tracking-widest font-bold text-[#C5A059] block mt-0.5">
                    AI HOROLOGIST ADVISOR
                  </span>
                </div>
              </div>
              <button
                onClick={handleToggle}
                className="p-1.5 border border-[#C5A059]/20 bg-[#C5A059]/5 text-[#C5A059] hover:bg-[#C5A059]/10 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Core Panel */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#050505]">
              {messages.map((m) => {
                const isConcierge = m.sender === "concierge";
                const isSystem = m.sender === "system";

                if (isSystem) {
                  return (
                    <div
                      key={m.id}
                      className="border border-red-950/35 bg-red-950/15 p-3 rounded-none flex items-start gap-2 text-red-400"
                    >
                      <Shield className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <div className="text-[10px] font-mono leading-relaxed">
                        {m.text}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-[85%] ${isConcierge ? "self-start" : "self-end items-end"}`}
                  >
                    <div
                      className={`px-3.5 py-2.5 rounded-none text-xs leading-relaxed font-sans ${isConcierge ? "bg-neutral-900/10 border border-[#C5A059]/15 text-[#E0D8D0]" : "text-black font-semibold"}`}
                      style={{
                        backgroundColor: !isConcierge ? themeColor : undefined,
                      }}
                    >
                      {m.text}
                    </div>
                    {/* Utility controls for message */}
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <span className="text-[8px] font-mono text-neutral-500">
                        {m.timestamp}
                      </span>
                      {isConcierge && (
                        <button
                          onClick={() => handleSpeak(m.text)}
                          className="hover:text-white text-neutral-500 transition-colors cursor-pointer"
                          title="Speak Text"
                        >
                          <Volume2 className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="self-start max-w-[80%] flex flex-col gap-1">
                  <div className="bg-neutral-900/10 border border-[#C5A059]/10 p-3 rounded-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce duration-300 [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce duration-300 [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce duration-300" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Submission Terminal */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-neutral-950 border-t border-[#C5A059]/15 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask our Horology AI about calibers, models..."
                className="flex-1 bg-neutral-900/10 border border-[#C5A059]/20 rounded-none px-3.5 py-2 text-xs text-[#E0D8D0] placeholder-neutral-500 focus:outline-none focus:border-[#C5A059]/50 select-text font-sans"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2 rounded-none bg-[#C5A059] hover:bg-[#D4B375] text-black flex items-center justify-center transition-all cursor-pointer disabled:opacity-55"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
