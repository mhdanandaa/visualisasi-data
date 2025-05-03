import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem("loggedIn");
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
