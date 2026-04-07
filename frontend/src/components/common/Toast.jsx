export default function Toast({ message, tone = 'info' }) {
  const toneClass = tone === 'error' ? 'from-rose-600 to-rose-500' : 'from-slate-950 to-slate-800';
  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-[24px] bg-gradient-to-r ${toneClass} px-4 py-3 text-sm font-medium text-white shadow-soft`}>
      {message}
    </div>
  );
}
