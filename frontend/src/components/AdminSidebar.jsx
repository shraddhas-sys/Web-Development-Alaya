import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Activity,
  LogOut,
  Calendar,
  ClipboardList,
  Settings,
  ShieldCheck,
  Flower,
  BarChart3,
  Heart
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'directory', label: 'Seeker Directory', icon: <Users size={20} /> },
    { id: 'rituals', label: 'Ritual Manager', icon: <Calendar size={20} /> },
    { id: 'library', label: 'Yoga Library', icon: <Flower size={20} /> },
    { id: 'progress', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'nutrition', label: 'Nutrition Library', icon: <ClipboardList size={20} /> },
    { id: 'favorites', label: 'Favourites', icon: <Heart size={20} /> },
    { id: 'sanctuary-settings', label: 'Sanctuary Settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      <div className="w-72 bg-[#1A1A1A] text-[#E5E1D8] h-screen fixed left-0 top-0 flex flex-col p-8 z-50 shadow-2xl">
       {/* logo section */}
        <div className="flex items-center gap-4 px-2 mb-12">
          <div className="bg-[#C67347] p-2.5 rounded-2xl rotate-3 shadow-lg group">
            <ShieldCheck className="text-white w-6 h-6 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-serif font-bold tracking-tight text-white leading-none">Alaya</h1>
            <p className="text-[9px] uppercase tracking-[0.3em] text-[#C67347] font-black mt-1">Admin Portal</p>
          </div>
        </div>

        {/* Menu items */}
        <nav className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-5 p-4 w-full rounded-[20px] transition-all duration-500 group relative ${activeTab === item.id
                  ? 'bg-[#C67347] text-white shadow-[0_15px_30px_rgba(198,115,71,0.3)]'
                  : 'hover:bg-white/5 text-stone-400 hover:text-stone-200'
                }`}
            >
              {activeTab === item.id && (
                <span className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
              )}

              <span className={`${activeTab === item.id ? 'text-white' : 'group-hover:text-[#C67347] transition-colors duration-300'}`}>
                {item.icon}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* logout part */}
        <div className="pt-6 border-t border-white/10">
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-4 p-4 w-full hover:bg-red-500/10 text-stone-400 hover:text-red-400 rounded-2xl transition-all duration-300 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold uppercase text-[10px] tracking-widest text-left">End Session</span>
          </button>
        </div>
      </div>

      {/* Admin Logout */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in font-sans">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-[40px] p-12 w-full max-w-sm text-center shadow-3xl">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl">
              </div>
              
            <h3 className="text-2xl font-serif text-white italic mb-3">End Admin Session?</h3>
            <p className="text-[11px] text-stone-400 uppercase tracking-widest mb-10 opacity-70">Are you sure you want to exit the portal?</p>

            <div className="flex flex-col gap-4">
              <button
                onClick={onLogout}
                className="w-full bg-[#ae511f] text-white py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#8e4219] transition-all"
              >
                Yes, End Session
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-5 text-stone-500 hover:text-white font-bold text-[10px] uppercase tracking-widest transition-colors"
              >
                Stay in Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;