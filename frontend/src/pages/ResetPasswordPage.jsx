import React, { useState } from 'react';
import api from '../services/api';

const ResetPasswordPage = ({ onResetSuccess, onBackToLogin }) => {
  // states for form data
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

// form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.resetPasswordAPI(token, password);
      if (res.data.success) {
        onResetSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to secure identity. Please verify token.");
    } finally {
      setLoading(false);
    }
  };

  // password validation rules
  const requirements = [
    { label: "8+ Char", met: password.length >= 8 },
    { label: "Strength", met: /[0-9!@#$%^&*]/.test(password) },
    { label: "Identity", met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
  ];

  const strengthScore = requirements.filter(req => req.met).length;
  const isMatch = password.length > 0 && password === confirmPassword;

  return (
    <div className="min-h-screen bg-[#E6E4DA] flex items-center justify-center font-sans p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-150 h-150 bg-[#B37B56]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-[#889970]/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-12 bg-[#B37B56]"></div>
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#B37B56]">Path Recovery</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-serif italic text-[#333333] leading-[1.05]">
            Secure <br />
            <span className="text-[#B37B56] not-italic font-sans font-black tracking-tight uppercase">Identity.</span>
          </h1>
          <div className="mt-8 flex gap-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-700 ${strengthScore >= s ? 'bg-[#B37B56] w-16' : 'bg-white/40 w-12 shadow-inner'
                  }`}
              />
            ))}
          </div>
        </div>

        <div className="md:col-span-7 bg-[#F9F8F3] p-10 md:p-14 rounded-[60px] border-4 border-white shadow-[0_40px_100px_rgba(0,0,0,0.08)]">
          <form className="space-y-12" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center bg-red-50 py-3 rounded-xl">{error}</p>}

            <div className="space-y-12 pt-4">
              <div className="relative group">
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#D9D7CC] py-4 outline-none focus:border-[#B37B56] transition-all text-xl text-[#333333] placeholder-transparent peer"
                  placeholder="Recovery Token"
                  id="token"
                  required
                />
                <label
                  htmlFor="token"
                  className={`absolute left-0 transition-all pointer-events-none uppercase font-black tracking-[0.2em]
                    ${token ? '-top-6 text-[11px] text-[#B37B56]' : 'top-4 text-lg text-[#999999]'} 
                    peer-focus:-top-6 peer-focus:text-[11px] peer-focus:text-[#B37B56]`}
                >
                  Recovery Token
                </label>
              </div>

              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#D9D7CC] py-4 outline-none focus:border-[#B37B56] transition-all text-xl text-[#333333] placeholder-transparent peer"
                  placeholder="New Password"
                  id="pass"
                  required
                />
                <label
                  htmlFor="pass"
                  className={`absolute left-0 transition-all pointer-events-none uppercase font-black tracking-[0.2em]
                    ${password ? '-top-6 text-[11px] text-[#B37B56]' : 'top-4 text-lg text-[#999999]'} 
                    peer-focus:-top-6 peer-focus:text-[11px] peer-focus:text-[#B37B56]`}
                >
                  Create New Password
                </label>
              </div>

              <div className="relative group">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#D9D7CC] py-4 outline-none focus:border-[#B37B56] transition-all text-xl text-[#333333] placeholder-transparent peer"
                  placeholder="Confirm Password"
                  id="confirm"
                  required
                />
                <label
                  htmlFor="confirm"
                  className={`absolute left-0 transition-all pointer-events-none uppercase font-black tracking-[0.2em]
                    ${confirmPassword ? '-top-6 text-[11px] text-[#B37B56]' : 'top-4 text-lg text-[#999999]'} 
                    peer-focus:-top-6 peer-focus:text-[11px] peer-focus:text-[#B37B56]`}
                >
                  Verify Password
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {requirements.map((req, i) => (
                <span key={i} className={`text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full border-2 transition-all duration-500 ${req.met
                  ? 'bg-[#B37B56] text-white border-[#B37B56] shadow-md'
                  : 'bg-white/40 text-[#999999] border-white'
                  }`}>
                  {req.label}
                </span>
              ))}
            </div>

            <div className="pt-6 flex flex-col items-center gap-8">
              <button
                type="submit"
                disabled={strengthScore < 3 || !isMatch || loading}
                className="w-full bg-[#B37B56] hover:bg-[#966343] text-[#F9F8F3] font-black py-6 rounded-[35px] shadow-[0_20px_40px_rgba(179,123,86,0.3)] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-20 disabled:grayscale uppercase tracking-[0.4em] text-xs"
              >
                {loading ? "STRENGTHENING..." : "Establish Access"}
              </button>

              <button
                type="button"
                onClick={onBackToLogin}
                className="text-[#999999] hover:text-[#333333] text-[10px] font-black uppercase tracking-[0.4em] transition-all border-b-2 border-transparent hover:border-[#333333]"
              >
                Return to Sanctuary
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] border-[1px] border-[#333333]/5 rounded-full -z-10 animate-pulse"></div>
    </div>
  );
};

export default ResetPasswordPage;