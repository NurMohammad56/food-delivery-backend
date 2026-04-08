import { Outlet } from "react-router-dom";
import BrandLogo from "../../components/branding/BrandLogo";
import vegetablesImage from "../../assets/vegetables.png";
import carrotImage from "../../assets/Gajor.png";

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
      <div className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <img
          src={vegetablesImage}
          alt=""
          aria-hidden="true"
          className="absolute bottom-4 left-[52%] h-[28rem] w-[28rem] -translate-x-1/2 object-contain opacity-[0.22]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(32,33,90,0.84)_0%,rgba(32,33,90,0.76)_46%,rgba(32,33,90,0.58)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(114,126,217,0.28),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(2,154,87,0.14),transparent_34%)]" />
        <div className="relative">
          <BrandLogo
            to="/"
            title="NUB Canteen Hub"
            subtitle="Campus food delivery"
            theme="light"
            size="lg"
          />
          <h1 className="mt-12 max-w-lg text-5xl font-semibold leading-tight tracking-tight">
            A warmer campus ordering experience for students and operators.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/75">
            Browse the daily menu, place pickup orders in minutes, and move
            admin operations into a calmer, more reliable dashboard flow.
          </p>
        </div>
        <p className="relative text-sm uppercase tracking-[0.24em] text-white/60">
          Northern University Bangladesh
        </p>
      </div>
      <div className="relative flex items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-12">
        <img
          src={carrotImage}
          alt=""
          aria-hidden="true"
          className="absolute bottom-[-1.5rem] right-[-2rem] hidden w-[340px] max-w-none object-contain opacity-[0.95] lg:block"
        />
        <div className="relative z-10 w-full max-w-md">
          <BrandLogo
            to="/"
            title="NUB Canteen Hub"
            subtitle="Frontend portal"
            className="mb-8"
          />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
