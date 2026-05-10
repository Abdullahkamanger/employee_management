// 1. Make sure it's an async function if you're using 'await auth()'
import { auth } from "@/lib/auth";
import SessionClientInfo from "@/components/ClientSession";
// 2. CRITICAL: It must say "export default"
export default async function CheckSessionPage() {
  const session = await auth();

  return (
    
    <div className="p-10 bg-slate-950 min-h-screen text-white">

 





      <h1 className="text-2xl font-bold mb-5">Session Checker</h1>
      
      <div className="grid gap-8">
        <div>
          <h2 className="text-blue-400">Server Side:</h2>
          <pre className="bg-black p-4 rounded border border-white/10">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-green-400">Client Side:</h2>
          <SessionClientInfo />
        </div>
      </div>
    </div>
  );
}