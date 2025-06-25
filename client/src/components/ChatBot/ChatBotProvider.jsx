import React, { createContext, useContext, useState } from 'react';

const ChatBotContext = createContext();

export function useChatBot() {
  return useContext(ChatBotContext);
}

export function ChatBotProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    setMessages((msgs) => [...msgs, { sender: 'user', text }]);
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: 'ai', text: data.text }]);
    } catch {
      setMessages((msgs) => [...msgs, { sender: 'ai', text: "Sorry, I couldn't connect to the AI." }]);
    }
    setLoading(false);
  };

  return (
    <ChatBotContext.Provider value={{ open, setOpen, messages, sendMessage, loading }}>
      {children}
    </ChatBotContext.Provider>
  );
}