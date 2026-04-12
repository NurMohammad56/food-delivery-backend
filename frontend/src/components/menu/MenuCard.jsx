import { Link } from 'react-router-dom';
import { currency } from '../../lib/utils';

const asText = (value, fallback = '') => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const getCategoryLabel = (category) => {
  if (!category) return 'Uncategorized';
  if (typeof category === 'string') return category;
  if (typeof category === 'object' && category.name) return asText(category.name, 'Uncategorized');
  return 'Uncategorized';
};

const getNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function MenuCard({ item, onAdd, disabled }) {
  const itemName = asText(item?.name, 'Menu item');
  const itemDescription = asText(item?.description, 'No description available');
  const categoryLabel = getCategoryLabel(item?.category);
  const preparationTime = getNumber(item?.preparationTime);
  const price = getNumber(item?.price);

  return (
    <div className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft">
      <div className="relative aspect-[4/3] bg-slate-100">
        {item?.imageUrl ? (
          <img src={item.imageUrl} alt={itemName} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-100 via-white to-emerald-50 text-center text-sm text-slate-500">
            <div className="space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">🍱</div>
              <p>No image available</p>
            </div>
          </div>
        )}
        <div className="absolute left-4 top-4">
          <span className="pill bg-white/90 text-slate-700">{preparationTime} min</span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-slate-900">{itemName}</p>
            <p className="mt-1 text-sm text-slate-500">{categoryLabel}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item?.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {item?.isAvailable ? 'Available' : 'Out'}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-600">{itemDescription}</p>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Price</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{currency(price)}</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/menu/${item?._id}`} className="btn-secondary">Details</Link>
            <button disabled={disabled || !item?.isAvailable} onClick={() => onAdd(item)} className="btn-primary">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
