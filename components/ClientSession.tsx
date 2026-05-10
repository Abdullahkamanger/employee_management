"use client";

import { signOut, useSession } from "next-auth/react";

export default function SessionClientInfo() {
  const { data: session, status } = useSession();

  return (
    <div>
       <button onClick={() => signOut()} className="px-4 py-2 bg-red-500 text-white rounded mb-5">
        Sign Out
      </button>
      <div className="mb-4">
        <span className="text-xs uppercase px-2 py-1 bg-slate-800 rounded">
          Status: {status}
        </span>
      </div>
      <pre className="bg-black/50 p-4 rounded overflow-auto max-h-[400px] text-sm text-green-300">
        {session ? JSON.stringify(session, null, 2) : "No session found"}
      </pre>
    </div>
  );
}