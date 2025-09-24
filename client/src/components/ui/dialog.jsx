import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

// 🎨 Ultra Pro Overlay with Glass Morphism
const DialogOverlay = React.forwardRef(
  ({ className, showOverlay = true, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
        {
          "bg-black/60": showOverlay,
        }
      )}
      {...props}
    />
  )
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// 💫 Premium Dialog Content with Advanced Animations
const DialogContent = React.forwardRef(
  ({ className, showOverlay = true, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay showOverlay={showOverlay} />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-6 border-0 bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-xl p-8 shadow-2xl shadow-black/20 duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-3xl border border-white/20",
          className
        )}
        {...props}
      >
        {/* ✨ Animated Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent" />
        
        {children}
        
        {/* 🎯 Premium Close Button */}
        <DialogPrimitive.Close className="absolute right-6 top-6 rounded-2xl p-2 bg-white/80 backdrop-blur-sm border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:pointer-events-none data-[state=open]:bg-white">
          <Cross2Icon className="h-5 w-5 text-gray-600 hover:text-gray-900 transition-colors" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

// 🌟 Enhanced Dialog Header
const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-3 text-center sm:text-left relative z-10",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

// 💎 Premium Dialog Footer
const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 relative z-10",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

// 🏆 Ultra Pro Dialog Title
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-tight tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// 📝 Enhanced Dialog Description
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-base text-gray-600 leading-relaxed", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// 🎨 Additional Premium Components

// ✨ Dialog Section for better content organization
const DialogSection = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-4 border-t border-gray-100/50 first:border-t-0", className)}
    {...props}
  />
));
DialogSection.displayName = "DialogSection";

// 💫 Dialog Icon for premium icon integration
const DialogIcon = React.forwardRef(({ className, icon: Icon, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/25 mx-auto mb-4",
      className
    )}
    {...props}
  >
    <Icon className="h-8 w-8 text-white" />
  </div>
));
DialogIcon.displayName = "DialogIcon";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogSection,
  DialogIcon,
};