import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

// 🌌 Ultra Premium Overlay with Multi-layer Effects
const DialogOverlay = React.forwardRef(
  ({ className, showOverlay = true, blurIntensity = "xl", ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        `backdrop-blur-${blurIntensity}`,
        {
          "bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-pink-900/40": showOverlay,
        },
        className
      )}
      {...props}
    />
  )
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// 🚀 Ultra Premium Dialog Content with Multi-dimensional Effects
const DialogContent = React.forwardRef(
  ({ 
    className, 
    showOverlay = true, 
    children, 
    variant = "default",
    blurIntensity = "xl",
    ...props 
  }, ref) => {
    const variants = {
      default: "from-white/95 via-gray-50/90 to-white/95 border-white/40",
      premium: "from-blue-50/95 via-purple-50/90 to-pink-50/95 border-blue-200/60",
      dark: "from-gray-900/95 via-gray-800/90 to-gray-900/95 border-gray-700/60",
      gradient: "from-blue-500/10 via-purple-500/10 to-pink-500/10 border-white/20"
    };

    return (
      <DialogPortal>
        <DialogOverlay showOverlay={showOverlay} blurIntensity={blurIntensity} />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-6 bg-gradient-to-br backdrop-blur-xl p-8 shadow-2xl duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-3xl border",
            variants[variant],
            "shadow-2xl shadow-black/30 hover:shadow-3xl transition-all duration-700",
            className
          )}
          {...props}
        >
          {/* 🌟 Animated Gradient Background */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute -inset-10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-noise opacity-[0.02]" />
          </div>

          {/* ✨ Floating Particles Effect */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          {/* 🎯 Premium Glass Morphism Layer */}
          <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30" />
          
          {children}
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  }
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

// 🌈 Ultra Premium Dialog Header with Enhanced Effects
const DialogHeader = React.forwardRef(({ className, hasIcon = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-4 text-center sm:text-left relative z-10",
      hasIcon && "text-center",
      className
    )}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

// 💫 Premium Dialog Footer with Advanced Layout
const DialogFooter = React.forwardRef(({ className, layout = "default", ...props }, ref) => {
  const layouts = {
    default: "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4",
    centered: "flex justify-center space-x-4",
    stretched: "grid grid-cols-2 gap-4"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative z-10",
        layouts[layout],
        className
      )}
      {...props}
    />
  );
});
DialogFooter.displayName = "DialogFooter";

// 🏆 Ultra Pro Dialog Title with Advanced Typography
const DialogTitle = React.forwardRef(({ className, gradient = true, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-3xl font-bold leading-tight tracking-tight",
      gradient 
        ? "bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent"
        : "text-gray-900",
      "drop-shadow-sm",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// 📝 Ultra Premium Dialog Description
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      "text-lg text-gray-600 leading-relaxed font-light drop-shadow-sm",
      className
    )}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// 🎨 Premium Dialog Section with Enhanced Styling
const DialogSection = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "border-t border-gray-100/60",
    card: "bg-white/50 rounded-2xl p-6 border border-white/60 shadow-sm",
    gradient: "bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-2xl p-6"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "py-6 relative z-10",
        variants[variant],
        "first:border-t-0 first:pt-0",
        className
      )}
      {...props}
    />
  );
});
DialogSection.displayName = "DialogSection";

// ✨ Ultra Premium Dialog Icon with Advanced Effects
const DialogIcon = React.forwardRef(({ 
  className, 
  icon: Icon, 
  variant = "default",
  size = "lg",
  ...props 
}, ref) => {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-24 h-24"
  };

  const variants = {
    default: "bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/25",
    premium: "bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-2xl shadow-emerald-500/25",
    warning: "bg-gradient-to-br from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/25",
    success: "bg-gradient-to-br from-green-500 to-teal-600 shadow-2xl shadow-green-500/25"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 hover:scale-110 hover:rotate-12 cursor-pointer",
        sizes[size],
        variants[variant],
        "group",
        className
      )}
      {...props}
    >
      <Icon className={cn(
        "text-white transition-all duration-500 group-hover:scale-110",
        {
          "h-6 w-6": size === "sm",
          "h-8 w-8": size === "md",
          "h-10 w-10": size === "lg",
          "h-12 w-12": size === "xl"
        }
      )} />
    </div>
  );
});
DialogIcon.displayName = "DialogIcon";

// 🌟 New: Dialog Hero with Background Effects
const DialogHero = React.forwardRef(({ className, background = "default", ...props }, ref) => {
  const backgrounds = {
    default: "bg-gradient-to-br from-blue-500/5 to-purple-500/5",
    premium: "bg-gradient-to-br from-emerald-500/5 to-cyan-500/5",
    gradient: "bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl p-8 mb-6 overflow-hidden",
        backgrounds[background],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-noise opacity-10" />
      <div className="relative z-10">{props.children}</div>
    </div>
  );
});
DialogHero.displayName = "DialogHero";

// 💫 New: Dialog Action Button Group
const DialogActions = React.forwardRef(({ className, align = "end", ...props }, ref) => {
  const aligns = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap gap-3 mt-6",
        aligns[align],
        className
      )}
      {...props}
    />
  );
});
DialogActions.displayName = "DialogActions";

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
  DialogHero,
  DialogActions,
};