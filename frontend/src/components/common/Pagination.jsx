export default function Pagination({ page = 1, pages = 1, onPageChange, className = '', alwaysShow = false }) {
  const totalPages = Math.max(1, pages || 1);

  if (!alwaysShow && totalPages <= 1) return null;

  const buildPages = () => {
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  };

  const visiblePages = buildPages();

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 ${className}`}>
      <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="btn-secondary !px-4 !py-2 disabled:cursor-not-allowed disabled:opacity-50">
          Previous
        </button>
        {visiblePages.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onPageChange(value)}
            className={value === page ? 'btn-primary !px-4 !py-2' : 'btn-secondary !px-4 !py-2'}
          >
            {value}
          </button>
        ))}
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="btn-secondary !px-4 !py-2 disabled:cursor-not-allowed disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  );
}
