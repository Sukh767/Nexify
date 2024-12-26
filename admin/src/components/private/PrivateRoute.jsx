import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    // Redirect to login if not authenticated
    toast.error("Please login"),
    <Navigate to="/auth/login" replace />
  );
};

export default PrivateRoute;
