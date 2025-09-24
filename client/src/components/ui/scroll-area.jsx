import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cn } from "@/lib/utils"

// 🌟 Premium ScrollArea with Glass Morphism
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}>
    {/* 🎯 Enhanced Viewport with Gradient Border */}
    <ScrollAreaPrimitive.Viewport 
      className="h-full w-full rounded-[inherit] bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm"
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    
    {/* ✨ Premium Scroll Bars */}
    <ScrollBar />
    <ScrollBar orientation="horizontal" />
    
    {/* 💫 Corner with Smooth Transition */}
    <ScrollAreaPrimitive.Corner className="bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

// 🎨 Ultra Pro ScrollBar with Advanced Effects
const ScrollBar = React.forwardRef(({ 
  className, 
  orientation = "vertical", 
  showOnHover = true,
  ...props 
}, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-all duration-300 ease-out",
      showOnHover && "opacity-0 hover:opacity-100 group-hover:opacity-100",
      orientation === "vertical" &&
        "h-full w-3 group hover:w-4 transition-all duration-300 border-l border-l-white/20",
      orientation === "horizontal" &&
        "h-3 group hover:h-4 transition-all duration-300 flex-col border-t border-t-white/20",
      className
    )}
    {...props}
  >
    {/* 🌈 Animated Scroll Thumb */}
    <ScrollAreaPrimitive.ScrollAreaThumb 
      className={cn(
        "relative flex-1 rounded-full transition-all duration-300",
        "bg-gradient-to-br from-gray-300 to-gray-400",
        "hover:from-blue-500 hover:to-purple-600",
        "shadow-lg hover:shadow-xl",
        "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:to-transparent before:rounded-full"
      )} 
    />
    
    {/* ✨ Scrollbar Track Glow Effect */}
    <div className={cn(
      "absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10",
      "backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    )} />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

// 💎 Additional Premium Scroll Components

// 🏆 ScrollContainer with Enhanced Styling
const ScrollContainer = React.forwardRef(({ className, children, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      "relative group rounded-2xl border border-white/20",
      "bg-gradient-to-br from-white to-gray-50/90 backdrop-blur-sm",
      "shadow-2xl shadow-black/5",
      className
    )}
    {...props}
  >
    <ScrollArea className="h-full">
      <div className="p-6">
        {children}
      </div>
    </ScrollArea>
    
    {/* 🎯 Top and Bottom Fade Effects */}
    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none" />
    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
  </div>
))
ScrollContainer.displayName = "ScrollContainer"

// 🌊 SmoothScrollArea with Custom Easing
const SmoothScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <ScrollArea 
    ref={ref}
    className={cn(
      "scroll-smooth hover:scroll-auto",
      "[scrollbar-width:thin] [scrollbar-color:rgba(59,130,246,0.5)_transparent]",
      className
    )}
    {...props}
  >
    <style jsx>{`
      .scroll-smooth {
        scroll-behavior: smooth;
      }
      .hover\\:scroll-auto:hover {
        scroll-behavior: auto;
      }
      /* Custom scrollbar for Webkit */
      .scroll-smooth::-webkit-scrollbar {
        width: 8px;
      }
      .scroll-smooth::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 10px;
      }
      .scroll-smooth::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3B82F6, #8B5CF6);
        border-radius: 10px;
        border: 2px solid transparent;
        background-clip: padding-box;
      }
      .scroll-smooth::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #2563EB, #7C3AED);
      }
    `}</style>
    {children}
  </ScrollArea>
))
SmoothScrollArea.displayName = "SmoothScrollArea"

// 📱 MobileOptimizedScrollArea for Touch Devices
const MobileOptimizedScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <ScrollArea
    ref={ref}
    className={cn(
      "touch-pan-y overscroll-contain",
      "[-webkit-overflow-scrolling:touch]",
      className
    )}
    {...props}
  >
    {/* 📲 Enhanced touch interactions */}
    <ScrollAreaPrimitive.Viewport
      className="h-full w-full rounded-[inherit] select-none"
    >
      <div className="min-h-full touch-pan-y">
        {children}
      </div>
    </ScrollAreaPrimitive.Viewport>
    
    {/* 📱 Mobile-optimized scrollbar */}
    <ScrollBar 
      showOnHover={false}
      className="opacity-60 active:opacity-100 transition-opacity"
    />
  </ScrollArea>
))
MobileOptimizedScrollArea.displayName = "MobileOptimizedScrollArea"

// 🌈 GradientScrollArea with Visual Effects
const GradientScrollArea = React.forwardRef(({ 
  className, 
  gradientFrom = "from-blue-500/5", 
  gradientTo = "to-purple-500/5",
  children, 
  ...props 
}, ref) => (
  <div 
    ref={ref}
    className={cn(
      "relative rounded-2xl overflow-hidden",
      "bg-gradient-to-br from-white to-gray-50/90",
      className
    )}
    {...props}
  >
    {/* 🎨 Animated Gradient Background */}
    <div className={cn(
      "absolute inset-0 bg-gradient-to-br",
      gradientFrom, gradientTo,
      "animate-gradient-x"
    )} />
    
    <ScrollArea className="relative z-10 h-full">
      <div className="p-6 backdrop-blur-sm bg-white/50">
        {children}
      </div>
    </ScrollArea>
    
    <style jsx>{`
      @keyframes gradient-x {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 0.8; }
      }
      .animate-gradient-x {
        animation: gradient-x 3s ease-in-out infinite;
      }
    `}</style>
  </div>
))
GradientScrollArea.displayName = "GradientScrollArea"

export { 
  ScrollArea, 
  ScrollBar,
  ScrollContainer,
  SmoothScrollArea,
  MobileOptimizedScrollArea,
  GradientScrollArea
}