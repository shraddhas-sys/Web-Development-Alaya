import React, { useMemo } from 'react';
import { Card, SmallLabel } from './ui';

const FavoritesTab = ({
  favorites = [],
  removeFavorite,
  setActiveTab,
  sessions = []
}) => {

// Group favorites
  const grouped = useMemo(() => {
    const g = { plan: [], session: [], meal: [], yogaType: [], recipe: [] };
    for (const f of favorites) {
      if (g[f.itemType]) g[f.itemType].push(f);
      else g.recipe.push(f);
    }
    return g;
  }, [favorites]);

  // Count how many times each yoga type has been practiced
  const yogaCounts = useMemo(() => {
    const acc = {};
    (sessions || []).forEach(s => {
      const type = s.yogaType || s.type;
      if (!type) return;
      acc[type] = (acc[type] || 0) + 1;
    });
    return acc;
  }, [sessions]);

  const topYoga = useMemo(() => {
    return Object.entries(yogaCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  }, [yogaCounts]);

  const maxSessions = topYoga.length > 0 ? topYoga[0][1] : 1;

  const renderEmpty = (label, tabId) => (
    <div className="col-span-full py-16 text-center bg-white/40 rounded-[45px] border-2 border-dashed border-stone-200 flex flex-col items-center">
      <span className="text-4xl mb-4 opacity-30">💾</span>
      <p className="text-stone-400 font-serif italic text-lg px-4">No favourites saved for {label}.</p>
      {tabId && (
        <button
          onClick={() => setActiveTab && setActiveTab(tabId)}
          className="mt-6 text-[10px] font-black bg-stone-900 text-white px-8 py-4 rounded-full uppercase tracking-widest hover:bg-[#ae511f] transition-all"
        >
          EXPLORE
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-12 pb-20 animate-fade-in font-sans">
      <div className="flex justify-between items-start p-2">
        <div>
          <SmallLabel>PERSONAL SANCTUARY</SmallLabel>
          <h2 className="text-4xl font-serif text-stone-900 mt-2 tracking-tight">Favourites</h2>
          <p className="text-stone-400 text-sm mt-2 font-light italic">Saved items for fast access.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <Card className="p-8 bg-[#ae511f] text-white border-none shadow-xl shadow-[#ae511f]/20 rounded-[45px] relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-6">Routine Insight</p>
              <h3 className="text-2xl font-serif mb-8">Beloved Yoga Types</h3>
              <div className="space-y-6">
                {topYoga.map(([type, count]) => (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-sm font-serif tracking-wide">{type}</span>
                      <span className="text-[9px] font-black opacity-80 uppercase">{count} Sessions</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(count / maxSessions) * 100}%` }} />
                    </div>
                  </div>
                ))}
                {topYoga.length === 0 && (
                  <div className="text-center py-6 space-y-4">
                    <p className="text-[11px] opacity-60 italic">No practices found yet.</p>
                    <button
                      onClick={() => setActiveTab && setActiveTab('planner')}
                      className="text-[10px] font-black border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-[#ae511f] transition-all"
                    >
                      PLAN A RITUAL
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-10">
          <Card className="p-10 bg-stone-50/50 border border-stone-100/50 shadow-none rounded-[55px]">
            <div className="flex justify-between items-end mb-10 px-2">
              <div>
                <SmallLabel>YOGA PLANS</SmallLabel>
                <h3 className="text-3xl font-serif text-stone-900 mt-1">Saved Plans</h3>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-2xl font-serif text-stone-900">{grouped.plan.length + (grouped.session?.length || 0)}</p>
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Items Saved</p>
              </div>
            </div>
            
        {/* Right Column: List of Saved Yoga Plans & Meals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {([...grouped.plan, ...grouped.session]).length > 0 ? ([...grouped.plan, ...grouped.session]).map(f => (
                <div key={f.id} className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm relative">
                  <button
                    onClick={() => removeFavorite && removeFavorite(f.id)}
                    className="absolute top-6 right-6 text-[#ae511f] hover:scale-125 transition-transform"
                    title="Remove from favourites"
                  >
                    ❤️
                  </button>
                  <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.2em] mb-2">{f.itemType === 'session' ? 'Ritual' : 'Plan'}</p>
                  <h5 className="text-xl font-serif text-stone-800 mb-2">{f.item?.yogaType || f.item?.type || "Yoga Plan"}</h5>
                  <p className="text-[10px] text-stone-500 font-bold">{f.item?.date || ""} • {f.item?.duration || f.item?.durationMinutes || 0} mins</p>
                  {f.item?.notes && <p className="text-[10px] text-stone-400 italic mt-4">"{f.item.notes}"</p>}
                </div>
              )) : renderEmpty("Yoga Plans", "planner")}
            </div>
          </Card>

        {/* Yoga Plans Section */}
          <Card className="p-10 bg-stone-50/50 border border-stone-100/50 shadow-none rounded-[55px]">
            <div className="flex justify-between items-end mb-10 px-2">
              <div>
                <SmallLabel>NUTRITION</SmallLabel>
                <h3 className="text-3xl font-serif text-stone-900 mt-1">Saved Meals</h3>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-2xl font-serif text-stone-900">{grouped.meal.length}</p>
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Items Saved</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {grouped.meal.length > 0 ? grouped.meal.map(f => (
                <div key={f.id} className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm relative">
                  <button
                    onClick={() => removeFavorite && removeFavorite(f.id)}
                    className="absolute top-6 right-6 text-[#ae511f] hover:scale-125 transition-transform"
                    title="Remove from favourites"
                  >
                    ❤️
                  </button>
                  <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.2em] mb-2">{f.item?.timeSlot || "Meal"}</p>
                  <h5 className="text-xl font-serif text-stone-800 mb-2">{f.item?.name || "Meal"}</h5>
                  <p className="text-[10px] text-stone-500 font-bold">{f.item?.kcal || 0} KCAL</p>
                  {f.item?.ingredients && <p className="text-[10px] text-stone-400 italic mt-4">{String(f.item.ingredients).slice(0, 120)}</p>}
                </div>
              )) : renderEmpty("Meals", "nutrition")}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FavoritesTab;
