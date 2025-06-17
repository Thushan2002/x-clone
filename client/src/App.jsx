import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/auth/Signup";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
