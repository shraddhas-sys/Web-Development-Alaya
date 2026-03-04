import React, { useState } from 'react';
import alayaLogo from '../assets/images/image copy 2.png';
import api from '../services/api';

const ForgotPasswordPage = ({ onBackToLogin, onResetSent }) => {
  // States
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');
  
// Recovery Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.forgotPasswordAPI({ email });
      if (res.data.success) {
        setResetToken(res.data.resetToken);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Email not found in Sanctuary records.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#EBE7E0] flex items-center justify-center p-6 font-sans selection:bg-[#BC744F]">
      <div className="max-w-5xl w-full bg-white rounded-[60px] shadow-[0_40px_100px_rgba(58,45,30,0.05)] overflow-hidden flex flex-col md:flex-row min-h-150 border border-white/50 relative z-10">
        <div className="md:w-[45%] bg-[#F2EDE4] p-12 flex flex-col justify-center items-center text-center relative border-r border-stone-100">

          <div className="relative z-10">
            <h2 className="text-4xl font-serif text-[#3A3732] leading-tight mb-8">
              Begin your <br />
              <span className="italic text-[#BC744F]">recovery.</span>
            </h2>
            <div className="relative w-44 h-44 mx-auto mb-10 flex items-center justify-center">
              <div className="absolute inset-0 border border-[#BC744F]/10 rounded-full"></div>
              <div className="absolute inset-4 border border-dashed border-[#BC744F]/20 rounded-full"></div>
              <img
                src={alayaLogo}
                alt="Alaya Logo"
                className="w-20 h-20 object-contain relative z-20 opacity-80"
              />
            </div>

            <div className="space-y-4">
              <div className="h-px w-24 bg-[#BC744F] mx-auto"></div>
              <p className="text-stone-500 text-[11px] tracking-[0.2em] uppercase font-bold max-w-55 mx-auto italic">
                "Every ritual starts with a single step into the sanctuary."
              </p>
            </div>
          </div>
        </div>
        <div className="md:w-[55%] p-10 md:p-24 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            <header className="mb-14 text-left">
              <span className="text-[10px] uppercase tracking-[0.6em] font-black text-[#BC744F] block mb-4">
                Path Recovery
              </span>
              <h2 className="text-4xl font-serif text-[#3A3732] italic leading-tight">Reset Access</h2>
            </header>

            {resetToken ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="p-8 bg-[#FDFBF7] border-2 border-[#BC744F]/20 rounded-[35px] text-center">
                  <p className="text-[10px] font-black text-[#BC744F] uppercase tracking-widest mb-4">Reset Token Located</p>
                  <div className="bg-white p-4 rounded-2xl border border-stone-100 mb-6 break-all font-mono text-sm text-stone-600">
                    {resetToken}
                  </div>
                  <p className="text-[11px] text-stone-500 font-serif italic mb-8">
                    "Recovery has begun. Use this token on the reset page."
                  </p>
                  <button
                    onClick={onResetSent}
                    className="w-full bg-[#BC744F] text-white py-5 rounded-full text-[11px] uppercase tracking-[0.4em] font-bold shadow-xl shadow-[#BC744F]/20"
                  >
                    Proceed to Reset
                  </button>
                </div>
              </div>
            ) : (
              <form className="space-y-12" onSubmit={handleSubmit}>
                {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center bg-red-50 py-3 rounded-xl">{error}</p>}

                <div className="relative group text-left">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-2 block group-focus-within:text-[#BC744F] transition-colors">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F7F6F2] border-none rounded-2xl px-6 py-5 text-stone-800 outline-none focus:ring-2 focus:ring-[#BC744F]/20 transition-all placeholder:text-stone-300"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="flex flex-col gap-8 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#BC744F] hover:bg-[#3A3732] text-white py-5 rounded-full text-[11px] uppercase tracking-[0.4em] font-bold shadow-xl shadow-[#BC744F]/20 transition-all duration-500 transform hover:-translate-y-1 disabled:opacity-50"
                  >
                    {loading ? "SEARCHING..." : "Send Recovery Link"}
                  </button>

                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="text-stone-400 text-[10px] uppercase tracking-[0.4em] font-bold hover:text-[#BC744F] transition-colors flex items-center justify-center gap-3"
                  >
                    <span className="text-lg">←</span> Back to Sanctuary
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;