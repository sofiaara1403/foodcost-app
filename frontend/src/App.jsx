import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// SESUAIKAN DENGAN NAMA FILE DI SIDEBAR VS CODE KAMU
import LoginPage from "./pages/LoginPage"; 
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard"; // Di sidebar namanya Dashboard.jsx
import RecipeDetailPage from "./pages/RecipeDetailPage"; // Di sidebar namanya RecipeDetailPage.jsx

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Utama */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Route Login & Register */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Route Detail (Gunakan RecipeDetailPage sesuai sidebar) */}
        <Route path="/details/:id" element={<RecipeDetailPage />} />
        
        {/* Redirect jika path tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;