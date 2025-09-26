import { cn } from "@/lib/utils";

const Badge = ({ 
  variant = "default", 
  className, 
  ...props 
}) => {
  const variants = {
    default: "bg-blue-100 text-blue-700 border-blue-200",
    secondary: "bg-gray-100 text-gray-700 border-gray-200",
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    danger: "bg-red-100 text-red-700 border-red-200",
    premium: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export { Badge };