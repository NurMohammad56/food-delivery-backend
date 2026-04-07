import { Link } from 'react-router-dom';
import { classNames } from '../../lib/utils';

const sizeMap = {
  sm: 'h-11 w-11 text-xl',
  md: 'h-12 w-12 text-2xl',
  lg: 'h-14 w-14 text-3xl',
};

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
      <div className={classNames('brand-mark shrink-0', sizeMap[size] || sizeMap.md)}>🍱</div>
      {!compact ? (
        <div>
          <p className={classNames('text-base font-semibold tracking-tight', titleTone)}>{title}</p>
          <p className={classNames('text-xs uppercase tracking-[0.24em]', subtitleTone)}>{subtitle}</p>
        </div>
      ) : null}
    </Link>
  );
}
