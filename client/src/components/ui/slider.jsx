import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

// 🎨 Beautiful Slider with Multiple Variants
const Slider = React.forwardRef(({ 
  className, 
  variant = "default",
  size = "sm",
  showValue = false,
  valueLabel,
  ...props 
}, ref) => {
  const variants = {
    default: {
      track: "bg-gray-200 dark:bg-gray-800",
      range: "bg-gradient-to-r from-blue-500 to-blue-600",
      thumb: "border-blue-500 bg-white hover:bg-blue-50 focus:ring-2 focus:ring-blue-200"
    },
    premium: {
      track: "bg-gray-300/50 dark:bg-gray-700/50 backdrop-blur-sm",
      range: "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500",
      thumb: "border-purple-500 bg-white shadow-lg hover:shadow-xl hover:scale-110 focus:ring-2 focus:ring-purple-200"
    },
    success: {
      track: "bg-green-100 dark:bg-green-900/30",
      range: "bg-gradient-to-r from-green-400 to-emerald-500",
      thumb: "border-green-500 bg-white hover:bg-green-50 focus:ring-2 focus:ring-green-200"
    },
    warning: {
      track: "bg-amber-100 dark:bg-amber-900/30",
      range: "bg-gradient-to-r from-amber-400 to-orange-500",
      thumb: "border-amber-500 bg-white hover:bg-amber-50 focus:ring-2 focus:ring-amber-200"
    },
    dark: {
      track: "bg-gray-700",
      range: "bg-gradient-to-r from-gray-800 to-gray-900",
      thumb: "border-gray-600 bg-gray-700 hover:bg-gray-600 focus:ring-2 focus:ring-gray-400"
    }
  };

  const sizes = {
    sm: {
      track: "h-1",
      thumb: "h-3 w-3"
    },
    default: {
      track: "h-2",
      thumb: "h-4 w-4"
    },
    lg: {
      track: "h-3",
      thumb: "h-5 w-5"
    }
  };

  const currentVariant = variants[variant] || variants.default;
  const currentSize = sizes[size] || sizes.default;

  return (
    <div className="relative w-full">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center transition-all duration-200",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            "relative w-full grow overflow-hidden rounded-full transition-all duration-300",
            currentVariant.track,
            currentSize.track
          )}
        >
          <SliderPrimitive.Range 
            className={cn(
              "absolute h-full transition-all duration-300",
              currentVariant.range
            )} 
          />
        </SliderPrimitive.Track>
        
        {/* Enhanced Thumb with Smooth Animations */}
        <SliderPrimitive.Thumb
          className={cn(
            "block rounded-full border-2 bg-background shadow-sm transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
            currentVariant.thumb,
            currentSize.thumb
          )}
        >
          {/* Value Tooltip */}
          {(showValue || valueLabel) && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {valueLabel || props.value?.[0]}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          )}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    </div>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

// ✨ Premium Gradient Slider Variant
const GradientSlider = React.forwardRef(({ className, gradient = "blue", ...props }, ref) => {
  const gradients = {
    blue: "from-blue-400 via-purple-500 to-pink-500",
    sunset: "from-orange-400 via-red-500 to-purple-600",
    ocean: "from-cyan-400 via-blue-500 to-indigo-600",
    forest: "from-green-400 via-emerald-500 to-teal-600",
    fire: "from-yellow-400 via-orange-500 to-red-600"
  };

  return (
    <Slider
      ref={ref}
      variant="premium"
      className={cn("group", className)}
      {...props}
    >
      <SliderPrimitive.Track className="bg-gradient-to-r from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-600/50 backdrop-blur-sm">
        <SliderPrimitive.Range className={cn("bg-gradient-to-r", gradients[gradient])} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="border-white bg-gradient-to-br from-white to-gray-100 shadow-xl hover:shadow-2xl hover:scale-125 transition-all duration-300" />
    </Slider>
  );
});

GradientSlider.displayName = "GradientSlider";

// 💫 Animated Glow Slider
const GlowSlider = React.forwardRef(({ className, glowColor = "blue", ...props }, ref) => {
  const glows = {
    blue: "shadow-blue-500/50",
    purple: "shadow-purple-500/50",
    green: "shadow-green-500/50",
    orange: "shadow-orange-500/50",
    pink: "shadow-pink-500/50"
  };

  return (
    <div className="relative">
      <Slider
        ref={ref}
        className={cn("group", className)}
        {...props}
      >
        <SliderPrimitive.Track className="bg-gray-200/30 dark:bg-gray-700/30 backdrop-blur-md">
          <SliderPrimitive.Range className={cn(
            "bg-current shadow-lg",
            glows[glowColor]
          )} />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className={cn(
          "border-current bg-white shadow-lg hover:shadow-xl animate-pulse-slow",
          glows[glowColor]
        )} />
      </Slider>
      
      {/* Animated Glow Effect */}
      <div className={cn(
        "absolute inset-0 rounded-full blur-md opacity-30 animate-pulse",
        glows[glowColor]
      )} style={{ 
        background: "currentColor",
        top: "50%",
        transform: "translateY(-50%)",
        height: "8px"
      }} />
    </div>
  );
});

GlowSlider.displayName = "GlowSlider";

// 🎯 Step Slider with Markers
const StepSlider = React.forwardRef(({ className, steps = 5, showLabels = false, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <Slider
        ref={ref}
        className={cn("mb-2", className)}
        {...props}
      >
        {/* Step Markers */}
        <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
          {Array.from({ length: steps + 1 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 bg-white/50 rounded-full shadow-sm"
              style={{ marginLeft: i === 0 ? '2px' : i === steps ? '-2px' : '0' }}
            />
          ))}
        </div>
      </Slider>
    </div>
  );
});

StepSlider.displayName = "StepSlider";

// 🌈 Range Slider (Dual Thumb)
const RangeSlider = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <Slider
      ref={ref}
      variant={variant}
      className={className}
      {...props}
    >
      {/* Second thumb for range selection */}
      <SliderPrimitive.Thumb />
    </Slider>
  );
});

RangeSlider.displayName = "RangeSlider";

export { Slider, GradientSlider, GlowSlider, StepSlider, RangeSlider };