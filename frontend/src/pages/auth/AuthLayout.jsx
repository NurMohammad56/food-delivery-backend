import { Outlet } from 'react-router-dom';
import BrandLogo from '../../components/branding/BrandLogo';

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
      <div className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.4),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.28),transparent_32%)]" />
        <div className="relative">
          <BrandLogo to="/" title="BentoBox" subtitle="Campus food delivery" theme="light" size="lg" />
          <h1 className="mt-12 max-w-lg text-5xl font-semibold leading-tight tracking-tight">A warmer campus ordering experience for students and operators.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/75">Browse the daily menu, place pickup orders in minutes, and move admin operations into a calmer, more reliable dashboard flow.</p>
        </div>
        <p className="relative text-sm uppercase tracking-[0.24em] text-white/60">Northern University Bangladesh / Academic Project Delivery</p>
      </div>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
        <div className="w-full max-w-md">
          <BrandLogo to="/" title="BentoBox" subtitle="Frontend portal" className="mb-8" />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
