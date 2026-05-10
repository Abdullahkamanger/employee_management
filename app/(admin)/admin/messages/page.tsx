"use client";

import { useState, useEffect } from "react";
import { getAdminConversations, markAsRead } from "@/lib/message-actions";
import { User, MessageSquare, Clock, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const res = await getAdminConversations();
    if (res.success) {
      setConversations(res.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-purple-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white">Employee Communications</h1>
        <p className="text-slate-400 mt-2">Manage inquiries and support requests from your team.</p>
      </div>

      <div className="grid gap-4">
        {conversations.length > 0 ? conversations.map((conv) => (
          <Link 
            key={conv._id} 
            href={`/admin/messages/${conv._id}`}
            onClick={() => markAsRead(conv._id)}
            className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-6 hover:bg-white/10 transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                {conv.userDetails.image ? (
                  <img src={conv.userDetails.image} alt={conv.userDetails.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-purple-400" />
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-white text-lg">{conv.userDetails.name}</h3>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Clock size={12} />
                  {new Date(conv.lastDate).toLocaleDateString()}
                </div>
              </div>
              <p className="text-slate-400 text-sm line-clamp-1 italic">"{conv.lastMessage}"</p>
            </div>

            <div className="flex items-center gap-4">
              {conv.unreadCount > 0 && (
                <span className="bg-purple-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  {conv.unreadCount} NEW
                </span>
              )}
              <ChevronRight className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        )) : (
          <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
            <MessageSquare className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500">No messages yet. Communications will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
