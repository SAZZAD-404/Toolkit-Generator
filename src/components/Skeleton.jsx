export function Skeleton({ className = '', variant = 'default' }) {
  const baseClass = 'animate-pulse bg-slate-700/50 dark:bg-slate-700/50 light:bg-slate-300/50 rounded';
  
  const variants = {
    default: 'h-4 w-full',
    title: 'h-6 w-3/4',
    button: 'h-10 w-24',
    card: 'h-32 w-full',
    circle: 'h-10 w-10 rounded-full',
    table: 'h-12 w-full',
  };

  return <div className={`${baseClass} ${variants[variant]} ${className}`} />;
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg">
          <Skeleton variant="circle" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton variant="button" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 space-y-4">
      <Skeleton variant="title" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="button" />
        <Skeleton variant="button" />
      </div>
    </div>
  );
}
