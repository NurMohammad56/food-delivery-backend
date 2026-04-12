import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { currency } from "../../lib/utils";
import showcaseBackground from "../../assets/food-vector-graphics-portable-network-graphics-vegetable-image-png-favpng-HjDgxuk9ye09rnNLRngL2ZxNG.jpg";

const asText = (value, fallback = "") => {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const getCategoryLabel = (category) => {
  if (!category) return "Chef special";
  if (typeof category === "string") return category;
  if (typeof category === "object" && category.name) return asText(category.name, "Chef special");
  return "Chef special";
};

const getNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

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
  const activeName = asText(activeItem?.name, "Featured item");
  const activeDescription = asText(activeItem?.description, "Freshly plated for the campus rush.");
  const activeCategory = getCategoryLabel(activeItem?.category);
  const activePrepTime = getNumber(activeItem?.preparationTime);
  const activePrice = getNumber(activeItem?.price);

  return (
    <div className="card relative overflow-hidden p-5 sm:p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-emerald-50" />
      <img
        src={showcaseBackground}
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 right-0 h-56 w-56 object-cover opacity-[0.08] saturate-75"
      />
      <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-brand-200/50 blur-3xl" />
      <div className="relative space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="section-kicker">Featured Items</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-[1.7rem]">
              Fresh picks
            </h2>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() =>
                setActiveIndex(
                  (current) => (current - 1 + featured.length) % featured.length,
                )
              }
              className="btn-secondary h-11 w-11 !rounded-full !px-0"
              aria-label="Previous item"
            >
              &lt;
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((current) => (current + 1) % featured.length)
              }
              className="btn-secondary h-11 w-11 !rounded-full !px-0"
              aria-label="Next item"
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-[28px] bg-slate-950 shadow-soft">
            <div className="relative aspect-[16/8.5] overflow-hidden bg-gradient-to-br from-brand-200 via-brand-100 to-emerald-100">
              {activeItem?.imageUrl ? (
                <img
                  src={activeItem.imageUrl}
                  alt={activeName}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center">
                  <div className="space-y-3">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/70 text-3xl shadow-lg">
                      🍱
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      Freshly plated for the campus rush.
                    </p>
                  </div>
                </div>
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/30 to-transparent" />
            </div>

            <div className="space-y-4 p-5 text-white sm:p-6">
              <div className="space-y-3">
                <span className="pill w-fit border-white/15 bg-white/10 text-white/85">
                  {activeCategory}
                </span>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight sm:text-[1.9rem]">
                    {activeName}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                    {activeDescription}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="glass-panel p-3.5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                    Ready in
                  </p>
                  <p className="mt-2 text-xl font-semibold sm:text-2xl">
                    {activePrepTime} min
                  </p>
                </div>
                <div className="glass-panel p-3.5">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                    Price
                  </p>
                  <p className="mt-2 text-xl font-semibold sm:text-2xl">
                    {currency(activePrice)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to={`/menu/${activeItem?._id}`} className="btn-secondary">
                  View details
                </Link>
                <button
                  type="button"
                  onClick={() => onAdd(activeItem)}
                  className="btn-primary"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {featured.map((item, index) => (
              <button
                key={item._id || `${asText(item?.name, "featured-item")}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`w-full rounded-[24px] border p-3.5 text-left transition ${index === activeIndex ? "border-brand-300 bg-white shadow-soft" : "border-white/70 bg-white/70 hover:bg-white"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {asText(item?.name, "Featured item")}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                      {getNumber(item?.preparationTime)} min prep
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-brand-700">
                    {currency(getNumber(item?.price))}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {featured.map((item, index) => (
            <button
              key={`${item._id || index}-dot`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition ${index === activeIndex ? "w-10 bg-brand-500" : "w-2.5 bg-slate-300"}`}
              aria-label={`Go to ${asText(item?.name, "featured item")}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
