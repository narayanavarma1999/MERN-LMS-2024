import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

// 🌟 Premium TabsList with Glass Morphism
const TabsList = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-white/80 to-gray-50/60 backdrop-blur-xl p-1.5 border border-white/20 shadow-2xl shadow-black/5",
      "transition-all duration-300 hover:shadow-3xl hover:shadow-black/10",
      variant === "pills" && "bg-transparent p-0 gap-2",
      variant === "underline" && "bg-transparent border-b border-gray-200/50 rounded-none p-0 gap-6",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

// 💫 Ultra Pro TabsTrigger with Multiple Variants
const TabsTrigger = React.forwardRef(({
  className,
  variant = "default",
  icon: Icon,
  badge,
  ...props
}, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base Styles
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-3 text-sm font-semibold",
      "ring-offset-background transition-all duration-300 ease-out",
      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-40",

      // Default Variant - Inactive State
      variant === "default" && [
        "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50",
        "data-[state=active]:bg-white data-[state=active]:shadow-lg",
        "data-[state=active]:text-gray-900 data-[state=active]:border data-[state=active]:border-white/40"
      ],

      // Pills Variant - Inactive State
      variant === "pills" && [
        "bg-white/30 text-gray-600 hover:bg-white/60 hover:text-gray-900",
        "data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600",
        "data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:shadow-blue-500/25"
      ],

      // Underline Variant - Inactive State
      variant === "underline" && [
        "bg-transparent text-gray-500 hover:text-gray-700 pb-4 relative",
        "data-[state=active]:text-blue-600 data-[state=active]:font-bold",
        "data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0",
        "data-[state=active]:after:left-0 data-[state=active]:after:right-0 data-[state=active]:after:h-0.5",
        "data-[state=active]:after:bg-gradient-to-r data-[state=active]:after:from-blue-600 data-[state=active]:after:to-purple-600"
      ],

      // Icon Styles
      Icon && "gap-2",

      className
    )}
    {...props}
  >
    {Icon && <Icon className="w-4 h-4" />}
    <span>{props.children}</span>
    {badge && (
      <span className={cn(
        "ml-2 px-1.5 py-0.5 text-xs rounded-full font-medium",
        "data-[state=active]:bg-white/20 data-[state=active]:text-white",
        !props['data-state'] === 'active' && "bg-gray-200 text-gray-600"
      )}>
        {badge}
      </span>
    )}
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

// 🎨 Premium TabsContent with Enhanced Animations
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 focus-visible:ring-offset-2",
      "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95",
      "data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:zoom-out-95",
      "data-[state=inactive]:duration-300 data-[state=active]:duration-500",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

// 💎 Additional Premium Tab Components

// 🏆 TabGroup - Enhanced Container
const TabsGroup = React.forwardRef(({ className, orientation = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-full",
      orientation === "vertical" && "flex gap-6",
      className
    )}
    {...props}
  />
))
TabsGroup.displayName = "TabsGroup"

// 🌊 TabPanel - Premium Content Container
const TabsPanel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm",
      "border border-white/20 shadow-lg p-6",
      "animate-in fade-in-0 zoom-in-95 duration-500",
      className
    )}
    {...props}
  />
))
TabsPanel.displayName = "TabsPanel"

// ✨ TabIndicator - Animated Selection Indicator
const TabsIndicator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute bg-gradient-to-r from-blue-500 to-purple-600 rounded-full",
      "transition-all duration-300 ease-out shadow-lg shadow-blue-500/25",
      className
    )}
    {...props}
  />
))
TabsIndicator.displayName = "TabsIndicator"

// 📱 MobileTabs - Responsive Tab System
const MobileTabs = React.forwardRef(({ className, children, ...props }, ref) => {
  const [activeTab, setActiveTab] = React.useState("tab1");

  return (
    <div
      ref={ref}
      className={cn(
        "lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2",
        "bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40",
        "shadow-2xl shadow-black/20 p-2 z-50",
        className
      )}
      {...props}
    >
      <TabsList className="flex rounded-xl bg-transparent p-0">
        {React.Children.map(children, (child) =>
          React.cloneElement(child, {
            className: cn(
              "flex-1 justify-center min-w-0 px-3 py-2 text-xs",
              child.props.className
            )
          })
        )}
      </TabsList>
    </div>
  )
})
MobileTabs.displayName = "MobileTabs"

// 🌈 AnimatedTabs - With Smooth Transitions
const AnimatedTabs = React.forwardRef(({ className, children, ...props }, ref) => (
  <Tabs
    ref={ref}
    className={cn(
      "relative overflow-hidden",
      className
    )}
    {...props}
  >
    <style jsx>{`
      @keyframes slideIn {
        from { transform: translateY(10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .animate-slide-in {
        animation: slideIn 0.3s ease-out;
      }
    `}</style>
    {children}
  </Tabs>
))
AnimatedTabs.displayName = "AnimatedTabs"

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsGroup,
  TabsPanel,
  TabsIndicator,
  MobileTabs,
  AnimatedTabs
}