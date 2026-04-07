export const currency = (value = 0) => new Intl.NumberFormat('en-BD', {
  style: 'currency',
  currency: 'BDT',
  maximumFractionDigits: 0,
}).format(value);

export const formatDateTime = (value) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

export const classNames = (...items) => items.filter(Boolean).join(' ');

export const statusTone = {
  Pending: 'bg-amber-100 text-amber-700',
  Preparing: 'bg-sky-100 text-sky-700',
  Ready: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-slate-200 text-slate-700',
  Cancelled: 'bg-rose-100 text-rose-700',
};
