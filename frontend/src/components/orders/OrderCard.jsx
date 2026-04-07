import StatusBadge from '../common/StatusBadge';
import { currency, formatDateTime } from '../../lib/utils';

export default function OrderCard({ order, action }) {
  return (
    <div className="card p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</h3>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">Placed on {formatDateTime(order.orderDate)}</p>
          <p className="mt-1 text-sm text-slate-500">Estimated ready {formatDateTime(order.estimatedReadyTime)}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-lg font-bold text-slate-900">{currency(order.totalAmount)}</p>
          <p className="text-sm text-slate-500">{order.items.length} items</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {order.items.map((item) => (
          <div key={`${order._id}-${item.menuItem?._id || item.name}`} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
            <span className="font-medium text-slate-700">{item.name} x {item.quantity}</span>
            <span className="text-slate-500">{currency(item.subtotal)}</span>
          </div>
        ))}
      </div>

      {order.specialInstructions ? <p className="mt-4 text-sm text-slate-600"><span className="font-semibold">Instructions:</span> {order.specialInstructions}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
