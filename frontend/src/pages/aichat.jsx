import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
// import api from "../api/axios"; // will be used once backend is ready

function AiChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I'm ThreatShield AI. Ask me anything about cybersecurity threats, how to stay safe online, or how to use this platform.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // ---- TEMPORARY DUMMY AI RESPONSE (remove once real backend is ready) ----
    setTimeout(() => {
      const dummyResponses = [
        "That's a great question! To protect yourself online, I recommend: **Enable 2FA** on all accounts, **Use strong passwords** with special characters, and **Keep software updated**. Would you like specific guidance on any of these?",
        "Phishing emails often contain urgency cues and requests for personal data. **Red flags to watch for:** Misspelled sender addresses, suspicious links, and vague greetings like 'Dear Customer'. Always verify sender identity before clicking links.",
        "If you suspect a breach: **1.** Change your password immediately **2.** Enable 2FA if available **3.** Monitor your accounts for unauthorized activity **4.** Consider credit monitoring. Would you like help with any of these steps?",
        "Malware can spread through downloads, email attachments, and compromised websites. **Prevention tips:** Use antivirus software, avoid clicking unknown links, download only from official sources, and keep your OS updated.",
        "A strong password should be at least 12 characters, include uppercase and lowercase letters, numbers, and special symbols. Avoid dictionary words and personal information. Consider using a **password manager** to store complex passwords securely.",
      ];
      const randomResponse =
        dummyResponses[Math.floor(Math.random() * dummyResponses.length)];

      const aiMessage = {
        id: messages.length + 2,
        sender: "ai",
        text: randomResponse,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
    // --------------------------------------------------------------------------

    /* REAL VERSION (use this once Harshil's backend is ready):
    try {
      const response = await api.post("/chat", { message: input });
      const aiMessage = {
        id: messages.length + 2,
        sender: "ai",
        text: response.data.reply,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Chat failed:", err);
    } finally {
      setIsTyping(false);
    }
    */
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col h-screen">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-slate-800">💬 AI Chat</h1>
          <p className="text-slate-600 text-sm">
            Ask me anything about cybersecurity threats and how to stay safe
          </p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 bg-white rounded-xl shadow p-4 mb-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-orange-500 text-white rounded-br-none"
                    : "bg-slate-100 text-slate-800 rounded-bl-none"
                }`}
              >
                {msg.sender === "ai" ? (
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p className="mb-2 last:mb-0" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold" {...props} />
                      ),
                      em: ({ node, ...props }) => (
                        <em className="italic" {...props} />
                      ),
                      code: ({ node, inline, ...props }) =>
                        inline ? (
                          <code
                            className="bg-slate-200 px-1 rounded text-xs"
                            {...props}
                          />
                        ) : (
                          <code
                            className="block bg-slate-200 px-2 py-1 rounded text-xs my-2 overflow-x-auto"
                            {...props}
                          />
                        ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc list-inside mb-2" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal list-inside mb-2" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="mb-1" {...props} />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  <p>{msg.text}</p>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-100 text-slate-800 px-4 py-2 rounded-lg rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="flex gap-2 bg-white rounded-xl shadow p-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about cybersecurity..."
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default AiChat;