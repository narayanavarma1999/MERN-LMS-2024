import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { useSelector } from "react-redux";

function RouteGuard({ element }) {
  const location = useLocation();
  const authData = useSelector(store => store.auth);

  const authenticated = authData?.isAuthenticated || false;
  const user = authData?.user || null;

  if (authData?.loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" replace />;
  }

  if (
    authenticated &&
    user?.role !== "instructor" &&
    (location.pathname.includes("instructor") ||
      location.pathname.includes("/auth"))
  ) {
    return <Navigate to="/home" replace />;
  }

  if (
    authenticated &&
    user?.role === "instructor" &&
    !location.pathname.includes("instructor")
  ) {
    return <Navigate to="/instructor" replace />;
  }

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;