import {
  GraduationCap,
  User,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const authData = useSelector((store) => store.auth);
  const authUser = authData.user;

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
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/home", label: "Home", icon: "🏠" },
    { path: "/courses", label: "Courses", icon: "📚" },
    { path: "/contact", label: "Contact", icon: "📞" },
    { path: "/student-courses", label: "My Learning", icon: "🎓" },
  ];

  const getUserInitial = () => {
    return authUser?.userName?.[0]?.toUpperCase() || "S";
  };

  const getAvatarContent = () => {
    if (authUser?.avatar) {
      return (
        <img
          src={authUser.avatar}
          alt={authUser.userName || "User"}
          className="h-full w-full rounded-full object-cover"
        />
      );
    }
    return (
      <span className="text-white font-bold text-sm">{getUserInitial()}</span>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/home" className="flex items-center ml-20">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            VirtiLearn
          </span>
        </Link>

        <nav className="hidden lg:flex items-center ml-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative px-6 py-3 font-semibold  hover:text-blue-600 transition-all duration-300 group rounded-xl"
            >
              <span className="relative z-10 flex items-center font-semibold text-gray-900 mb-4">
                <span>{item.label}</span>
              </span>
              <div className="absolute bottom-0 left-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-x-1/2 group-hover:w-3/4 transition-all duration-500 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white to-blue-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 shadow-inner"></div>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          <button
            ref={mobileMenuRef}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <div className="flex items-center space-x-3 p-1 rounded-xl hover:bg-gray-50 transition-colors group">
              {/* <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {authUser?.userName || "Student"}
                </div>
              </div> */}
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                {getAvatarContent()}
              </div>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}

              >
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
            </div>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48  bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {authUser?.userName || "Student"}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {authUser?.userEmail || "student@example.com"}
                  </div>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-2">
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/30 p-4 animate-in slide-in-from-top-2 shadow-2xl">
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 rounded-xl font-semibold transition-all duration-200 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default StudentViewCommonHeader;
