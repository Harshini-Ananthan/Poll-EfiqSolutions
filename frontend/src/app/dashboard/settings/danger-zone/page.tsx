export default function DangerZonePage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-2">Danger zone</h1>
        <p className="text-gray-400 text-sm">High-impact account actions will be available here.</p>
      </div>

      <section className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <p className="text-sm text-red-300">Danger zone actions are not configured yet.</p>
      </section>
    </div>
  );
}
