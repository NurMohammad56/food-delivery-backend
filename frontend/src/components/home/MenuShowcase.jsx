import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { currency } from '../../lib/utils';

export default function MenuShowcase({ items = [], onAdd }) {
  const featured = useMemo(() => items.slice(0, 5), [items]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (featured.length <= 1) return undefined;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % featured.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [featured.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [featured.length]);

  if (!featured.length) return null;

  const activeItem = featured[activeIndex];

  return (
    <div className="card relative overflow-hidden p-6 sm:p-7">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-emerald-50" />
      <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-brand-200/50 blur-3xl" />
      <div className="relative space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="section-kicker">Featured Slider</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Fresh picks rotating live</h2>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button type="button" onClick={() => setActiveIndex((current) => (current - 1 + featured.length) % featured.length)} className="btn-secondary h-11 w-11 !rounded-full !px-0" aria-label="Previous item">
              &lt;
            </button>
            <button type="button" onClick={() => setActiveIndex((current) => (current + 1) % featured.length)} className="btn-secondary h-11 w-11 !rounded-full !px-0" aria-label="Next item">
              &gt;
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
          <div className="overflow-hidden rounded-[28px] bg-slate-950">
            <div className="grid min-h-[360px] items-stretch lg:grid-cols-[0.95fr_1.05fr]">
              <div className="flex flex-col justify-between gap-6 p-6 text-white sm:p-8">
                <div className="space-y-4">
                  <span className="pill w-fit border-white/15 bg-white/10 text-white/85">
                    {activeItem.category?.name || activeItem.category || 'Chef special'}
                  </span>
                  <div>
                    <h3 className="text-3xl font-semibold tracking-tight">{activeItem.name}</h3>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-white/75">{activeItem.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/55">Ready in</p>
                    <p className="mt-2 text-2xl font-semibold">{activeItem.preparationTime} min</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/55">Price</p>
                    <p className="mt-2 text-2xl font-semibold">{currency(activeItem.price)}</p>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[260px] overflow-hidden bg-gradient-to-br from-brand-200 via-brand-100 to-emerald-100">
                {activeItem.imageUrl ? (
                  <img src={activeItem.imageUrl} alt={activeItem.name} className="absolute inset-0 h-full w-full object-cover object-center" />
                ) : (
                  <div className="flex h-full items-center justify-center p-8 text-center">
                    <div className="space-y-3">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/70 text-3xl shadow-lg">🍱</div>
                      <p className="text-sm font-medium text-slate-700">Freshly plated for the campus rush.</p>
                    </div>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/20 to-transparent" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {featured.map((item, index) => (
              <button
                key={item._id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`w-full rounded-[24px] border p-4 text-left transition ${index === activeIndex ? 'border-brand-300 bg-white shadow-soft' : 'border-white/70 bg-white/70 hover:bg-white'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{item.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{item.preparationTime} min prep</p>
                  </div>
                  <span className="text-sm font-semibold text-brand-700">{currency(item.price)}</span>
                </div>
              </button>
            ))}

            <div className="card-muted p-4">
              <p className="text-sm font-semibold text-slate-900">Ready to order?</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to={`/menu/${activeItem._id}`} className="btn-secondary">View details</Link>
                <button type="button" onClick={() => onAdd(activeItem)} className="btn-primary">
                  Add featured item
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {featured.map((item, index) => (
            <button
              key={`${item._id}-dot`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition ${index === activeIndex ? 'w-10 bg-brand-500' : 'w-2.5 bg-slate-300'}`}
              aria-label={`Go to ${item.name}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
