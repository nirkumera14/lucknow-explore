import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiZap, FiUser, FiCpu, FiTrash2 } from 'react-icons/fi';

const SUGGESTED_QUERIES = [
  '2-day itinerary for Lucknow with historical focus',
  'Best places to eat Awadhi food in Lucknow',
  'Family-friendly places to visit in Lucknow',
  'Budget travel guide for Lucknow',
  'Evening activities in Lucknow',
];

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    content: `🙏 **Adab! Welcome to Lucknow Explore AI Planner!**

I'm your personal AI travel guide for the **City of Nawabs**. I can help you:

- 🗓️ **Plan custom itineraries** based on your duration and interests
- 🏛️ **Recommend places** tailored to your preferences  
- 🍢 **Discover Awadhi cuisine** and the best dining spots
- 💡 **Share insider tips** for a memorable Lucknow experience
- 📅 **Find events** happening during your visit

What would you like to explore today? Tell me how many days you have and what interests you most!`
  }
];

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-gold-500/20 border border-gold-500/30' : 'bg-purple-500/20 border border-purple-500/30'}`}>
        {isUser ? <FiUser className="text-gold-400" size={14} /> : <FiCpu className="text-purple-400" size={14} />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? 'bg-gold-500/15 border border-gold-500/20 text-white' : 'glass border border-white/10 text-white/85'}`}>
        <div className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{
            __html: msg.content
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gold-400">$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/^- (.*)/gm, '<li class="ml-3">• $1</li>')
              .replace(/^# (.*)/gm, '<h3 class="font-display text-lg font-bold text-gold-400 mt-2">$1</h3>')
              .replace(/^## (.*)/gm, '<h4 class="font-semibold text-gold-300 mt-2">$1</h4>')
          }}
        />
        {msg.loading && (
          <div className="flex gap-1 mt-2">
            {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function AIPlanner() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');

    const userMessage = { role: 'user', content: userMsg };
    const loadingMessage = { role: 'assistant', content: '', loading: true };
    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setLoading(true);

    try {
      const apiMessages = [...messages, userMessage].map(m => ({ role: m.role, content: m.content }));
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are an expert AI travel guide for Lucknow, India — the City of Nawabs. You specialize in:
- Tourist places: Bara Imambara, Chota Imambara, Rumi Darwaza, Hazratganj, Gomti Riverfront, Ambedkar Memorial Park, The Residency, Marine Drive, Aminabad, Lulu Mall
- Awadhi cuisine: Tunday Kababi, Basket Chaat, Makhan Malai, Dum Biryani, Sheermal, Roomali Roti, Kulfi
- Cultural experiences, events, history of Lucknow
- Hotels, restaurants, local experiences

Give practical, enthusiastic, well-structured advice. Use markdown formatting with headers and bullet points. Include specific timings, entry fees, and tips when relevant. Always end with an offer to help further.`,
          messages: apiMessages
        })
      });

      const data = await response.json();
      const aiContent = data.content?.[0]?.text || "I'm having trouble responding right now. Please try again!";

      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = { role: 'assistant', content: aiContent };
        return newMsgs;
      });
    } catch {
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = { role: 'assistant', content: "Sorry, I'm unable to connect right now. Please check your connection and try again." };
        return newMsgs;
      });
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => setMessages(INITIAL_MESSAGES);

  return (
    <div className="min-h-screen pt-20 pb-4 flex flex-col px-4">
      <div className="max-w-3xl w-full mx-auto flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between py-4 mb-4">
          <div>
            <h1 className="font-display text-2xl font-bold gold-text flex items-center gap-2"><FiZap /> AI Travel Planner</h1>
            <p className="text-white/45 text-sm">Powered by Claude AI · Plan your perfect Lucknow trip</p>
          </div>
          <button onClick={clearChat} className="glass rounded-xl p-2.5 text-white/50 hover:text-red-400 transition-all" title="Clear chat">
            <FiTrash2 size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 glass rounded-2xl gold-border p-4 mb-4 overflow-y-auto space-y-4 min-h-[400px] max-h-[60vh]">
          {messages.map((msg, i) => <Message key={i} msg={msg} />)}
          <div ref={bottomRef} />
        </div>

        {/* Suggested Queries */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTED_QUERIES.map(q => (
              <button key={q} onClick={() => sendMessage(q)}
                className="text-xs px-3 py-2 glass gold-border rounded-xl text-white/60 hover:text-gold-400 hover:border-gold-500/40 transition-all text-left">
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about places, food, itineraries..."
            disabled={loading}
            className="input-dark flex-1"
          />
          <button type="submit" disabled={!input.trim() || loading}
            className="btn-gold px-5 py-3 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
            <FiSend size={16} />
          </button>
        </form>
        <p className="text-white/25 text-xs text-center mt-2">AI responses are for guidance only. Verify timings and prices locally.</p>
      </div>
    </div>
  );
}
