export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[160px] items-center justify-center">
      <div className="card flex items-center gap-3 px-5 py-4 text-sm text-slate-600">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        <span>{label}</span>
      </div>
    </div>
  );
}
