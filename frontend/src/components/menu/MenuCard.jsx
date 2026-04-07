import { Link } from 'react-router-dom';
import { currency } from '../../lib/utils';

export default function MenuCard({ item, onAdd, disabled }) {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[4/3] bg-slate-100">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">No image available</div>
        )}
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-slate-900">{item.name}</p>
            <p className="mt-1 text-sm text-slate-500">{item.category?.name || item.category}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{item.preparationTime} min</span>
        </div>
        <p className="line-clamp-2 text-sm text-slate-600">{item.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-slate-900">{currency(item.price)}</p>
            <p className={`text-xs font-medium ${item.isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
              {item.isAvailable ? 'Available now' : 'Out of stock'}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/menu/${item._id}`} className="btn-secondary">Details</Link>
            <button disabled={disabled || !item.isAvailable} onClick={() => onAdd(item)} className="btn-primary">Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}
