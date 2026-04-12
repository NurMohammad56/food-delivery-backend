import StatusBadge from '../common/StatusBadge';
import { currency, formatDateTime } from '../../lib/utils';

export default function OrderCard({ order, action }) {
  const studentName = order.customerName || order.user?.name || "-";
  const studentId = order.customerStudentId || order.user?.studentId || "-";
  const studentPhone = order.customerPhone || order.user?.phone || "-";
  const studentEmail = order.customerEmail || order.user?.email || "-";
  const pickupCode = order.pickupCode || "-";
  const deliveryAddress = order.deliveryAddress || "Not provided";

  return (
    <div className="card p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Order #{order._id.slice(-6).toUpperCase()}</h3>
            <StatusBadge status={order.status} />
            {pickupCode !== "-" ? (
              <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                Code {pickupCode}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-500">Placed on {formatDateTime(order.orderDate)}</p>
          <p className="mt-1 text-sm text-slate-500">Estimated ready {formatDateTime(order.estimatedReadyTime)}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-lg font-bold text-slate-900">{currency(order.totalAmount)}</p>
          <p className="text-sm text-slate-500">{order.items.length} items</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Student</p>
          <p className="mt-2 font-medium text-slate-800">{studentName}</p>
          <p className="mt-1 text-slate-500">ID: {studentId}</p>
          <p className="mt-1 text-slate-500">Phone: {studentPhone}</p>
          <p className="mt-1 break-all text-slate-500">Email: {studentEmail}</p>
        </div>
        <div className="rounded-2xl bg-brand-50 px-4 py-3 text-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-brand-500">Pickup verification</p>
          <p className="mt-2 font-medium text-slate-800">
            Ask the student for the pickup code before handoff.
          </p>
          <p className="mt-2 text-lg font-semibold text-brand-700">{pickupCode}</p>
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

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
        <span className="font-semibold">Address:</span>{" "}
        <span className="break-words">{deliveryAddress}</span>
      </div>
      {order.specialInstructions ? <p className="mt-4 text-sm text-slate-600"><span className="font-semibold">Instructions:</span> {order.specialInstructions}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
