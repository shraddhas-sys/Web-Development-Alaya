import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from "./pages/dashboard/Dashboard"; 
import AdminDashboard from "./pages/dashboard/AdminDashboard"; 
import './index.css';

// Initialize the curent page state
function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      
      if (token && user) {
        return user.role === 'admin' ? 'admin-dashboard' : 'dashboard';
      }
    } catch (e) {
      console.error("Auth initialization error", e);
    }
    return 'landing';
  });
// Navigation helpers to switch between different views
  const goToLogin = () => setCurrentPage('login');
  const goToRegister = () => setCurrentPage('register');
  const goToLanding = () => setCurrentPage('landing');
  const goToForgotPassword = () => setCurrentPage('forgot-password');
  const goToResetPassword = () => setCurrentPage('reset-password');
  const goToAdminDashboard = () => setCurrentPage('admin-dashboard');

  const handleLoginSuccess = () => {
    try {
      const savedUser = localStorage.getItem("user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      if (user && user.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('dashboard');
      }
    } catch (e) {
      setCurrentPage('dashboard');
    }
  };
// Clear session data and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentPage('login');
  };

  return (
    <div className="App min-h-screen bg-stone-50 font-sans text-stone-900 transition-all duration-500">
      {/* Public pages */}
      {currentPage === 'landing' && <LandingPage onGetStarted={goToLogin} />}
      {currentPage === 'login' && <LoginPage onGoToRegister={goToRegister} onForgotPassword={goToForgotPassword} onLoginSuccess={handleLoginSuccess} />}
      {currentPage === 'register' && <RegisterPage onGoToLogin={goToLogin} onRegisterSuccess={() => { alert('Account created!'); goToLogin(); }} />}
      {currentPage === 'forgot-password' && <ForgotPasswordPage onBackToLogin={goToLogin} onResetSent={goToResetPassword} />}
      {currentPage === 'reset-password' && <ResetPasswordPage onBackToLogin={goToLogin} onResetSuccess={() => { alert('Success!'); goToLogin(); }} />}

      {/* User Dashboard */}
      {currentPage === 'dashboard' && <Dashboard onLogout={handleLogout} />}
      {currentPage === 'admin-dashboard' && (
        <AdminDashboard 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}

export default App;