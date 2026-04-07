import { Link, Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <div className="hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-500 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold">NUB</div>
          <h1 className="mt-10 max-w-md text-4xl font-bold leading-tight">Smarter campus ordering for students and canteen staff.</h1>
          <p className="mt-5 max-w-md text-sm text-white/80">Place orders in advance, reduce queue time, and manage daily canteen operations from a single responsive system.</p>
        </div>
        <p className="text-sm text-white/70">Northern University Bangladesh • Academic Project Delivery</p>
      </div>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-sm font-bold text-white">NUB</div>
            <div>
              <p className="font-semibold text-slate-900">Campus Food Delivery</p>
              <p className="text-xs text-slate-500">Frontend portal</p>
            </div>
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
