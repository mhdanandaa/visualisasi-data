import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRouting = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  return isLoggedIn === "true" ? children : <Navigate to="/login" />;
};

export default PrivateRouting;
