import { currency } from '../../lib/utils';

export default function CartRow({ item, onQuantityChange, onRemove }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-100">
          {item.menuItem?.imageUrl ? <img src={item.menuItem.imageUrl} alt={item.name} className="h-full w-full object-cover" /> : null}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{item.name}</h3>
          <p className="text-sm text-slate-500">Unit price: {currency(item.price)}</p>
          <p className="text-sm font-medium text-slate-700">Subtotal: {currency(item.subtotal)}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-xl border border-slate-300">
          <button onClick={() => onQuantityChange(item, Math.max(0, item.quantity - 1))} className="px-3 py-2 text-lg">-</button>
          <span className="min-w-10 text-center text-sm font-semibold">{item.quantity}</span>
          <button onClick={() => onQuantityChange(item, Math.min(10, item.quantity + 1))} className="px-3 py-2 text-lg">+</button>
        </div>
        <button onClick={() => onRemove(item)} className="btn-danger">Remove</button>
      </div>
    </div>
  );
}
