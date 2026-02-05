import React, { useState } from 'react';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { registerUser } from '../services/api'; 
import alayaLogo from '../assets/images/image copy 2.png';

const RegisterPage = ({ onRegisterSuccess, onGoToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: formData.fullName, 
        email: formData.email,
        password: formData.password
      };
      
      const response = await registerUser(payload);
      if (response.data.success || response.status === 201) {
        alert("Registration Successful! Welcome to Alaya.");
        if (onRegisterSuccess) onRegisterSuccess();
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      alert(serverMessage || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDE8] flex items-center justify-center p-4 md:p-10 font-sans selection:bg-[#C67347] selection:text-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-200 h-200 bg-[#E2D9CF] rounded-full blur-[150px] opacity-60"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-125 h-125 bg-[#C67347]/10 rounded-full blur-[120px]"></div>

      <div className="max-w-6xl w-full bg-[#FCFAF7] rounded-[48px] shadow-[0_50px_100px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row relative z-10 border border-white">
        <div className="md:w-[42%] bg-[#E2D9CF] relative p-12 flex flex-col justify-between overflow-hidden">
          <div className="absolute -bottom-10 -left-10 w-64 h-64 border border-stone-300/50 rotate-12 rounded-3xl select-none pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-serif text-stone-800 leading-tight">
              Begin your <br />
              <span className="italic text-[#C67347]">journey.</span>
            </h1>
          </div>
          <div className="relative z-10 flex flex-col items-start">
             <div className="w-40 h-40 border border-[#C67347]/30 rounded-full flex items-center justify-center mb-8 relative bg-white/20 backdrop-blur-sm">
                <div className="absolute inset-2 border border-dashed border-[#C67347]/40 rounded-full"></div>
                <img src={alayaLogo} alt="Alaya Logo" className="w-20 h-20 object-contain relative z-20 drop-shadow-md" />
                <div className="absolute w-2.5 h-2.5 bg-[#C67347] rounded-full top-0 left-1/2 -translate-x-1/2 shadow-sm"></div>
             </div>
             <div className="space-y-4">
               <div className="h-px w-24 bg-[#C67347]"></div>
               <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-65 font-medium italic opacity-80">
                 "Every ritual starts with a single step into the sanctuary."
               </p>
             </div>
          </div>
        </div>
        <div className="md:w-[58%] p-8 md:p-16 bg-white flex flex-col justify-center">
          <div className="mb-12">
            <span className="text-[10px] uppercase tracking-[0.6em] font-black text-[#C67347] block mb-4">Registration</span>
            <h2 className="text-4xl font-serif text-stone-900 italic">Create Account</h2>
          </div>
          
          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="relative group">
                <User className="absolute right-0 bottom-3 w-4 h-4 text-stone-300 group-focus-within:text-[#C67347] transition-colors" />
                <input 
                  type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                  className="peer w-full bg-transparent border-b border-stone-200 py-2 pr-8 outline-none focus:border-[#C67347] transition-colors placeholder-transparent text-sm text-stone-800"
                  placeholder="Full Name" id="reg-name" required
                />
                <label htmlFor="reg-name" className="absolute left-0 -top-4 text-[10px] uppercase tracking-widest font-bold text-stone-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#C67347] transition-all cursor-text">Full Name</label>
              </div>
              <div className="relative group">
                <Mail className="absolute right-0 bottom-3 w-4 h-4 text-stone-300 group-focus-within:text-[#C67347] transition-colors" />
                <input 
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className="peer w-full bg-transparent border-b border-stone-200 py-2 pr-8 outline-none focus:border-[#C67347] transition-colors placeholder-transparent text-sm text-stone-800"
                  placeholder="Email" id="reg-email" required
                />
                <label htmlFor="reg-email" className="absolute left-0 -top-4 text-[10px] uppercase tracking-widest font-bold text-stone-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#C67347] transition-all cursor-text">Email Address</label>
              </div>
               <div className="relative group">
                <Lock className="absolute right-0 bottom-3 w-4 h-4 text-stone-300 group-focus-within:text-[#C67347] transition-colors" />
                <input 
                  type="password" name="password" value={formData.password} onChange={handleChange}
                  className="peer w-full bg-transparent border-b border-stone-200 py-2 pr-8 outline-none focus:border-[#C67347] transition-colors placeholder-transparent text-sm text-stone-800"
                  placeholder="Password" id="reg-pass" required
                />
                <label htmlFor="reg-pass" className="absolute left-0 -top-4 text-[10px] uppercase tracking-widest font-bold text-stone-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#C67347] transition-all cursor-text">Password</label>
              </div>
              <div className="relative group">
                <ShieldCheck className="absolute right-0 bottom-3 w-4 h-4 text-stone-300 group-focus-within:text-[#C67347] transition-colors" />
                <input 
                  type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                  className="peer w-full bg-transparent border-b border-stone-200 py-2 pr-8 outline-none focus:border-[#C67347] transition-colors placeholder-transparent text-sm text-stone-800"
                  placeholder="Repeat Password" id="reg-repeat" required
                />
                <label htmlFor="reg-repeat" className="absolute left-0 -top-4 text-[10px] uppercase tracking-widest font-bold text-stone-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#C67347] transition-all cursor-text">Repeat Password</label>
              </div>

            </div>
            <div className="flex items-center gap-3 pt-4">
              <input type="checkbox" className="w-4 h-4 accent-[#C67347] border-stone-300 focus:ring-0" id="terms" required />
              <label htmlFor="terms" className="text-[11px] text-stone-500 font-medium cursor-pointer">
                Accept <span className="text-stone-900 underline hover:text-[#C67347]">Sanctuary Rules</span>
              </label>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 pt-4">
              <button 
                type="submit" disabled={loading}
                className={`w-full md:w-auto bg-stone-900 hover:bg-[#C67347] text-white py-5 px-16 rounded-full text-xs uppercase tracking-[0.4em] font-bold shadow-xl transition-all hover:-translate-y-1 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : 'Sign Up'}
              </button>
              <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest">
                Already a member? <span onClick={onGoToLogin} className="text-[#C67347] cursor-pointer hover:underline">Log In</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;