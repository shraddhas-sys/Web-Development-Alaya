import React, { useState, useEffect } from 'react';
import api from "../../services/api"; 
import { Shield, Mail, User, Lock, Save, CheckCircle } from 'lucide-react';

const SanctuarySettings = () => {
  const [adminInfo, setAdminInfo] = useState({ username: '', email: '' });
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.API.get('/admin/system-info');
        if (res.data.success) {
          setAdminInfo({
            username: res.data.adminInfo.username,
            email: res.data.adminInfo.email
          });
        }
      } catch (err) { console.error("Fetch error", err); }
    };
    fetchInfo();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await api.API.put('/admin/update-settings', {
        ...adminInfo,
        newPassword: passwords.newPassword
      });
      if (res.data.success) {
        setStatus({ type: 'success', message: 'Sanctuary configuration updated successfully!' });
        setPasswords({ newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to sync changes with sanctuary.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl animate-fade-in">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-stone-800 italic">Sanctuary Control Center</h2>
        <p className="text-stone-500 text-sm mt-1 tracking-wide uppercase">Manage your guardian credentials and portal security.</p>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-stone-200/60 overflow-hidden">
        <form onSubmit={handleUpdate} className="p-10 space-y-10">
          
          {/* Status Message */}
          {status.message && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
              status.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
            }`}>
              {status.type === 'success' ? <CheckCircle size={20} /> : <Shield size={20} />}
              <span className="font-medium text-sm">{status.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#C67347] flex items-center gap-2">
                <User size={14} /> Guardian Identity
              </h3>
              
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2 ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-[#C67347] transition-colors" size={18} />
                    <input 
                      type="text" 
                      value={adminInfo.username}
                      onChange={(e) => setAdminInfo({...adminInfo, username: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#C67347]/5 focus:border-[#C67347] transition-all text-stone-700 font-medium"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-[#C67347] transition-colors" size={18} />
                    <input 
                      type="email" 
                      value={adminInfo.email}
                      onChange={(e) => setAdminInfo({...adminInfo, email: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#C67347]/5 focus:border-[#C67347] transition-all text-stone-700 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#C67347] flex items-center gap-2">
                <Lock size={14} /> Security Key
              </h3>
              
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-[10px] font-bold text-stone-400 uppercase mb-2 ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-[#C67347] transition-colors" size={18} />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                      className="w-full bg-stone-50 border border-stone-200 py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#C67347]/5 focus:border-[#C67347] transition-all text-stone-700 font-medium"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-stone-400 italic px-1 leading-relaxed">
                  Leave blank if you do not wish to change your current security key.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-100 flex items-center justify-between">
            <div className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
              Alaya Guardian System v1.0.2
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-[#C67347] hover:bg-[#A85D36] text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-[#C67347]/20 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {loading ? 'Syncing...' : 'Save Sanctuary Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SanctuarySettings;