import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Home, Search, ArrowRight, Zap, Rocket, BookOpen, Users, Star, Award, PlayCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: Zap, title: "Fast Learning", description: "Accelerated progress" },
    { icon: Users, title: "Expert Instructors", description: "Industry professionals" },
    { icon: Rocket, title: "Quick Results", description: "See progress fast" },
    { icon: Star, title: "Premium Content", description: "High-quality courses" },
  ];

  const stats = [
    { value: "10K+", label: "Active Students" },
    { value: "500+", label: "Expert Courses" },
    { value: "95%", label: "Success Rate" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 bg-gradient-to-r from-blue-50 to-indigo-50 py-8">
      {/* Main Content */}
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Header Section */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200 mb-6 shadow-lg">
            <Award className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold text-gray-700">Page Not Found</span>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            404 - Lost in Learning
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Oops! The page you're looking for seems to have taken a different learning path. 
            But don't worry, there's a whole world of knowledge waiting for you back home.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => navigate("/")}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Back to Home
            </Button>

            <Button
              onClick={() => navigate("/courses")}
              variant="outline"
              className="group border-2 border-gray-300 bg-white/80 hover:bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Explore Courses
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-blue-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-8 max-w-4xl mx-auto mb-12"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-center p-4"
              >
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

  

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Button
            variant="outline"
            className="border-2 border-gray-300 bg-white/80 hover:bg-white text-gray-700 px-6 py-2 rounded-xl font-semibold"
            onClick={() => navigate('/contact')}
          >
            Contact Support
          </Button>
        </motion.div>
      </div>

      {/* Floating Quick Action */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-50 group"
        onClick={() => navigate('/courses')}
      >
        <Zap className="h-5 w-5 group-hover:scale-110 transition-transform" />
      </motion.button>
    </div>
  );
}

export default NotFoundPage;