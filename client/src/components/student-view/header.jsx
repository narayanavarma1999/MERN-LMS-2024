import { GraduationCap, User, ChevronDown, LogOut, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";
import toast from "react-hot-toast";

function StudentViewCommonHeader() {
  
  const navigate = useNavigate();
  const { resetCredentials, user } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef(null);

  function handleLogout() {
     toast.success("Logged out successfully!");
    resetCredentials();
    sessionStorage.clear();
    navigate("/auth");
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between p-4 transition-all duration-300 ${isScrolled
        ? "bg-white/95 backdrop-blur-md border-b shadow-md py-3"
        : "bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200/50"
        }`}
    >
      <div className="flex items-center space-x-8">
        <Link
          to="/home"
          className="flex items-center group hover:text-black transition-colors duration-200"
        >
          <GraduationCap className="h-8 w-8 ml-20 relative z-10 text-blue-600 group-hover:scale-105 transition-transform duration-300" />

          <div className="font-extrabold md:text-xl ml-1 text-[16px]  bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            VirtiLearn
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-1 ml-4">
          <Button
            variant="ghost"
            onClick={() => {
              location.pathname.includes("/courses")
                ? null
                : navigate("/courses");
            }}
            className="text-[14px] md:text-[16px] font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 group relative"
          >
            <span>Explore Courses</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <div className="flex gap-8 items-center">
          <div
            onClick={() => navigate("/student-courses")}
            className="hidden md:flex cursor-pointer items-center gap-2 group relative p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-[14px] md:text-[16px]">
              My Courses
            </span>
          </div>

          <div className="" ref={profileRef}>
            <div
              className="flex mr-4 items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 border border-transparent hover:border-gray-200"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {user?.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{user?.name || "Student"}</div>
                <div className="text-xs text-gray-500">Student</div>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">{user?.name || "Student"}</div>
                  <div className="text-xs text-gray-500 truncate">{user?.email || "student@example.com"}</div>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User className="h-4 w-4 mr-3 opacity-70" />
                  My Profile
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  <LogOut className="h-4 w-4 mr-3 opacity-70" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;