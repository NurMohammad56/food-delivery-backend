import BrandLogo from "../branding/BrandLogo";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/70 bg-white/60 backdrop-blur-xl">
      <div className="container-page py-8">
        <div className="flex flex-col gap-6 rounded-[28px] border border-white/60 bg-white/70 px-6 py-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <BrandLogo title="NUB Canteen Hub" subtitle="Campus pickup, timed right" />
          <div className="text-sm text-slate-500 sm:text-right">
            <p>Copyright 2026 NUB Campus Food Delivery System.</p>
            <p className="mt-1">Built for students, canteen staff.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
