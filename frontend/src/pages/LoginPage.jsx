import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import alayaLogo from '../assets/images/image copy 2.png';
import { loginUser } from '../services/api'; 

const LoginPage = ({ onLoginSuccess, onGoToRegister, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      const response = await loginUser({ email, password });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user)); 
        alert("WELCOME BACK TO ALAYA!"); 
        onLoginSuccess();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "THE SANCTUARY IS CURRENTLY UNREACHABLE.";
      setError(errorMsg.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E1D8] flex items-center justify-center p-6 font-sans selection:bg-[#C67347] selection:text-white relative overflow-hidden">
      <div className="absolute top-[-5%] right-[-2%] w-175 h-175 bg-linear-to-br from-[#C67347]/25 to-transparent rounded-full blur-[140px]"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-150 h-150 bg-white/50 rounded-full blur-[110px]"></div>

      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 relative z-10">
        
        <div className="md:w-5/12 space-y-5 text-left transition-all duration-700">
          <span className="text-[11px] uppercase tracking-[0.5em] font-bold text-[#C67347]">The Portal to Peace</span>
          <h2 className="text-5xl md:text-6xl font-serif leading-[1.1] text-stone-900">
            Welcome back to <br />
            <span className="italic text-[#C67347]">Alaya.</span>
          </h2>
          <div className="h-0.5 w-20 bg-[#C67347]"></div>
          <p className="text-stone-700 leading-relaxed max-w-sm text-lg font-medium opacity-90">
            Logging into Alaya is more than entering a portal; it is a commitment to your daily ritual. 
            Access your curated flows and stillness in one breath.
          </p>
        </div>
        
        <div className="w-full max-w-115">
          <div className="bg-white/60 backdrop-blur-3xl rounded-[60px] p-10 md:p-12 shadow-[0_40px_80px_rgba(139,69,19,0.12)] border border-white/80 text-center">
            
            <div className="flex items-center justify-center gap-5 mb-10 bg-stone-100/50 py-4 px-8 rounded-3xl border border-stone-200/50">
              <img src={alayaLogo} alt="Alaya Logo" className="w-12 h-12 object-contain" />
              <div className="h-8 w-px bg-stone-300"></div>
              <div className="text-left">
                <h1 className="text-2xl font-serif text-stone-900 leading-tight">Sign In</h1>
                <p className="text-[8px] uppercase tracking-[0.3em] font-black text-stone-500">Sanctuary Access</p>
              </div>
            </div>

            {error && (
              <p className="text-[#D9534F] text-[10px] font-bold mb-6 tracking-widest uppercase animate-pulse">
                {error}
              </p>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="text-left space-y-2">
                <label className="ml-6 text-[10px] uppercase tracking-widest font-bold text-stone-600">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-[#C67347] transition-colors" />
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    className="w-full bg-white/80 border border-stone-200 rounded-full py-4 pl-14 pr-8 outline-none text-sm transition-all focus:ring-4 focus:ring-[#C67347]/10 focus:border-[#C67347] shadow-inner"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="text-left space-y-2 relative">
                <div className="flex justify-between items-center px-6">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-stone-600">Password</label>
                  <button 
                    type="button" 
                    onClick={onForgotPassword}
                    className="text-[10px] uppercase tracking-widest font-bold text-[#C67347] hover:opacity-70 transition-opacity"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-[#C67347] transition-colors" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-white/80 border border-stone-200 rounded-full py-4 pl-14 pr-8 outline-none text-sm transition-all focus:ring-4 focus:ring-[#C67347]/10 focus:border-[#C67347] shadow-inner"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-[#C67347] hover:bg-[#A0522D] text-white py-5 rounded-full text-xs uppercase tracking-[0.3em] font-bold shadow-2xl shadow-orange-900/30 transition-all hover:scale-[1.03] active:scale-[0.97]"
                >
                  Login
                </button>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-stone-200 flex flex-col items-center gap-4">
              <p className="text-sm font-medium text-stone-600">Don't have an account?</p>
              <button 
                onClick={onGoToRegister}
                className="bg-[#333] hover:bg-black text-white px-10 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg transition-all active:scale-95"
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;