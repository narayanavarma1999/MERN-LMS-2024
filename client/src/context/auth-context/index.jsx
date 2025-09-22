import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, googleLogin, loginService, registerService } from "@/services";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addUser } from "@/lib/appstore/userslice";
import { loginSuccess } from "@/lib/appstore/authslice";
import { useDispatch, useSelector } from "react-redux";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch()
  const [user, setUser] = useState(null);
  const userData = useSelector(store => store.user)


  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      console.log(`signUpFormData:${signUpFormData}`)
      const data = await registerService(signUpFormData);
      console.log(`registration data:${JSON.stringify(data)}`)
      if (data.success) {
        toast.success("Account created successfully!");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    try {
      const data = await loginService(signInFormData);
      if (data.success) {
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        toast.success("Welcome back!");
        sessionStorage.setItem('user', JSON.stringify(data.data.user));
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        navigate("/home");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  }

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      console.log(`checkAuthService:${JSON.stringify(checkAuthService)}`)
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(data.data.accessToken)
        );
        sessionStorage.setItem('user', JSON.stringify(data.data.user));
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        dispatch(addUser(user));
        setUser(user)
        setIsAuthenticated(true)
        dispatch(loginSuccess(user))
      }
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
      console.log("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const data = await googleLogin(credentialResponse.access_token);
        if (data.data.success) {
          sessionStorage.setItem(
            "accessToken",
            JSON.stringify(data.data.accessToken)
          );
          sessionStorage.setItem('user', JSON.stringify(data.data.user));
          setAuth({
            authenticate: true,
            user: data.data.user,
          });
          toast.success("Google login successful!");
          navigate("/home");
        } else {
          toast.error("Google authentication failed");
        }
      } catch (error) {
        console.error('Google authentication failed:', error);
        toast.error("Google authentication failed");
      }
    },
    onError: () => {
      toast.error("Google login failed");
    },
    flow: "implicit",
  });

  const logout = () => {
    sessionStorage.clear();
    googleLogout();
    resetCredentials();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  useEffect(() => {
    if (!userData) {
      checkAuthUser()
    } else {
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        handleGoogleSignIn,
        logout,
        auth,
        resetCredentials,
        showPassword,
        setShowPassword,
      }}
    >
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}