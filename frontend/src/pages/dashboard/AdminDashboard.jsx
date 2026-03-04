import React, { useState, useEffect, useMemo } from 'react';
import api from "../../services/api";
import Sidebar from "../../components/adminSidebar";
import Header from "../../components/Header";

// Tabs
import OverviewTab from "./OverviewTab";
import SeekerDirectoryTab from "./SeekerDirectoryTab";
import RitualManagerTab from "./RitualManagerTab";
import YogaLibrary from "./YogaLibrary";
import ProgressOverviewTab from "./ProgressOverviewTab";
import NutritionLibraryTab from "./NutritionLibraryTab";
import SettingsTab from "./SettingsTab";
import AdminFavoritesTab from "./AdminFavoritesTab.jsx";

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [yogaPlans, setYogaPlans] = useState([]);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [globalStats, setGlobalStats] = useState({
    totalRituals: 0,
    totalSeekers: 0,
    revenue: "$0",
    growth: "0%"
  });

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const admin = useMemo(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) { return null; }
  }, []);

  const createToast = (msg, type = "success") => {
    console.log(`${type.toUpperCase()}: ${msg}`);
  };


  const refreshNotifications = async () => {
    try {
      const res = await api.getMyNotificationsAPI();
      setNotifications(res.data.data || []);
    } catch (e) { }
  };

  const markAllNotifsRead = async () => {
    try {
      await api.markAllNotificationsReadAPI();
      await refreshNotifications();
    } catch (e) { }
  };

  const markOneNotifRead = async (id) => {
    try {
      await api.markNotificationReadAPI(id);
      await refreshNotifications();
    } catch (e) { }
  };

  const deleteNotif = async (id) => {
    try {
      await api.deleteNotificationAPI(id);
      await refreshNotifications();
    } catch (e) { }
  };

  // Search Logic
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length > 1) handleAdminSearch();
      else setSearchResults(null);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleAdminSearch = async () => {
    setIsSearching(true);
    try {
      const res = await api.getGlobalSearch(searchQuery);
      if (res.data.success) setSearchResults(res.data.results);
    } catch (err) { console.error("Search Error:", err); }
    finally { setIsSearching(false); }
  };

  // Data laoding engine
  const loadAdminData = async (isFirstLoad = false) => {
    try {
      if (isFirstLoad) setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

    //  get master dataa 
      const res = await api.API.get('/admin/all-data', config);

      if (res.data && res.data.success) {
        setUsers(res.data.users || []);
        setYogaPlans(res.data.yoga || []);
        setNutritionPlans(res.data.nutrition || []);

        setGlobalStats({
          totalRituals: res.data.totalRituals || 0,
          totalSeekers: res.data.totalUsers || 0,
          revenue: res.data.revenue || "$12,450",
          growth: res.data.growth || "85%"
        });
      }

    //  get session data
      const sessionRes = await api.API.get('/admin/all-sessions', config).catch(() => null);
      if (sessionRes && sessionRes.data.success) {
        setSessions(sessionRes.data.sessions || []);
      }


      // get notification
      const notifRes = await api.getMyNotificationsAPI().catch(() => ({ data: { data: [] } }));
      setNotifications(notifRes.data.data || []);


    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      if (isFirstLoad) setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData(true);
    const interval = setInterval(() => loadAdminData(false), 10000); 
    return () => clearInterval(interval);
  }, []);

  // Action Delete User
  const deleteUser = async (userId) => {
    if (!window.confirm("Permanently remove this seeker from the sanctuary? This will invalidate their session instantly.")) return;
    try {
      const res = await api.deleteUserAdmin(userId);
      if (res.data.success) {
        loadAdminData(); 
        createToast("Seeker removed successfully");
      }
    } catch (err) { createToast(err.response?.data?.message || "Delete Error", "error"); }
  };

  // Ban User
  const banUser = async (userId) => {
    if (!window.confirm("Restrict this seeker's access to the sanctuary? Status: Disabled.")) return;
    try {
      const res = await api.disableUserAdmin(userId);
      if (res.data.success) {
        loadAdminData();
        createToast("Seeker access restricted.");
      }
    } catch (err) { createToast(err.response?.data?.message || "Ban Error", "error"); }
  };

  // Action Delete Yoga Item 
  const deleteYoga = async (id) => {
    if (!window.confirm("Delete this yoga ritual?")) return;
    try {
      const res = await api.API.delete(`/admin/yoga-types/${id}`);
      if (res.data.success) loadAdminData();
    } catch (err) { console.error(err); }
  };

  //  Action Delete Recipe
  const deleteRecipe = async (id) => {
    if (!window.confirm("Delete this nutrition recipe?")) return;
    try {
      const res = await api.API.delete(`/admin/recipes/${id}`);
      if (res.data.success) loadAdminData();
    } catch (err) { console.error(err); }
  };

  const deleteSession = async (id) => {
    if (!window.confirm("Remove this ritual log?")) return;
    try {
      const res = await api.API.delete(`/admin/sessions/${id}`);
      if (res.data.success) loadAdminData();
    } catch (err) { console.error(err); }
  };

  const renderContent = () => {
    const commonProps = {
      users,
      sessions,
      yogaPlans,
      nutritionPlans,
      globalStats,
      deleteUser,
      banUser,
      deleteSession,
      loading,
      refreshData: loadAdminData,
      setActiveTab
    };

    switch (activeTab) {
      case 'overview': return <OverviewTab {...commonProps} />;
      case 'directory': return <SeekerDirectoryTab {...commonProps} />;
      case 'rituals': return <RitualManagerTab {...commonProps} />;
      case 'library': return <YogaLibrary yogaPlans={yogaPlans} refreshData={loadAdminData} deleteYoga={deleteYoga} />;
      case 'progress': return <ProgressOverviewTab />;
      case 'nutrition': return <NutritionLibraryTab nutritionPlans={nutritionPlans} refreshData={loadAdminData} deleteRecipe={deleteRecipe} />;
      case 'favorites': return <AdminFavoritesTab />;
      case 'sanctuary-settings': return <SettingsTab user={admin} createToast={createToast} />;
      default: return <OverviewTab {...commonProps} />;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#E5E1D8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#C67347]/20 border-t-[#C67347] rounded-full animate-spin"></div>
        <p className="tracking-widest uppercase text-[10px] font-bold text-[#C67347]">Synchronizing Alaya...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E5E1D8] flex font-sans text-stone-900 overflow-hidden relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      <main className="ml-72 flex-1 h-screen overflow-y-auto p-12 custom-scrollbar relative">
        <Header
          userName={admin?.username || "Guardian"}
          role="Sanctuary Admin"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
          notifications={notifications}
          markAllAsRead={markAllNotifsRead}
          markOneAsRead={markOneNotifRead}
          deleteNotification={deleteNotif}
          setActiveTab={setActiveTab}
          settingsTabId="sanctuary-settings"
          user={admin}
        />

        {/* Global Search Result */}
        {searchResults && searchQuery.length > 1 && (
          <div className="absolute top-28 left-12 right-12 bg-white/95 backdrop-blur-xl rounded-[40px] shadow-2xl border border-stone-100 z-[110] p-10">
            <div className="flex justify-between items-center mb-8 border-b border-stone-50 pb-4">
              <p className="text-[10px] font-black text-[#C67347] uppercase tracking-[0.3em]">Search Results: {searchQuery}</p>
              <button onClick={() => setSearchQuery("")} className="text-stone-400 hover:text-red-500 font-bold text-xs transition-colors">Close ×</button>
            </div>

            <div className="grid grid-cols-2 gap-12">
              <div>
                <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-6">👥 Seekers</h4>
                <div className="space-y-4">
                  {searchResults.users.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-4 bg-stone-50/50 rounded-2xl">
                      <p className="text-sm font-bold text-stone-800">{u.username}</p>
                      <button onClick={() => { setActiveTab('directory'); setSearchQuery(""); }} className="text-[9px] font-black text-[#C67347] uppercase">Manage</button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-6">🍲 Nutrition</h4>
                <div className="space-y-4">
                  {searchResults.recipes.map(r => (
                    <div key={r.id} className="p-4 bg-stone-50/50 rounded-2xl flex justify-between items-center">
                      <p className="text-sm font-bold text-stone-800">{r.name}</p>
                      <button onClick={() => { setActiveTab('nutrition'); setSearchQuery(""); }} className="text-[9px] font-black text-stone-400 uppercase">Edit</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 animate-fade-in pb-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;