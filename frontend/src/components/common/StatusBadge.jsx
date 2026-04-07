import { classNames, statusTone } from '../../lib/utils';

export default function StatusBadge({ status }) {
  return (
    <span className={classNames('inline-flex rounded-full px-3 py-1 text-xs font-semibold shadow-sm', statusTone[status] || 'bg-slate-100 text-slate-700')}>
      {status}
    </span>
  );
}
