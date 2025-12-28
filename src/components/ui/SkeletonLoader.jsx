export const SkeletonBox = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`
    ${width} ${height} 
    bg-theme-secondary/50 
    rounded-lg 
    animate-pulse
    ${className}
  `} />
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBox 
        key={i}
        width={i === lines - 1 ? 'w-3/4' : 'w-full'}
        height="h-4"
      />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-theme-card border border-theme rounded-xl p-6 ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonBox width="w-12" height="h-12" className="rounded-full" />
      <div className="flex-1">
        <SkeletonBox width="w-1/2" height="h-5" className="mb-2" />
        <SkeletonBox width="w-1/3" height="h-4" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4, className = '' }) => (
  <div className={`bg-theme-card border border-theme rounded-xl overflow-hidden ${className}`}>
    {/* Header */}
    <div className="border-b border-theme p-4">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBox key={i} width="w-full" height="h-5" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-theme">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <SkeletonBox key={j} width="w-full" height="h-4" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonStats = ({ className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-theme-card border border-theme rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <SkeletonBox width="w-8" height="h-8" className="rounded-lg" />
          <SkeletonBox width="w-16" height="h-6" />
        </div>
        <SkeletonBox width="w-full" height="h-8" className="mb-2" />
        <SkeletonBox width="w-2/3" height="h-4" />
      </div>
    ))}
  </div>
);