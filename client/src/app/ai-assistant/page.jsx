"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import axios from 'axios';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your BharatBenefit Assistant. Tell me about yourself (e.g., "I am a female student from UP with family income under 2 lakhs") and I will find the best schemes for you.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('bharatbenefit_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const saved = localStorage.getItem('bharatbenefit_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name) setUserProfile(parsed);
      } catch (e) {}
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', { 
        messages: newMessages,
        profile: userProfile
      });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: response.data.reply 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'Sorry, I am having trouble connecting to the server. Please make sure the backend is running.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto pt-24 pb-8 px-4 h-screen flex flex-col">
        <div className="bg-white border rounded-3xl shadow-sm flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b flex items-center justify-between bg-primary/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                <Bot size={24} />
              </div>
              <div>
                <h2 className="font-bold">Bharat AI Guide</h2>
                <p className="text-xs text-muted-foreground flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                  Online | Powered by Gemini
                </p>
              </div>
            </div>
            <Sparkles size={20} className="text-primary animate-pulse" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] flex space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      m.role === 'user' ? 'bg-slate-200' : 'bg-primary text-white'
                    }`}>
                      {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="max-w-[80%] flex space-x-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary text-white">
                      <Loader2 size={16} className="animate-spin" />
                    </div>
                    <div className="p-4 rounded-2xl text-sm leading-relaxed bg-slate-100 text-slate-800 rounded-tl-none">
                      Thinking...
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-center space-x-2 bg-slate-50 border rounded-2xl px-4 py-2 focus-within:ring-2 ring-primary/20 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about scholarships, documents, or eligibility..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2"
              />
              <button 
                onClick={handleSend}
                className="p-2 bg-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase font-bold tracking-widest">
              AI can make mistakes. Please verify important details.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
