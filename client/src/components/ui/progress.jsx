import { cn } from "@/lib/utils";

const Progress = ({ 
  value = 0, 
  className, 
  showLabel = false,
  variant = "default",
  ...props 
}) => {
  const variants = {
    default: "bg-blue-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    danger: "bg-red-500",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-600"
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "h-2 w-full overflow-hidden rounded-full bg-gray-200",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            variants[variant]
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-600">
          <span>Progress</span>
          <span className="font-medium">{value}%</span>
        </div>
      )}
    </div>
  );
};

export { Progress };