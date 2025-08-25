import React, { useState, useImperativeHandle, forwardRef } from "react";
import axios from "axios";
import { MessageCircle } from "lucide-react";

const AIChatbot = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [messages, setMessages] = useState([
    { role: "system", content: "👋 Hi! I’m Grokart’s AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    openWithMessage: (userId, message) => {
      setOpen(true);
      handleSend(message, userId);
    },
  }));

  const handleSend = async (customMessage, userId = "123") => {
    const finalMessage = customMessage || input;
    if (!finalMessage.trim()) return;

    const newMessages = [...messages, { role: "user", content: finalMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("https://grokart-2.onrender.com/api/v1/ai/chat", {
        userId: user._id,
        message: finalMessage,
      });

      setMessages([
        ...newMessages,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="flex flex-col w-80 h-[28rem] border rounded-2xl shadow-xl bg-white">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-green-600 text-white font-bold text-lg rounded-t-2xl">
            Grokart Support
            <button onClick={() => setOpen(false)} className="text-sm">✖</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
                    msg.role === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-500 text-sm italic">AI is typing...</div>}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t flex items-center gap-2">
            <input
              type="text"
              className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={() => handleSend()}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-xl text-sm font-medium"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default AIChatbot;
