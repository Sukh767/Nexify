import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { TriangleAlert } from "lucide-react";

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    // Redirect to login if not authenticated
    (toast("You're not login", {
      duration: 4000,
      position: "top-center",
      // Custom Icon
      icon: "🚨",
      style: {
        borderRadius: "10px",
        background: "#FFDE4D",
        color: "#000008",
      },

      // Aria
      ariaProps: {
        role: "status",
        "aria-live": "polite",
      },
    }),
    (<Navigate to="/auth/login" replace />))
  );
};

export default PrivateRoute;
