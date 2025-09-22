import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/auth-context/index.jsx";
import InstructorProvider from "./context/instructor-context/index.jsx";
import StudentProvider from "./context/student-context/index.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { Provider } from 'react-redux';
import store from "./lib/appstore/store.js";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/">
    <Provider store={store}>
      <GoogleOAuthProvider clientId="218175356120-v8q24ad210naru7opofkko6p56kr9clc.apps.googleusercontent.com">
        <AuthProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <InstructorProvider>
            <StudentProvider>
              <App />
            </StudentProvider>
          </InstructorProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </Provider>
  </BrowserRouter>
);
