import { Outlet } from "react-router-dom";
import BrandLogo from "../../components/branding/BrandLogo";
import vegetablesImage from "../../assets/vegetables.png";
import carrotImage from "../../assets/Gajor.png";

export default function AdminAuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src={vegetablesImage}
            alt=""
            aria-hidden="true"
            className="absolute bottom-4 left-[52%] h-[28rem] w-[28rem] -translate-x-1/2 object-contain opacity-[0.22]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(32,33,90,0.84)_0%,rgba(32,33,90,0.76)_46%,rgba(32,33,90,0.58)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(114,126,217,0.28),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(2,154,87,0.14),transparent_34%)]" />
          <div className="relative flex h-full flex-col justify-between p-12">
            <div>
              <BrandLogo
                to="/"
                title="NUB Canteen Hub"
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

        <div className="relative flex items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-12">
          <div className="relative z-10 w-full max-w-md">
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
