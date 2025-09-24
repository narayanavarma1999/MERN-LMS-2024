import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import {
  GraduationCap,
  BookOpen,
  Brain,
  Lightbulb,
  ChevronRight,
  Sparkles,
  Users
} from "lucide-react";

function AuthPage() {
  
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
    handleGoogleSignIn,
    showPassword,
    setShowPassword,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

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
      <Lightbulb className="absolute top-1/3 right-1/4 text-yellow-400/20 w-16 h-16 animate-ping-slow" />
      <Sparkles className="absolute top-2/3 left-1/4 text-indigo-400/20 w-14 h-14 animate-pulse" />

      <header className="relative px-4 lg:px-6 h-20 flex items-center">
        <Link
          to={"/"}
          className="flex items-center justify-center ml-4 lg:ml-8 mt-4 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 opacity-70"></div>
            <div className="relative flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg group-hover:shadow-xl transition-all duration-300 border border-white/20">
              <GraduationCap className="h-8 w-8 mr-3 text-indigo-600 dark:text-indigo-400" />
              <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                VirtiLearn
              </span>
            </div>
          </div>
        </Link>
      </header>

      <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="flex flex-col lg:flex-row w-full max-w-6xl items-center justify-center gap-10">
          {/* Left side - Hero text */}
          <div className="w-full lg:w-1/2 text-center lg:text-left px-4 lg:px-0">
            <div className="mb-2 inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
              <Sparkles className="h-4 w-4 mr-1" /> The Future of Learning
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-6 mt-4">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">VirtiLearn</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              The next generation learning platform that helps you master new skills with interactive courses and expert instructors.
            </p>
            <div className="hidden lg:flex flex-col gap-4 mt-10">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Expert Courses</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                  <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Personalized Learning Paths</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Interactive Learning Experience</span>
              </div>
            </div>
          </div>

          {/* Right side - Auth card */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-md">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <Card className="relative backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 shadow-2xl border border-white/30 dark:border-gray-700/50 rounded-2xl overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                  <CardHeader className="space-y-1 pb-2">
                    <CardTitle className="text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                      {activeTab === "signin" ? "Welcome Back" : "Join VirtiLearn"}
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                      {activeTab === "signin"
                        ? "Enter your credentials to access your account"
                        : "Create an account to start your learning journey"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <Tabs
                      value={activeTab}
                      defaultValue="signin"
                      onValueChange={handleTabChange}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                        <TabsTrigger
                          value="signin"
                          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:dark:bg-gray-800 rounded-xl transition-all duration-300"
                        >
                          Sign In
                        </TabsTrigger>
                        <TabsTrigger
                          value="signup"
                          className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:dark:bg-gray-800 rounded-xl transition-all duration-300"
                        >
                          Sign Up
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="signin" className="mt-6">
                        <CommonForm
                          formControls={signInFormControls}
                          buttonText={"Sign In"}
                          formData={signInFormData}
                          setFormData={setSignInFormData}
                          isButtonDisabled={!checkIfSignInFormIsValid()}
                          handleSubmit={handleLoginUser}
                          showPassword={showPassword}
                          setShowPassword={setShowPassword}
                        />
                      </TabsContent>
                      <TabsContent value="signup" className="mt-6">
                        <CommonForm
                          formControls={signUpFormControls}
                          buttonText={"Create Account"}
                          formData={signUpFormData}
                          setFormData={setSignUpFormData}
                          isButtonDisabled={!checkIfSignUpFormIsValid()}
                          handleSubmit={handleRegisterUser}
                          showPassword={showPassword}
                          setShowPassword={setShowPassword}
                        />
                      </TabsContent>
                    </Tabs>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white/95 dark:bg-gray-800/95 text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <button
                      onClick={handleGoogleSignIn}
                      className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google logo" />
                      Sign {activeTab === "signin" ? "in" : "up"} with Google
                    </button>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                      {activeTab === "signin" ? (
                        <>
                          Don't have an account?{" "}
                          <button
                            onClick={() => setActiveTab("signup")}
                            className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-300 flex items-center justify-center gap-1 mx-auto mt-2 group"
                          >
                            Sign up now <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </>
                      ) : (
                        <>
                          Already have an account?{" "}
                          <button
                            onClick={() => setActiveTab("signin")}
                            className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-300 flex items-center justify-center gap-1 mx-auto mt-2 group"
                          >
                            Sign in <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </>
                      )}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
