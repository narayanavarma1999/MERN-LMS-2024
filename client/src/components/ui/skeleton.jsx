import { cn } from "@/lib/utils"

// 🌟 Ultra Premium Skeleton with Advanced Animations
function Skeleton({
  className,
  variant = "default",
  animation = "pulse",
  gradient = true,
  shimmer = true,
  rounded = "md",
  ...props
}) {
  const variants = {
    default: "bg-gradient-to-r from-gray-200/80 via-gray-100/60 to-gray-200/80",
    premium: "bg-gradient-to-r from-blue-100/70 via-purple-100/50 to-pink-100/70",
    dark: "bg-gradient-to-r from-gray-700/80 via-gray-600/60 to-gray-700/80",
    card: "bg-gradient-to-br from-white/90 via-gray-50/80 to-white/90 border border-white/40"
  };

  const animations = {
    pulse: "animate-pulse",
    shimmer: "animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%]",
    wave: "animate-wave bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:200%_100%]",
    glow: "animate-glow bg-gradient-to-r from-transparent via-blue-100/20 to-transparent"
  };

  const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full"
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        roundedStyles[rounded],
        variants[variant],
        animations[animation],
        gradient && "bg-gradient-to-r",
        shimmer && "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent",
        className
      )}
      {...props}
    >
      {/* ✨ Enhanced Shimmer Effect */}
      {shimmer && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      )}
      
      {/* 🌈 Gradient Overlay */}
      {gradient && (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent",
          animation === "shimmer" && "animate-shimmer-overlay"
        )} />
      )}
    </div>
  );
}

// 🎨 Premium Skeleton Group for Complex Layouts
function SkeletonGroup({
  className,
  direction = "vertical",
  gap = "md",
  children,
  ...props
}) {
  const directions = {
    vertical: "flex flex-col",
    horizontal: "flex flex-row",
    grid: "grid grid-cols-1"
  };

  const gaps = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8"
  };

  return (
    <div
      className={cn(
        "animate-pulse",
        directions[direction],
        gaps[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// 💫 Specific Skeleton Components for Common Use Cases

// 📱 Skeleton for User Cards
function SkeletonCard({
  className,
  hasImage = true,
  hasAction = true,
  ...props
}) {
  return (
    <div className={cn("p-6 space-y-4", className)} {...props}>
      {hasImage && (
        <Skeleton className="w-20 h-20 rounded-full mx-auto" variant="premium" />
      )}
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4 mx-auto" variant="default" />
        <Skeleton className="h-4 w-full" variant="default" />
        <Skeleton className="h-4 w-5/6 mx-auto" variant="default" />
      </div>
      {hasAction && (
        <Skeleton className="h-10 w-full rounded-xl" variant="premium" />
      )}
    </div>
  );
}

// 📊 Skeleton for Data Tables
function SkeletonTable({
  className,
  rows = 5,
  columns = 4,
  ...props
}) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Table Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-8 flex-1" variant="premium" />
        ))}
      </div>
      
      {/* Table Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={`cell-${rowIndex}-${colIndex}`} 
                className="h-12 flex-1" 
                variant={colIndex === 0 ? "premium" : "default"}
                animation={colIndex % 2 === 0 ? "shimmer" : "pulse"}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// 🖼️ Skeleton for Image Gallery
function SkeletonGrid({
  className,
  items = 6,
  columns = 3,
  ...props
}) {
  return (
    <div className={cn(
      "grid gap-4",
      {
        "grid-cols-1": columns === 1,
        "grid-cols-2": columns === 2,
        "grid-cols-3": columns === 3,
        "grid-cols-4": columns === 4,
        "grid-cols-5": columns === 5,
        "grid-cols-6": columns === 6,
      },
      className
    )} {...props}>
      {Array.from({ length: items }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="aspect-square rounded-2xl" 
          variant={i % 2 === 0 ? "premium" : "default"}
          animation={i % 3 === 0 ? "shimmer" : "pulse"}
        />
      ))}
    </div>
  );
}

// 📝 Skeleton for Text Content
function SkeletonText({
  className,
  lines = 3,
  variant = "default",
  ...props
}) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            "h-4",
            i === lines - 1 && "w-3/4", // Last line shorter
            i === 0 && "h-6" // First line taller (like a title)
          )} 
          variant={variant}
          animation={i % 2 === 0 ? "pulse" : "shimmer"}
        />
      ))}
    </div>
  );
}

// 👤 Skeleton for User Profile
function SkeletonProfile({
  className,
  size = "lg",
  ...props
}) {
  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40"
  };

  return (
    <div className={cn("flex flex-col items-center space-y-4 p-6", className)} {...props}>
      <Skeleton className={cn("rounded-full", sizes[size])} variant="premium" animation="shimmer" />
      <div className="space-y-3 w-full text-center">
        <Skeleton className="h-6 w-3/4 mx-auto" variant="default" />
        <Skeleton className="h-4 w-1/2 mx-auto" variant="default" />
        <Skeleton className="h-4 w-5/6 mx-auto" variant="default" />
      </div>
      <div className="flex space-x-3 w-full">
        <Skeleton className="h-10 flex-1 rounded-xl" variant="premium" />
        <Skeleton className="h-10 flex-1 rounded-xl" variant="default" />
      </div>
    </div>
  );
}

export { 
  Skeleton, 
  SkeletonGroup, 
  SkeletonCard, 
  SkeletonTable, 
  SkeletonGrid, 
  SkeletonText, 
  SkeletonProfile 
};
