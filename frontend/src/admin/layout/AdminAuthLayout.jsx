import { Outlet } from "react-router-dom";
import BrandLogo from "../../components/branding/BrandLogo";

export default function AdminAuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.02fr_0.98fr]">
        <div className="relative hidden overflow-hidden lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.36),transparent_24%),radial-gradient(circle_at_center_right,rgba(20,184,166,0.28),transparent_30%)]" />
          <div className="relative flex h-full flex-col justify-between p-12">
            <div>
              <BrandLogo
                to="/"
                title="BentoNUB Canteen HubBox"
                subtitle="Admin access"
                theme="light"
                size="lg"
              />
              <h1 className="mt-12 max-w-xl text-5xl font-semibold tracking-tight">
                A separate login and workspace for canteen operations.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-white/72">
                Admin access stays isolated from the student flow. Use this
                route only for orders, menu control, user roles, and reporting.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">
            <BrandLogo
              to="/"
              title="NUB Canteen Hub"
              subtitle="Admin portal"
              theme="light"
              className="mb-8 lg:hidden"
            />
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
