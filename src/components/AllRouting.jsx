import React from "react";
import { Route, Routes } from "react-router-dom";
import GeographyPage from "../pages/geography/geographyPage";
import TimePage from "../pages/time/timePage";
import IncomePage from "../pages/income/incomePage";
import HomePage from "../pages/Home/HomePage";

const AllRouting = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/geography" element={<GeographyPage />} />
      <Route path="/time" element={<TimePage />} />
      <Route path="/income" element={<IncomePage />} />
    </Routes>
  );
};

export default AllRouting;
