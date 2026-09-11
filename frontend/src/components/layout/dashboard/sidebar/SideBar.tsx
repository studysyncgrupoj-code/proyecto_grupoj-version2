import { auth } from '@/auth';

export default async function SideBar() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-white">
      <div className="w-full max-w-xl rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
        <h1 className="mb-4 text-xl font-bold text-cyan-400">
          Inspección de la Sesión (Auth.js)
        </h1>

        <p className="mb-2 text-sm text-slate-300">
          Esto es lo que contiene actualmente la función{' '}
          <code className="rounded bg-slate-900 px-2 py-1 text-green-400">
            auth()
          </code>
          :
        </p>

        {/* Imprimimos el objeto completo formateado como JSON */}
        <pre className="max-h-96 overflow-auto rounded-lg border border-slate-900 bg-black p-4 font-mono text-xs text-green-400">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </main>
  );
}
