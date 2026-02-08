import React from 'react';
import alayaLogo from '../assets/images/image copy 2.png';

const ForgotPasswordPage = ({ onBackToLogin, onResetSent }) => {
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

            <form className="space-y-12" onSubmit={(e) => {
              e.preventDefault();
              onResetSent(); 
            }}>
              <div className="relative group text-left">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-2 block group-focus-within:text-[#BC744F] transition-colors">
                  Email Address
                </label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-[#F7F6F2] border-none rounded-2xl px-6 py-5 text-stone-800 outline-none focus:ring-2 focus:ring-[#BC744F]/20 transition-all placeholder:text-stone-300"
                  placeholder="name@example.com"
                />
              </div>

              <div className="flex flex-col gap-8 pt-4">
                <button 
                  type="submit"
                  className="w-full bg-[#BC744F] hover:bg-[#3A3732] text-white py-5 rounded-full text-[11px] uppercase tracking-[0.4em] font-bold shadow-xl shadow-[#BC744F]/20 transition-all duration-500 transform hover:-translate-y-1"
                >
                  Send Recovery Link
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;