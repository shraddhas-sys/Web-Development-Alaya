import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const SettingsTab = ({ user, createToast }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) setUsername(user.username || '');
  }, [user]);

  const persistUserVisibility = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!username.trim()) return createToast("Username is required", "error");
    setIsUpdating(true);
    try {
      const res = await api.updateProfileAPI({ userId: user.id, username: username.trim() });
      if (res.data.success) {
        persistUserVisibility({ ...user, username: username.trim() });
        createToast("Username updated ✨");
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (err) {
      createToast(err.response?.data?.message || "Failed to update username", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      return createToast("Both fields are required", "error");
    }

    // User-side validation 
    if (passwordForm.newPassword.length < 8 || !/[A-Z]/.test(passwordForm.newPassword)) {
      return createToast("Password must be 8+ chars with one uppercase letter.", "error");
    }

    setIsUpdating(true);
    try {
      const res = await api.changePasswordAPI({ userId: user.id, ...passwordForm });
      if (res.data.success) {
        createToast("Security strengthened! 🛡️");
        setPasswordForm({ currentPassword: '', newPassword: '' });
      }
    } catch (err) {
      createToast(err.response?.data?.message || "Failed to change password", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await api.deleteAccountAPI(user.id);
      if (res.data.success) {
        localStorage.clear();
        window.location.href = "/login";
      }
    } catch (err) {
      createToast("Failed to delete account", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700 font-sans pb-20">
      <div className="mb-10 px-2">
        <h2 className="text-3xl font-serif font-bold text-stone-800 italic">Settings</h2>
        <p className="text-stone-500 text-[10px] mt-1 tracking-[0.2em] font-black uppercase opacity-60">Control your sanctuary journey</p>
      </div>

      <div className="space-y-8">
        {/* Username Section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-10 border border-stone-100 shadow-xl">
          <h3 className="text-[10px] font-black text-[#ae511f] uppercase tracking-widest mb-6">Identity</h3>
          <form onSubmit={handleUpdateUsername} className="flex flex-col md:flex-row gap-4">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="flex-1 bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#ae511f] outline-none transition-all"
            />
            <button
              type="submit"
              disabled={isUpdating}
              className="px-10 py-4 bg-[#ae511f] text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#8e4219] transition-all"
            >
              Update Name
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-10 border border-stone-100 shadow-xl">
          <h3 className="text-[10px] font-black text-[#ae511f] uppercase tracking-widest mb-6">Security</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                className="bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm outline-none"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                className="bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm outline-none"
              />
            </div>
            <p className="text-[9px] text-stone-400 italic">Min 8 characters, at least one uppercase letter required.</p>
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full md:w-auto px-10 py-4 bg-stone-800 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all"
            >
              Change Password
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50/30 backdrop-blur-xl rounded-[40px] p-10 border border-red-100/50 shadow-xl">
          <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-6">Danger Zone</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex-1 py-4 bg-white border border-stone-200 text-stone-600 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-stone-50 transition-all"
            >
               Logout
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 py-4 bg-white border border-red-200 text-red-500 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all"
            >
               Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-sm text-center shadow-2xl border border-stone-100">
            <span className="text-4xl mb-6 block">✨</span>
            <h3 className="text-2xl font-serif text-stone-800 mb-2">Pause your journey?</h3>
            <p className="text-xs text-stone-500 mb-8">Are you sure you want to logout?</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogout}
                className="w-full py-4 bg-[#ae511f] text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#8e4219]"
              >
                Yes, Log out
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-4 text-stone-400 font-bold text-[10px] uppercase tracking-widest hover:text-stone-800"
              >
                Stay in Alaya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-sm text-center shadow-2xl border border-red-100">
            <span className="text-4xl mb-6 block"></span>
            <h3 className="text-2xl font-serif text-stone-800 mb-2">Dissolve Identity?</h3>
            <p className="text-xs text-stone-500 mb-8">Are you sure you want to delete your account? This cannot be undone.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteAccount}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-600"
              >
                Delete Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-4 text-stone-400 font-bold text-[10px] uppercase tracking-widest hover:text-stone-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
