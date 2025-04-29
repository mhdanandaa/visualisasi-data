import React from "react";
import { Routes, Route } from "react-router-dom";
import GeographyPage from "../pages/geography/geographyPage";
import TimePage from "../pages/time/timePage";
import IncomePage from "../pages/income/IncomePage";
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/login/LoginPage";
import PrivateRouting from "./PrivateRouting";
import InputData from "../pages/InputData";

const AllRouting = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRouting>
            <HomePage />
          </PrivateRouting>
        }
      />
      <Route
        path="/geography"
        element={
          <PrivateRouting>
            <GeographyPage />
          </PrivateRouting>
        }
      />
      <Route
        path="/time"
        element={
          <PrivateRouting>
            <TimePage />
          </PrivateRouting>
        }
      />
      <Route
        path="/income"
        element={
          <PrivateRouting>
            <IncomePage />
          </PrivateRouting>
        }
      />
      <Route
        path="/input"
        element={
          <PrivateRouting>
            <InputData />
          </PrivateRouting>
        }
      />
    </Routes>
  );
};

export default AllRouting;
