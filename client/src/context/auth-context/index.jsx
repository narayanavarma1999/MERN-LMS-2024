import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { loginSuccess, logoutSuccess } from "@/lib/appstore/authslice";
import { checkAuthService, googleLogin, loginService, registerService } from "@/services";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const authData = useSelector(store => store.auth);

  useEffect(() => {
    checkAuthUser();
  }, []);

  async function storeCredentials(data) {
    const user = data.data.user;
    sessionStorage.setItem("accessToken", data.data.accessToken);
    sessionStorage.setItem('user', JSON.stringify(user));
    dispatch(loginSuccess(user));
  }

  function resetCredentials() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    dispatch(logoutSuccess());
  }

  async function handleRegisterUser(event) {
    event.preventDefault();
    try {
      console.log(`signUpFormData:${JSON.stringify(signUpFormData)}`)
      const data = await registerService(signUpFormData);
      if (data.success) {
        await storeCredentials(data);
        toast.success("Account created successfully!");
        navigate("/home");
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
        await storeCredentials(data);
        toast.success("Welcome back!");
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
      setLoading(true);


      const accessToken = sessionStorage.getItem("accessToken");
      const user = sessionStorage.getItem("user");

      if (!accessToken || !user) {
        resetCredentials();
        setLoading(false);
        return;
      }

      const data = await checkAuthService();
      if (data.success) {
        await storeCredentials(data);
      } else {
        resetCredentials();
        toast.error("Session expired. Please login again.");
      }
    } catch (error) {
      console.log("Auth check failed:", error);
      const accessToken = sessionStorage.getItem("accessToken");
      const userStr = sessionStorage.getItem("user");

      if (accessToken && userStr) {
        try {
          const user = JSON.parse(userStr);
          dispatch(loginSuccess(user));
        } catch (parseError) {
          resetCredentials();
        }
      } else {
        resetCredentials();
      }
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const data = await googleLogin(credentialResponse.access_token);
        if (data.success) {
          await storeCredentials(data);
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
    resetCredentials();
    googleLogout();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const auth = {
    authenticate: authData?.isAuthenticated || false,
    user: authData?.user || null
  };

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