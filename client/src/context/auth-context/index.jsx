import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, googleLogin, loginService, registerService } from "@/services";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {

  const navigate = useNavigate();
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  async function handleRegisterUser(event) {
    event.preventDefault();
    const data = await registerService(signUpFormData);
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    const data = await loginService(signInFormData);
    console.log(data, "datadatadatadatadata");

    if (data.success) {
      sessionStorage.setItem(
        "accessToken",
        JSON.stringify(data.data.accessToken)
      );
      sessionStorage.setItem('user', JSON.stringify(data.data.user));
      setAuth({
        authenticate: true,
        user: data.data.user,
      });
    } else {
      setAuth({
        authenticate: false,
        user: null,
      });
    }
  }

  //check auth user

  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
        setLoading(false);
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (!error?.response?.data?.success) {
        setAuth({
          authenticate: false,
          user: null,
        });
        setLoading(false);
      }
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
        const data = await googleLogin(credentialResponse.access_token)
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
        } else {
          setAuth({
            authenticate: false,
            user: null,
          });
        }
        navigate("/home")
      } catch (error) {
        console.error('Google authentication failed:', error.message);
      }
    },
    onError: () => {
      console.log('Google Login Failed');
    },
    flow: "implicit",
  });

  const logout = () => {
    sessionStorage.clear();
    navigate("/auth");
    googleLogout()
  };

  useEffect(() => {
    checkAuthUser();
  }, []);

  console.log(auth, "gf");

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
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
