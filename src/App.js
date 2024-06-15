import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Homepage";
import HealthActivities from "./HealthActivities";
import HealthReceipts from "./HealthReceipts";
import Records from "./Records";
import Navbar from "./Navbar";
import NotFound from "./NotFound";
import Footer from "./Footer";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/records" element={<Records />} />
        <Route path="/healthActivities" element={<HealthActivities />} />
        <Route path="/healthReceipts" element={<HealthReceipts />} />
        <Route path="*" element={<NotFound />} />{" "}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
