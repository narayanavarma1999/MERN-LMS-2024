import { GraduationCap, BookOpen, Brain, Users, Sparkles } from "lucide-react";

function ShimmerUI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 animate-float"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: ["#6366f1", "#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"][i % 8],
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + i * 5}s`
            }}
          />
        ))}
      </div>

      {/* Floating icons */}
      <BookOpen className="absolute top-20 left-10 text-blue-400/20 w-24 h-24 animate-pulse-slow" />
      <Brain className="absolute bottom-20 right-10 text-purple-400/20 w-24 h-24 animate-pulse-slow" />
      <Sparkles className="absolute top-2/3 left-1/4 text-indigo-400/20 w-14 h-14 animate-pulse" />

      {/* Header shimmer */}
      <header className="relative px-4 lg:px-6 h-20 flex items-center">
        <div className="flex items-center justify-center ml-4 lg:ml-8 mt-4">
          <div className="relative">
            <div className="relative flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border border-white/20">
              <div className="h-8 w-8 mr-3 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-full animate-pulse"></div>
              <div className="h-6 w-32 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="flex flex-col lg:flex-row w-full max-w-6xl items-center justify-center gap-10">
          
          {/* Left side - Hero text shimmer */}
          <div className="w-full lg:w-1/2 text-center lg:text-left px-4 lg:px-0">
            {/* Badge shimmer */}
            <div className="mb-2 inline-flex items-center rounded-full bg-gray-200 dark:bg-gray-700 px-3 py-1 w-32 h-6 animate-pulse"></div>
            
            {/* Title shimmer */}
            <div className="h-12 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-lg mb-6 mt-4 animate-pulse"></div>
            <div className="h-8 w-3/4 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-lg mb-6 animate-pulse"></div>
            
            {/* Description shimmer */}
            <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded mb-2 animate-pulse"></div>
            <div className="h-6 w-5/6 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded mb-2 animate-pulse"></div>
            <div className="h-6 w-4/6 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded mb-8 animate-pulse"></div>
            
            {/* Features shimmer */}
            <div className="hidden lg:flex flex-col gap-4 mt-10">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full w-10 h-10 animate-pulse"></div>
                  <div className="h-4 w-40 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Auth card shimmer */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-md">
              <div className="relative">
                <div className="relative backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 shadow-2xl border border-white/30 dark:border-gray-700/50 rounded-2xl overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 animate-pulse"></div>
                  
                  <div className="p-6 space-y-1 pb-2">
                    {/* Card title shimmer */}
                    <div className="h-8 w-48 mx-auto bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-lg mb-2 animate-pulse"></div>
                    
                    {/* Card description shimmer */}
                    <div className="h-4 w-64 mx-auto bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded mb-4 animate-pulse"></div>
                    
                    {/* Tabs shimmer */}
                    <div className="grid grid-cols-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl mb-6">
                      <div className="bg-white dark:bg-gray-800 rounded-xl h-10 animate-pulse"></div>
                      <div className="h-10 animate-pulse"></div>
                    </div>
                    
                    {/* Form fields shimmer */}
                    <div className="space-y-4">
                      {[1, 2].map((field) => (
                        <div key={field} className="space-y-2">
                          <div className="h-4 w-20 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded animate-pulse"></div>
                          <div className="h-10 w-full bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
                        </div>
                      ))}
                      
                      {/* Button shimmer */}
                      <div className="h-11 w-full bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-lg mt-4 animate-pulse"></div>
                      
                      {/* Divider shimmer */}
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white/95 dark:bg-gray-800/95 text-gray-500">
                            <div className="h-4 w-24 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded animate-pulse"></div>
                          </span>
                        </div>
                      </div>
                      
                      {/* Google button shimmer */}
                      <div className="h-11 w-full bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center gap-3 animate-pulse">
                        <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        <div className="h-4 w-40 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded"></div>
                      </div>
                      
                      {/* Footer text shimmer */}
                      <div className="text-center mt-4">
                        <div className="h-4 w-64 mx-auto bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShimmerUI;