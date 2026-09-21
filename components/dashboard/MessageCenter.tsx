"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { sendMessage, getConversation, markAsRead } from "@/lib/message-actions";
import { Send, Loader2, User as UserIcon, Check, CheckCheck } from "lucide-react";
import { toast } from "sonner";

export default function MessageCenter({ targetUserId, currentUserId, title = "Chat" }: { targetUserId: string, currentUserId: string, title?: string }) {
  type Message = {
    sender: string;
    receiver: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
  };
  const [messages, setMessages] = useState<Partial<Message>[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);


  const fetchMessages = useCallback(async () => {
    const res = await getConversation(targetUserId);
    if (res.success) {
      setMessages(res.data);
    }
    setFetching(false);
  }, [targetUserId])


  useEffect(() => {
    const loadMesages = async () => {
      await fetchMessages();
    }
    loadMesages();
    markAsRead(targetUserId); // Mark incoming messages as read on mount
    const interval = setInterval(() => {
      fetchMessages();
      markAsRead(targetUserId); // Keep marking incoming as read
    }, 5000);

    return () => clearInterval(interval);
  }, [targetUserId, fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);



  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const res = await sendMessage(targetUserId, content);
    if (res.success) {
      setContent("");
      fetchMessages();
    } else {
      toast.error(res.error || "Failed to send message");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
      <div className="p-6 border-b border-white/5 flex items-center gap-4 bg-white/5">
        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
          <UserIcon size={20} className="text-purple-400" />
        </div>
        <div>
          <h2 className="font-bold text-white">{title}</h2>
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Active
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {fetching ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-purple-400" />
          </div>
        ) : messages.length > 0 ? (
          messages.map((m, i) => {
            const isMe = m.sender === currentUserId;
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm relative group ${isMe ? 'bg-green-900 text-white rounded-tr-none' : 'bg-white/10 text-white-200 rounded-tl-none'
                  }`}>
                  {m.content}
                  <div className={`flex items-center gap-1 mt-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <p className={`text-[10px] opacity-50 ${isMe ? 'text-right' : 'text-left'}`}>
                      {m.createdAt ? (
                        new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      ) : (
                        "Unknown time"
                      )}
                    </p>
                    {isMe && (
                      <div className="flex items-center ml-1 -space-x-1">
                        {m.isRead ? (
                          <CheckCheck size={14} strokeWidth={5} className="text-sky-500" />
                        ) : (
                          <Check size={14} strokeWidth={5} className="text-white-500/60" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-slate-500 py-20 italic">
            No messages yet.
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-6 bg-white/5 border-t border-white/5 flex gap-4">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-700"
        />
        <button
          disabled={loading || !content.trim()}
          className="bg-white text-slate-900 p-3 rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}
