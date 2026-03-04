import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import api, { API } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DashboardTab from './DashboardTab';
import PlannerTab from './PlannerTab';
import NutritionTab from './NutritionTab';
import ProgressTab from './ProgressTab';
import FavoritesTab from './FavoritesTab';
import SettingsTab from './SettingsTab';

const Dashboard = ({ onLogout }) => {
  // States for navigation and Data Tracking
  const [activeTab, setActiveTab] = useState('sanctuary');
  const [sessions, setSessions] = useState([]);
  const [plans, setSessionsPlans] = useState([]);
  const [nutrition, setNutrition] = useState({ pantry: [], grocery: [], recipes: [], week: {} });
  const [notifications, setNotifications] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [yogaLibrary, setYogaLibrary] = useState([]);

// Search functionality states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Helper
  const getLocalDateString = (dateInput) => {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    return d.toLocaleDateString('en-CA');
  };

  const [quickDate, setQuickDate] = useState(getLocalDateString(new Date()));
  const [quickType, setQuickType] = useState('Vinyasa');
  const [quickDuration, setQuickDuration] = useState(30);

  const lastMilestoneReached = useRef(0);

  const user = useMemo(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  }, []);

  const createToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

 // API handlers
  const refreshNotifications = useCallback(async () => {
    try {
      const res = await api.getMyNotificationsAPI();
      setNotifications(res.data.data || []);
    } catch (e) { }
  }, []);

  const markAllNotifsRead = useCallback(async () => {
    try {
      await api.markAllNotificationsReadAPI();
      await refreshNotifications();
    } catch (e) { }
  }, [refreshNotifications]);

  const markOneNotifRead = useCallback(async (id) => {
    try {
      await api.markNotificationReadAPI(id);
      await refreshNotifications();
    } catch (e) { }
  }, [refreshNotifications]);

  const deleteNotif = useCallback(async (id) => {
    try {
      await api.deleteNotificationAPI(id);
      await refreshNotifications();
    } catch (e) { }
  }, [refreshNotifications]);

  const refreshFavorites = useCallback(async () => {
    try {
      const res = await api.getFavoritesAPI();
      setFavorites(res.data.data || []);
    } catch (e) { }
  }, []);

  const addFavorite = useCallback(async (itemType, itemId) => {
    try {
      await api.addFavoriteAPI({ itemType, itemId });
      await refreshFavorites();

      if (itemType === 'plan') {
        setSessionsPlans(prev => prev.filter(p => p.id !== itemId));
      } else if (itemType === 'session') {
        setSessions(prev => prev.filter(s => s.id !== itemId));
      }

      createToast("Added to favourites ❤️");
      setActiveTab('favorites');
    } catch (e) {
      createToast(e.response?.data?.message || "Failed to add favourite", "error");
    }
  }, [refreshFavorites, createToast]);

  const removeFavorite = useCallback(async (favoriteId) => {
    try {
      await api.deleteFavoriteAPI(favoriteId);
      await refreshFavorites();
      createToast("Removed from favourites");
    } catch (e) {
      createToast(e.response?.data?.message || "Failed to remove favourite", "error");
    }
  }, [refreshFavorites, createToast]);

  const deleteSession = useCallback(async (sessionId) => {
    try {
      const response = await api.deleteSessionAPI(sessionId);
      if (response.data.success) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        createToast("Session deleted", "success");
      }
    } catch (err) {
      createToast(err.response?.data?.message || "Failed to delete session", "error");
    }
  }, [createToast]);

  const addPlannedSession = async (formData) => {
    try {
      const response = await api.addSessionAPI({
        userId: user.id,
        date: formData.date,
        type: formData.yogaType || formData.type,
        durationMinutes: Number(formData.duration || formData.durationMinutes || 30)
      });
      if (response.data.success) {
        setSessions(prev => [...prev, response.data.data]);
        createToast("Session Planned! ");
        refreshNotifications();
        return response.data.data;
      }
    } catch (err) {
      createToast(err.response?.data?.message || "Failed to plan session", "error");
      return null;
    }
  };

  const completeSession = async (sessionId) => {
    try {
      const response = await api.completeSessionAPI(sessionId);
      if (response.data.success) {
        setSessions(prev => prev.map(s => s.id === sessionId ? response.data.data : s));
        createToast("Session Completed!");
        refreshNotifications();
      }
    } catch (err) {
      createToast(err.response?.data?.message || "Failed to complete session", "error");
    }
  };

  // Search Logic 
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        handleGlobalSearch();
      } else {
        setSearchResults(null);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleGlobalSearch = async () => {
    setIsSearching(true);
    try {
      const res = await api.getGlobalSearch(searchQuery);
      if (res.data.success) {
        setSearchResults(res.data.results);
      }
    } catch (err) {
      console.error("Global Search Error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Initial Data Load 
  useEffect(() => {
    if (!user?.id) return;
    const loadData = async () => {
      try {
        const [sess, plan, nut, notif, favRes, yogaLib] = await Promise.all([
          api.getSessionsAPI(user.id),
          api.getPlansAPI(user.id),
          api.fetchNutritionData(user.id),
          api.getMyNotificationsAPI().catch(() => ({ data: { data: [] } })),
          api.getFavoritesAPI().catch(() => ({ data: { data: [] } })),
          api.fetchYogaLibrary()
        ]);
        setSessions(sess.data.data || []);
        setSessionsPlans(plan.data.data || []);
        setNotifications(notif.data.data || []);
        setFavorites(favRes.data.data || []);
        if (yogaLib.data.success) {
          setYogaLibrary(yogaLib.data.data.map(y => y.name));
        }
        setNutrition({
          pantry: nut.data.pantry || [],
          grocery: nut.data.grocery || [],
          recipes: (nut.data.recipes || []).map(r => ({ ...r, isFavorite: !!(r.isfavorite || r.isFavorite) })),
          week: nut.data.week || {}
        });
      } catch (e) { console.error("Dashboard Load Error:", e); }
    };
    loadData();
  }, [user?.id]);

  //Statistics and Progress Logic
  const weeklyGoal = 4;

  const { weeklyCount, weeklyProgressPct, streak, monthlyCount, popularType, rawTotalThisWeek } = useMemo(() => {
    const completedSessions = (sessions || []).filter(s => s.status === 'completed');

    if (completedSessions.length === 0) {
      return { weeklyCount: 0, weeklyProgressPct: 0, streak: 0, monthlyCount: 0, popularType: '—', rawTotalThisWeek: 0 };
    }

    const todayStr = getLocalDateString(new Date());
    const now = new Date();

    const last7DaysSessions = completedSessions.filter(s => (now - new Date(s.completedAt)) / (1000 * 60 * 60 * 24) <= 7);
    const last30DaysSessions = completedSessions.filter(s => (now - new Date(s.completedAt)) / (1000 * 60 * 60 * 24) <= 30);

    //Streak Calculation
    const uniqueDates = Array.from(new Set(completedSessions.map(s => getLocalDateString(s.completedAt))))
      .sort((a, b) => new Date(b) - new Date(a));

    let computedStreak = 0;
    if (uniqueDates.length > 0) {
      const firstDate = uniqueDates[0];
      const diffInDaysToToday = Math.floor((new Date(todayStr) - new Date(firstDate)) / (1000 * 60 * 60 * 24));

      if (diffInDaysToToday <= 1) {
        computedStreak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const current = new Date(uniqueDates[i]);
          const next = new Date(uniqueDates[i + 1]);
          const diff = Math.floor((current - next) / (1000 * 60 * 60 * 24));
          if (diff === 1) computedStreak++;
          else break;
        }
      }
    }

    //Updated Popular Type Logic
    const counts = {};
    completedSessions.forEach(s => {
      const t = s.type || s.yogaType || 'Other';
      counts[t] = (counts[t] || 0) + 1;
    });
    const topType = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

    //Progress Logic
    const count7 = last7DaysSessions.length;
    const progressInCurrentCycle = count7 % weeklyGoal;
    let displayPct = (count7 > 0 && progressInCurrentCycle === 0) ? 100 : Math.round((progressInCurrentCycle / weeklyGoal) * 100);

    return {
      weeklyCount: progressInCurrentCycle,
      weeklyProgressPct: displayPct,
      streak: computedStreak,
      monthlyCount: last30DaysSessions.length,
      popularType: topType,
      rawTotalThisWeek: count7
    };
  }, [sessions, weeklyGoal]);

  useEffect(() => {
    const currentMilestone = Math.floor(rawTotalThisWeek / weeklyGoal);
    if (rawTotalThisWeek > 0 && rawTotalThisWeek % weeklyGoal === 0 && currentMilestone > lastMilestoneReached.current) {
      createToast("Weekly Goal Completed! Starting your next cycle... ✨", "success");
      lastMilestoneReached.current = currentMilestone;
    }
  }, [rawTotalThisWeek, weeklyGoal, createToast]);

  const sessionsLast14DaysBars = useMemo(() => {
    const completedSessions = (sessions || []).filter(s => s.status === 'completed');
    const days = [];
    const today = new Date();
    let maxCount = 1;
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = getLocalDateString(d);
      const count = completedSessions.filter(s => getLocalDateString(s.completedAt) === dateStr).length;
      if (count > maxCount) maxCount = count;
      days.push({ date: dateStr, count });
    }
    return { days, max: maxCount };
  }, [sessions]);

  //Tab Rendering 
  const renderContent = () => {
    const commonProps = {
      sessions, plans, nutrition, user, sessionsLast14DaysBars,
      weeklyGoal, weeklyCount, weeklyProgressPct, streak, monthlyCount, popularType,
      deleteSession, completeSession,
      DEFAULT_YOGA_TYPES: yogaLibrary,
      upcoming7Days: Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() + i);
        return getLocalDateString(d);
      })
    };

    switch (activeTab) {
      case 'sanctuary':
        return (
          <DashboardTab
            {...commonProps}
            completedTotal={(sessions || []).filter(s => s.status === 'completed').length}
            quickDate={quickDate}
            setQuickDate={setQuickDate}
            quickType={quickType}
            setQuickType={setQuickType}
            quickDuration={quickDuration}
            setQuickDuration={setQuickDuration}
            addPlannedSession={addPlannedSession}
            completeSession={completeSession}
          />
        );
      case 'planner':
        return (
          <PlannerTab
            {...commonProps}
            addFavorite={addFavorite}
            setActiveTab={setActiveTab}
            addPlannedSession={async (data) => {
              try {
                const res = await api.addPlanAPI({ userId: user.id, ...data });
                if (res.data.success) {
                  setSessionsPlans(p => [...p, res.data.data]);
                  createToast("Ritual Planned! ");
                  refreshNotifications();
                }
              } catch (err) {
                createToast("Failed to schedule plan", "error");
              }
            }}
            completePlan={async (plan) => {
              try {
                const res = await api.completePlanAPI(plan.id);
                if (res.data.success) {
                  const createdSession = res.data.data?.session;
                  if (createdSession) setSessions(prev => [createdSession, ...prev]);
                  setSessionsPlans(prev => prev.filter(p => p.id !== plan.id));
                  createToast("Plan Completed ");
                  refreshNotifications();
                }
              } catch (e) {
                createToast(e.response?.data?.message || "Failed to complete plan", "error");
              }
            }}
          />
        );
      case 'nutrition': return <NutritionTab {...commonProps} addFavorite={addFavorite} setActiveTab={setActiveTab} saveMealPlanForDate={(date, meals) => api.saveMealPlanAPI({ userId: user.id, date, ...meals }).then(() => { setNutrition(p => ({ ...p, week: { ...p.week, [date]: meals } })); createToast("Meal Saved! "); })} />;
      case 'favorites': return <FavoritesTab {...commonProps} favorites={favorites} removeFavorite={removeFavorite} setActiveTab={setActiveTab} />;
      case 'progress': return <ProgressTab {...commonProps} />;
      case 'settings': return <SettingsTab user={user} createToast={createToast} />;
      default: return <DashboardTab {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex font-sans text-stone-800 relative">
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-3xl shadow-2xl border border-stone-100 flex items-center gap-4 transition-all duration-500 animate-slide-up pointer-events-auto">
            <div className={`w-2 h-2 rounded-full ${t.type === 'success' ? 'bg-green-500' : 'bg-[#C67347]'}`} />
            <p className="text-[10px] font-black text-stone-700 uppercase tracking-widest">{t.message}</p>
          </div>
        ))}
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      <main className="ml-72 flex-1 p-12 overflow-x-hidden relative">
        <Header
          userName={user?.username || "Seeker"}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
          user={user}
          setActiveTab={setActiveTab}
          notifications={notifications}
          markAllAsRead={markAllNotifsRead}
          markOneAsRead={markOneNotifRead}
          deleteNotification={deleteNotif}
        />

        {/* Global Search Results Overlay */}
        {searchResults && searchQuery.trim().length > 1 && (
          <div className="fixed inset-0 z-[999] bg-stone-900/10 backdrop-blur-sm flex justify-center items-start pt-32 px-12">
            <div className="w-full max-w-5xl bg-white/95 backdrop-blur-2xl rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.15)] border border-stone-100 p-10 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-5">
                <div>
                  <p className="text-[10px] font-black text-[#C67347] uppercase tracking-[0.3em] mb-1">Sanctuary Intelligence</p>
                  <h4 className="text-2xl font-serif text-stone-900">Results for "{searchQuery}"</h4>
                </div>
                <button onClick={() => setSearchQuery("")} className="w-12 h-12 flex items-center justify-center bg-stone-100 hover:bg-[#C67347] hover:text-white rounded-full transition-all text-xl font-light">✕</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">🍲 Recipes</h4>
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                    {searchResults.recipes?.length > 0 ? searchResults.recipes.map(r => (
                      <div key={r.id} onClick={() => { setActiveTab('nutrition'); setSearchQuery(""); }} className="p-5 bg-stone-50/50 rounded-2xl hover:bg-orange-50 cursor-pointer transition-all border border-transparent hover:border-orange-100 group">
                        <p className="text-sm font-bold text-stone-800 group-hover:text-[#C67347]">{r.name}</p>
                        <p className="text-[9px] text-[#C67347] font-black uppercase mt-1 tracking-widest">{r.timeSlot} • {r.kcal} kcal</p>
                      </div>
                    )) : <p className="text-xs italic text-stone-300">No recipes found.</p>}
                  </div>
                </div>

                {/* Only admins see the Seekers section in search */}
                {user?.role === 'admin' && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">Seekers</h4>
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-4 custom-scrollbar">
                      {searchResults.users?.length > 0 ? searchResults.users.map(u => (
                        <div key={u.id} className="flex items-center gap-4 p-5 bg-stone-50/50 rounded-2xl border border-transparent">
                          <div className="w-10 h-10 bg-[#C67347] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg shadow-[#C67347]/20">
                            {u.username[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-stone-800">{u.username}</p>
                            <p className="text-[10px] text-stone-400 font-medium">{u.email}</p>
                          </div>
                        </div>
                      )) : <p className="text-xs italic text-stone-300">No seekers found.</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;