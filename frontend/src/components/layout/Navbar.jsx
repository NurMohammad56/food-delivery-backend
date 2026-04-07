import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import BrandLogo from "../branding/BrandLogo";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

const navClass = ({ isActive }) =>
  isActive
    ? "rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg"
    : "rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-950";

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = useMemo(() => {
    if (isAdmin) {
      return [{ to: "/admin", label: "Dashboard" }];
    }

    const items = [{ to: "/", label: "Menu" }];

    if (isAuthenticated) {
      items.push(
        { to: "/cart", label: `Cart (${itemCount})` },
        { to: "/orders", label: "Orders" },
        { to: "/profile", label: "Profile" },
      );
    }

    return items;
  }, [isAdmin, isAuthenticated, itemCount]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="container-page py-3">
        <div className="flex items-center justify-between gap-4 rounded-[28px] border border-white/60 bg-white/70 px-4 py-3 shadow-soft">
          <BrandLogo
            to={isAdmin ? "/admin" : "/"}
            title="NUB Canteen Hub"
            subtitle="Northern University Bangladesh"
          />

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={navClass}
              >
                {item.label}
              </NavLink>
            ))}
            {isAdmin ? (
              <Link
                to="/"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 hover:bg-white hover:text-slate-950"
              >
                Public site
              </Link>
            ) : null}
          </nav>

          {isAuthenticated ? (
            <div className="hidden items-center gap-3 sm:flex">
              <div className="rounded-full border border-white/80 bg-white px-4 py-2 text-right shadow-sm">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.name}
                </p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  {user?.role}
                </p>
              </div>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Create account
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-700 lg:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? "x" : "="}
          </button>
        </div>

        {menuOpen ? (
          <div className="mt-3 card p-4 lg:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    isActive
                      ? "rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
                      : "rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}

              {isAdmin ? (
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Public site
                </Link>
              ) : null}

              {isAuthenticated ? (
                <>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {user?.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      {user?.role}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="btn-secondary w-full"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="btn-primary w-full"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
