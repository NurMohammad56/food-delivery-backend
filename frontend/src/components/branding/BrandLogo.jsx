import { Link } from 'react-router-dom';
import { classNames } from '../../lib/utils';

const sizeMap = {
  sm: 'h-11 w-11',
  md: 'h-12 w-12',
  lg: 'h-14 w-14',
};

function BrandSymbol({ theme = 'default' }) {
  const strokeTone = theme === 'light' ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.96)';

  return (
    <svg viewBox="0 0 64 64" className="h-[72%] w-[72%]" aria-hidden="true">
      <defs>
        <linearGradient id="nub-site-mark" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
          <stop offset="68%" stopColor="#dfe1f8" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#b8f0d5" stopOpacity="0.98" />
        </linearGradient>
      </defs>
      <path d="M18 10h10l10 18V10h8v44H46L26 24v30h-8z" fill="url(#nub-site-mark)" />
      <path d="M44 40c3 0 5 2 5 5 0 4-4 7-9 9 2-3 3-6 3-9 0-3 .5-5 1-5z" fill="#029a57" />
      <circle cx="49" cy="16" r="3" fill="#c23a35" />
      <rect x="8" y="8" width="48" height="48" rx="16" fill="none" stroke={strokeTone} strokeWidth="2.6" />
    </svg>
  );
}

export default function BrandLogo({
  to = '/',
  title = 'BentoBox',
  subtitle = 'Campus food delivery',
  size = 'md',
  theme = 'default',
  className = '',
  compact = false,
}) {
  const titleTone = theme === 'light' ? 'text-white' : 'text-slate-950';
  const subtitleTone = theme === 'light' ? 'text-white/70' : 'text-slate-500';

  return (
    <Link to={to} className={classNames('inline-flex items-center gap-3', className)}>
      <div className={classNames('brand-mark shrink-0', sizeMap[size] || sizeMap.md)}>
        <BrandSymbol theme={theme} />
      </div>
      {!compact ? (
        <div>
          <p className={classNames('text-base font-semibold tracking-tight', titleTone)}>{title}</p>
          <p className={classNames('text-xs uppercase tracking-[0.24em]', subtitleTone)}>{subtitle}</p>
        </div>
      ) : null}
    </Link>
  );
}
