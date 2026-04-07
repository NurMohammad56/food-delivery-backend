import { currency } from '../../lib/utils';

export default function CartRow({ item, onQuantityChange, onRemove }) {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-white/70 bg-white/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-[22px] bg-slate-100">
          {item.menuItem?.imageUrl ? (
            <img src={item.menuItem.imageUrl} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl">🍱</div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{item.name}</h3>
          <p className="text-sm text-slate-500">Unit price: {currency(item.price)}</p>
          <p className="text-sm font-medium text-slate-700">Subtotal: {currency(item.subtotal)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-slate-200 bg-white px-1 py-1 shadow-sm">
          <button onClick={() => onQuantityChange(item, Math.max(0, item.quantity - 1))} className="h-10 w-10 rounded-full text-lg hover:bg-slate-100">-</button>
          <span className="min-w-10 text-center text-sm font-semibold">{item.quantity}</span>
          <button onClick={() => onQuantityChange(item, Math.min(10, item.quantity + 1))} className="h-10 w-10 rounded-full text-lg hover:bg-slate-100">+</button>
        </div>
        <button onClick={() => onRemove(item)} className="btn-danger">Remove</button>
      </div>
    </div>
  );
}
