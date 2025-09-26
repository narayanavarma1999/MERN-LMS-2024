import { cn } from "@/lib/utils";

const Avatar = ({ className, ...props }) => (
  <div
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
);

const AvatarImage = ({ className, ...props }) => (
  <img
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
);

const AvatarFallback = ({ className, ...props }) => (
  <div
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold",
      className
    )}
    {...props}
  />
);

export { Avatar, AvatarImage, AvatarFallback };