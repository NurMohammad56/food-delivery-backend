export default function Toast({ message, tone = 'info' }) {
  const toneClass = tone === 'error' ? 'bg-rose-600' : 'bg-slate-900';
  return (
    <div className={`${toneClass} fixed bottom-6 right-6 z-50 rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-soft`}>
      {message}
    </div>
  );
}
