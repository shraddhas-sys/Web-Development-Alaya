import React from 'react';

const DashboardTab = ({
  sessions = [],
  plans = [],
  streak = 0,
  weeklyCount = 0,
  weeklyGoal = 4,
  weeklyProgressPct = 0,
  monthlyCount = 0,
  sessionsLast14DaysBars = { days: [], max: 1 },
  completedTotal = 0,
  DEFAULT_YOGA_TYPES = [],
  addPlannedSession,
  completeSession,
  deleteSession,
  // Props from Parent 
  quickDate,
  setQuickDate,
  quickType,
  setQuickType,
  quickDuration,
  setQuickDuration
}) => {

  const today = new Date().toLocaleDateString("en-CA");

  // Planned sessions 
  const upcomingSessions = (sessions || [])
    .filter(s => s.status === 'planned' && s.date >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const completedSessions = (sessions || [])
    .filter(s => s.status === 'completed')
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  // Form submit handler
  const handleInternalSubmit = (e) => {
    e.preventDefault();
    if (addPlannedSession) {
      addPlannedSession({
        date: quickDate,
        type: quickType,
        durationMinutes: Number(quickDuration)
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 font-sans items-start">

      {/* Left Main Overview part */}
      <div className="flex-[2.5] bg-[#F9F7F2] rounded-[45px] p-10 shadow-sm border border-[#E5E1D8] relative overflow-hidden">

        {/* Header Section */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-[10px] font-bold text-[#A8A294] uppercase tracking-[0.2em] mb-1">Overview</p>
            <h1 className="text-[38px] font-serif text-[#3A352E] leading-tight">Your ritual at a glance</h1>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-[#3A352E] uppercase tracking-wider mb-1">Weekly goal</span>
            <div className="flex items-center gap-2 bg-white border border-[#E5E1D8] px-3 py-1.5 rounded-xl shadow-sm">
              <span className="text-base font-bold text-[#3A352E]">{weeklyGoal}</span>
            </div>
          </div>
        </div>

        {/* Main Stat Boxes */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            {
              label: 'Completed',
              value: completedTotal,
              sub: 'total sessions',
              bg: 'bg-[#FDFBF7]', 
              text: 'text-[#5C4033]',
              border: 'border-[#EEEAE3]',
              labelColor: 'text-[#A8A294]'
            },
            {
              label: 'This Week',
              value: weeklyCount,
              sub: 'last 7 days',
              bg: 'bg-[#C67347]', 
              text: 'text-white',
              border: 'border-[#B0653E]',
              labelColor: 'text-[#FADCCB]'
            },
            {
              label: 'Streak',
              value: streak,
              sub: 'days in a row',
              bg: 'bg-[#EADBC8]', 
              text: 'text-[#5C4033]',
              border: 'border-[#D9C5B2]',
              labelColor: 'text-[#8D6E63]'
            }
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`${stat.bg} ${stat.border} border-2 p-8 rounded-[35px] shadow-sm transition-all duration-300 hover:scale-[1.03] group`}
            >
              <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${stat.labelColor}`}>
                {stat.label}
              </p>
              <div className={`text-[52px] font-light ${stat.text} leading-none mb-3`}>
                {stat.value}
              </div>
              <p className={`text-[10px] font-medium opacity-70 ${stat.bg === 'bg-[#C67347]' ? 'text-white' : 'text-stone-500'}`}>
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Weekly Consistency Progress Bar */}
        <div className="mb-14">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h4 className="text-sm font-bold text-[#3A352E] mb-0.5 tracking-tight">Weekly consistency</h4>
              <p className="text-[11px] text-[#A8A294]">{weeklyCount} of {weeklyGoal} sessions</p>
            </div>
            <span className="text-sm font-black text-[#3A352E]">{weeklyProgressPct}%</span>
          </div>
          <div className="w-full h-4 bg-[#E5E1D8]/40 rounded-full overflow-hidden shadow-inner border border-white/20">
            <div
              className="h-full bg-[#C67347] rounded-full transition-all duration-1000 ease-out shadow-sm"
              style={{ width: `${Math.min(weeklyProgressPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Activity Chart Section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-sm font-bold text-[#3A352E] tracking-tight">Last 14 days</h4>
              <p className="text-[10px] text-[#A8A294] italic font-serif opacity-80">Connected to Sanctuary Database</p>
            </div>
            <p className="text-[10px] text-[#A8A294] font-bold uppercase tracking-tighter">Monthly: {monthlyCount} sessions</p>
          </div>

          <div className="bg-white/40 rounded-[40px] p-8 flex items-end justify-between h-52 gap-2 border border-white/60 shadow-inner">
            {sessionsLast14DaysBars.days.map((d, i) => {
              const dateObj = new Date(d.date);
              const label = `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}`;

              return (
                <div key={i} className="flex flex-col items-center flex-1 h-full group">
                  <div className="w-full bg-white rounded-full relative h-[80%] overflow-hidden border border-[#E5E1D8]/30">
                    <div
                      className="absolute bottom-0 w-full bg-[#C67347] transition-all duration-700 rounded-full"
                      style={{
                        height: `${Math.max((d.count / (sessionsLast14DaysBars.max || 1)) * 100, d.count > 0 ? 25 : 8)}%`,
                        opacity: d.count > 0 ? 1 : 0.2
                      }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-[#A8A294] mt-4 tracking-tighter group-hover:text-[#C67347] transition-colors">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick add */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-[#F9F7F2] rounded-[45px] p-10 shadow-sm border border-[#E5E1D8]">
          <p className="text-[10px] font-black text-[#A8A294] uppercase tracking-widest mb-2">Quick Add</p>
          <h2 className="text-2xl font-serif text-[#3A352E] mb-2 leading-tight">Log a session</h2>

          <form onSubmit={handleInternalSubmit} className="space-y-6 mt-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#3A352E] ml-2 uppercase tracking-widest">Date</label>
              <input
                type="date"
                value={quickDate}
                onChange={(e) => setQuickDate(e.target.value)}
                className="w-full p-4 bg-white border border-[#E5E1D8] rounded-2xl text-sm outline-none shadow-sm focus:ring-1 focus:ring-[#C67347]/30 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#3A352E] ml-2 uppercase tracking-widest">Yoga Type</label>
              <select
                value={quickType}
                onChange={(e) => setQuickType(e.target.value)}
                className="w-full p-4 bg-white border border-[#E5E1D8] rounded-2xl text-sm outline-none cursor-pointer shadow-sm"
              >
                {DEFAULT_YOGA_TYPES.length > 0 ? (
                  DEFAULT_YOGA_TYPES.map(t => <option key={t} value={t}>{t}</option>)
                ) : (
                  <option disabled>No yoga types available</option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#3A352E] ml-2 uppercase tracking-widest">Duration (Min)</label>
              <input
                type="number"
                value={quickDuration}
                onChange={(e) => setQuickDuration(e.target.value)}
                className="w-full p-4 bg-white border border-[#E5E1D8] rounded-2xl text-sm outline-none shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-[#C67347] text-white rounded-[28px] font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#3A352E] transition-all shadow-lg shadow-[#C67347]/20 active:scale-95"
            >
              Add to Progress
            </button>
          </form>
        </div>

        <div className="bg-[#F9F7F2] rounded-[45px] p-10 border border-[#E5E1D8] shadow-sm flex-grow">
          <h3 className="text-[10px] font-black text-[#3A352E] uppercase tracking-widest mb-1">Upcoming</h3>
          <div className="py-8 px-6 border border-white rounded-[35px] bg-white/40 mt-4">
            {upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSessions.slice(0, 5).map(s => (
                  <div key={s.id} className="flex justify-between items-center p-4 bg-white/70 rounded-2xl border border-stone-100/40 group relative">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => completeSession && completeSession(s.id)}
                        className="w-6 h-6 rounded-full border-2 border-stone-200 flex items-center justify-center hover:border-[#C67347] hover:bg-[#C67347]/10 transition-all group-item"
                        title="Mark as Complete"
                      >
                        <span className="text-[10px] opacity-0 group-item-hover:opacity-100 transition-opacity">✓</span>
                      </button>
                      <div>
                        <p className="text-[12px] font-bold text-stone-800">{s.type || s.yogaType || 'Yoga'}</p>
                        <p className="text-[10px] text-stone-400">{s.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-[11px] font-black text-stone-600">{s.durationMinutes || 30} min</div>
                      <button
                        onClick={() => deleteSession && deleteSession(s.id)}
                        className="text-stone-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Plan"
                      >
                        <span className="text-xs">✕</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-[#A8A294] leading-relaxed font-serif italic text-center py-6">
                No rituals planned for today.
              </p>
            )}
          </div>
        </div>

        {/* Completed Sessions List */}
        <div className="bg-[#F9F7F2] rounded-[45px] p-10 border border-[#E5E1D8] shadow-sm">
          <h3 className="text-[10px] font-black text-[#3A352E] uppercase tracking-widest mb-1">Completed Sessions</h3>
          <p className="text-[10px] text-[#A8A294] italic font-serif mt-1">Only completed sessions affect your progress.</p>

          <div className="mt-5 space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            {completedSessions.length > 0 ? (
              completedSessions.slice(0, 10).map((s, idx) => (
                <div key={s.id || idx} className="p-4 bg-white/70 rounded-2xl border border-stone-100/40 group">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-[12px] font-bold text-stone-800">{s.type || s.yogaType || 'Yoga'}</p>
                      <p className="text-[10px] text-stone-400">
                        Planned: {s.date}
                        {s.completedAt && <span className="ml-2">• Completed: {new Date(s.completedAt).toLocaleDateString()}</span>}
                      </p>
                      {s.notes && <p className="text-[10px] text-stone-400 italic mt-1">“{s.notes}”</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-[11px] font-black text-stone-600">{(s.durationMinutes ?? s.duration ?? 0)} min</div>
                      <button
                        onClick={() => deleteSession && deleteSession(s.id)}
                        className="text-stone-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete Entry"
                      >
                        <span className="text-xs">✕</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-[11px] text-[#A8A294] leading-relaxed font-serif italic">No completed sessions yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;