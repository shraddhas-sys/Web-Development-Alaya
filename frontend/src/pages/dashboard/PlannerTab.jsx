import React, { useState, useEffect, useMemo } from 'react';
import { Card, SmallLabel } from './ui';

const PlannerTab = ({
  upcoming7Days = [],
  DEFAULT_YOGA_TYPES = ["Vinyasa", "Hatha", "Yin", "Ashtanga", "Meditation"],
  plans: plansProp = [],
  sessions = [],
  addPlannedSession,
  completePlan,
  completeSession,
  addFavorite,
  setActiveTab
}) => {
  const [planDate, setPlanDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [planType, setPlanType] = useState("Vinyasa");
  const [planDuration, setPlanDuration] = useState(30);
  const [planNotes, setPlanNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Synchronize planType with dynamic yoga types from admin
  useEffect(() => {
    if (DEFAULT_YOGA_TYPES && DEFAULT_YOGA_TYPES.length > 0) {
      setPlanType(DEFAULT_YOGA_TYPES[0]);
    }
  }, [DEFAULT_YOGA_TYPES]);

  // Merge new Planned Sessions
  const allUpcoming = useMemo(() => {
    const legacyPlans = (plansProp || []).filter(p => String(p.status || 'planned') !== 'completed');
    const plannedSessions = (sessions || []).filter(s => s.status === 'planned');
    return [...legacyPlans, ...plannedSessions];
  }, [plansProp, sessions]);

  const handleAddClick = async () => {
    if (!planDate || !planType) return alert("Please fill required fields");

    setLoading(true);
    try {
      const payload = { date: planDate, yogaType: planType, duration: Number(planDuration), notes: planNotes };

      if (typeof addPlannedSession === 'function') {
        await addPlannedSession(payload);
      } else {
        // Local-only fallback 
        setPlans(prev => ([...prev, { id: Date.now(), ...payload }]));
      }

      setPlanNotes("");
    } catch (error) {
      console.error("Plan save error:", error);
      alert("Could not save plan. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (item) => {
    try {
      if (item.yogaType && typeof completePlan === 'function') {
        await completePlan(item);
      } else if (typeof completeSession === 'function') {
        await completeSession(item.id);
      }
    } catch (error) {
      console.error("Complete ritual error:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <Card className="p-10 min-h-[600px]">
          <SmallLabel>Yoga Planner</SmallLabel>
          <h2 className="text-4xl font-serif text-stone-900 mb-4">Plan your sessions</h2>
          <p className="text-xs text-stone-400 mb-10">Schedule daily flows and keep them organized. Your rituals are safe in our sanctuary.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {upcoming7Days.map(date => {
              const dailyPlans = (allUpcoming || []).filter(p => {
                const isSameDay = p.date && String(p.date).includes(date);
                return isSameDay;
              });

              return (
                <div key={date} className="p-5 bg-stone-50/50 border border-stone-100 rounded-[25px] hover:bg-white hover:shadow-sm transition-all">
                  <p className="text-[11px] font-black text-stone-900 mb-2">{date}</p>
                  <div className="space-y-2">
                    {dailyPlans.length > 0 ? (
                      dailyPlans.map(p => (
                        <div key={p.id} className="text-[10px] bg-[#C67347]/10 text-[#C67347] p-3 rounded-xl font-bold flex flex-col gap-1 relative group">
                          <div className="flex justify-between items-start">
                            <span>{p.yogaType || p.type || 'Yoga'}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => typeof addFavorite === 'function' && addFavorite(p.yogaType ? 'plan' : 'session', p.id)}
                                className="hover:scale-125 transition-transform bg-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm"
                                title="Add to favourites"
                              >
                                ❤️
                              </button>
                              <button
                                onClick={() => handleComplete(p)}
                                className="hover:scale-125 transition-transform bg-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm"
                                title="Complete"
                              >
                                ✓
                              </button>
                            </div>
                          </div>
                          <span className="opacity-70 font-medium">{p.duration || p.durationMinutes || 0} mins</span>
                          {p.notes && <span className="text-[8px] italic opacity-60">"{p.notes}"</span>}
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-stone-400 italic mt-2">No sessions planned.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Right side form */}
      <div className="lg:col-span-4">
        <Card className="p-8">
          <SmallLabel>New Plan</SmallLabel>
          <h3 className="text-2xl font-serif text-stone-900 mb-8">Schedule a session</h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Date</label>
              <input
                type="date"
                value={planDate}
                onChange={e => setPlanDate(e.target.value)}
                className="w-full bg-stone-50/50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-1 focus:ring-[#C67347]/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Yoga Type</label>
              <select
                value={planType}
                onChange={e => setPlanType(e.target.value)}
                className="w-full bg-stone-50/50 border-none rounded-2xl p-4 text-sm outline-none"
              >
                {DEFAULT_YOGA_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Duration (Min)</label>
              <input
                type="number"
                value={planDuration}
                onChange={e => setPlanDuration(e.target.value)}
                className="w-full bg-stone-50/50 border-none rounded-2xl p-4 text-sm outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Notes (Optional)</label>
              <textarea
                placeholder="e.g., Focus on hips + breathwork"
                value={planNotes}
                onChange={e => setPlanNotes(e.target.value)}
                className="w-full bg-stone-50/50 border-none rounded-2xl p-4 text-sm h-24 outline-none resize-none"
              ></textarea>
            </div>

            <button
              onClick={handleAddClick}
              disabled={loading}
              className={`w-full py-5 ${loading ? 'bg-stone-300' : 'bg-[#C67347]'} text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all`}
            >
              {loading ? "Adding..." : "Add to Planner"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PlannerTab;
