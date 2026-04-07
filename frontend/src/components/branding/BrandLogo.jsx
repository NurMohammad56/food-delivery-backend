import { Link } from "react-router-dom";
import logoImage from "../../assets/Logo.png";
import { classNames } from "../../lib/utils";

const sizeMap = {
  sm: "h-11 w-11",
  md: "h-12 w-12",
  lg: "h-14 w-14",
};

export default function BrandLogo({
  to = "/",
  title = "NUB Canteen Hub",
  subtitle = "Campus food delivery",
  size = "md",
  theme = "default",
  className = "",
  compact = false,
}) {
  const titleTone = theme === "light" ? "text-white" : "text-slate-950";
  const subtitleTone = theme === "light" ? "text-white/70" : "text-slate-500";

  return (
    <Link
      to={to}
      className={classNames("inline-flex items-center gap-3", className)}
    >
      <div
        className={classNames(
          "brand-mark shrink-0 overflow-hidden bg-white p-1.5",
          sizeMap[size] || sizeMap.md,
        )}
      >
        <img
          src={logoImage}
          alt={`${title} logo`}
          className="h-full w-full rounded-[16px] object-contain"
        />
      </div>
      {!compact ? (
        <div>
          <p
            className={classNames(
              "text-base font-semibold tracking-tight",
              titleTone,
            )}
          >
            {title}
          </p>
          <p
            className={classNames(
              "text-xs uppercase tracking-[0.24em]",
              subtitleTone,
            )}
          >
            {subtitle}
          </p>
        </div>
      ) : null}
    </Link>
  );
}
