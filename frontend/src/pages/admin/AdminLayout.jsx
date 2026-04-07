import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/menu', label: 'Menu Management' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/reports', label: 'Reports' },
];

export default function AdminLayout() {
  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-600">Administration Panel</p>
          <h1 className="section-title mt-1">Canteen operations dashboard</h1>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="card h-fit p-4">
          <nav className="space-y-2">
            {links.map((item) => (
              <NavLink key={item.to} end={item.end} to={item.to} className={({ isActive }) => `block rounded-xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section>
          <Outlet />
        </section>
      </div>
    </div>
  );
}
