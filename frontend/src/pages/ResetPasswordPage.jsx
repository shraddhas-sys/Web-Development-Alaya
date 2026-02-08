import React, { useState } from 'react';

const ResetPasswordPage = ({ onResetSuccess, onBackToLogin }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const requirements = [
    { label: "8+ Char", met: password.length >= 8 },
    { label: "Strength", met: /[0-9!@#$%^&*]/.test(password) },
    { label: "Identity", met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
  ];

  const strengthScore = requirements.filter(req => req.met).length;
  const isMatch = password.length > 0 && password === confirmPassword;

  return (
    <div className="min-h-screen bg-[#E9EDE1] flex items-center justify-center font-sans p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-150 h-150 bg-[#B6C4A2]/30 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-white/40 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-12 bg-[#5F6F52]"></div>
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#5F6F52]">Security Ritual</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-serif italic text-[#2D4028] leading-[1.05]">
            Secure <br /> 
            <span className="text-[#889970] not-italic font-sans font-black tracking-tight">IDENTITY.</span>
          </h1>

          <div className="mt-8 flex gap-3">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-2 rounded-full transition-all duration-700 ${
                  strengthScore >= s ? 'bg-[#2D4028] w-16' : 'bg-white/60 w-12 shadow-inner'
                }`} 
              />
            ))}
          </div>
        </div>
        <div className="md:col-span-7 bg-[#F4F7ED] p-10 md:p-14 rounded-[60px] border-4 border-white shadow-[0_40px_100px_rgba(95,111,82,0.12)]">
          <form className="space-y-12" onSubmit={(e) => { e.preventDefault(); onResetSuccess(); }}>
            
            <div className="space-y-12 pt-4">
              <div className="relative group">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#B6C4A2] py-4 outline-none focus:border-[#2D4028] transition-all text-xl text-[#2D4028] placeholder-transparent peer"
                  placeholder="Create new password"
                  id="pass"
                />
                <label 
                  htmlFor="pass" 
                  className={`absolute left-0 transition-all pointer-events-none uppercase font-black tracking-[0.2em]
                    ${password ? '-top-6 text-[11px] text-[#2D4028]' : 'top-4 text-lg text-[#5F6F52]'} 
                    peer-focus:-top-6 peer-focus:text-[11px] peer-focus:text-[#2D4028]`}
                >
                  Create new password
                </label>
              </div>
              <div className="relative group">
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#B6C4A2] py-4 outline-none focus:border-[#2D4028] transition-all text-xl text-[#2D4028] placeholder-transparent peer"
                  placeholder="Confirm password"
                  id="confirm"
                />
                <label 
                  htmlFor="confirm" 
                  className={`absolute left-0 transition-all pointer-events-none uppercase font-black tracking-[0.2em]
                    ${confirmPassword ? '-top-6 text-[11px] text-[#2D4028]' : 'top-4 text-lg text-[#5F6F52]'} 
                    peer-focus:-top-6 peer-focus:text-[11px] peer-focus:text-[#2D4028]`}
                >
                  Confirm password
                </label>
              </div>
            </div>

            {/* Tags: High Contrast Pills */}
            <div className="flex flex-wrap gap-3">
              {requirements.map((req, i) => (
                <span key={i} className={`text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full border-2 transition-all duration-500 ${
                  req.met 
                  ? 'bg-[#5F6F52] text-white border-[#5F6F52] shadow-md' 
                  : 'bg-white/40 text-[#5F6F52]/40 border-white'
                }`}>
                  {req.label}
                </span>
              ))}
            </div>

            <div className="pt-6 flex flex-col items-center gap-8">
              <button 
                type="submit"
                disabled={strengthScore < 3 || !isMatch}
                className="w-full bg-[#5F6F52] hover:bg-[#4A573E] text-white font-black py-6 rounded-[35px] shadow-[0_20px_40px_rgba(95,111,82,0.3)] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-20 disabled:grayscale uppercase tracking-[0.4em] text-xs"
              >
                Establish Access
              </button>
              
              <button 
                type="button"
                onClick={onBackToLogin}
                className="text-[#5F6F52]/60 hover:text-[#2D4028] text-[10px] font-black uppercase tracking-[0.4em] transition-all border-b-2 border-transparent hover:border-[#2D4028]"
              >
                Return to Sanctuary
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] border-[1px] border-[#2D4028]/5 rounded-full -z-10 animate-pulse"></div>
    </div>
  );
};

export default ResetPasswordPage;