import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "../../components/branding/BrandLogo";
import { useAuth } from "../../contexts/AuthContext";

const links = [
  {
    to: "/admin",
    label: "Dashboard",
    end: true,
    description: "Revenue, trends, and operational overview.",
  },
  {
    to: "/admin/orders",
    label: "Orders",
    description: "Track live order flow and update statuses.",
  },
  {
    to: "/admin/menu",
    label: "Menu",
    description: "Control menu items, pricing, and availability.",
  },
  {
    to: "/admin/categories",
    label: "Categories",
    description: "Manage food categories.",
  },
  {
    to: "/admin/users",
    label: "Users",
    description: "Manage user roles and account access.",
  },
  {
    to: "/admin/reports",
    label: "Reports",
    description: "Review performance and export summaries.",
  },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeLink = useMemo(() => {
    return (
      links.find((link) => {
        if (link.end) return pathname === link.to;
        return pathname.startsWith(link.to);
      }) || links[0]
    );
  }, [pathname]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:items-start lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="relative overflow-hidden border-b border-brand-900 bg-brand-900 text-white lg:sticky lg:top-0 lg:h-screen lg:self-start lg:border-b-0 lg:border-r">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(114,126,217,0.34),transparent_30%),radial-gradient(circle_at_82%_14%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(2,154,87,0.2),transparent_34%)]" />
          <div className="relative flex h-full flex-col p-6">
            <div className="flex items-center justify-between gap-4">
              <BrandLogo
                to="/admin"
                title="NUB Canteen Hub"
                subtitle="Admin console"
                theme="light"
              />
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-lg lg:hidden"
                aria-label="Toggle admin navigation"
              >
                {menuOpen ? "x" : "="}
              </button>
            </div>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.28em] text-white/55">
                Logged in as
              </p>
              <p className="mt-3 text-lg font-semibold">{user?.name}</p>
              <p className="mt-1 text-sm text-white/70">{user?.email}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  {user?.role}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                  Ops mode
                </span>
              </div>
            </div>

            <nav
              className={`${menuOpen ? "mt-6 flex" : "hidden"} flex-col gap-2 lg:mt-8 lg:flex`}
            >
              {links.map((item) => (
                <NavLink
                  key={item.to}
                  end={item.end}
                  to={item.to}
                  className={({ isActive }) =>
                    `${isActive ? "admin-nav-link admin-nav-link-active" : "admin-nav-link text-white/75"}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  <div>
                    <p>{item.label}</p>
                    <p className="mt-1 text-xs font-normal tracking-normal text-inherit opacity-70">
                      {item.description}
                    </p>
                  </div>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto hidden gap-3 pt-8 lg:grid">
              <button
                onClick={() => navigate("/")}
                className="btn-secondary w-full !justify-start"
              >
                Open public site
              </button>
              <button
                onClick={handleLogout}
                className="btn-primary w-full !justify-start"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-white/70 bg-white/80 backdrop-blur-xl">
            <div className="container-page py-6">
              <p className="section-kicker">Admin dashboard</p>
              <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                    {activeLink.label}
                  </h1>
                  <p className="section-subtitle max-w-2xl">
                    {activeLink.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 lg:hidden">
                  <button
                    onClick={() => navigate("/")}
                    className="btn-secondary"
                  >
                    Public site
                  </button>
                  <button onClick={handleLogout} className="btn-primary">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="container-page py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
