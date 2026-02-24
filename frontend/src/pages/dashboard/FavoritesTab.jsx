import React from 'react';
import { Card, SmallLabel } from './ui';

const FavoritesTab = ({ 
  nutrition, 
  sessions, 
  handleAddGroceryItem, 
  toggleRecipeFavorite, 
  setActiveTab 
}) => {
  
  const yogaCounts = sessions.reduce((acc, s) => {
    acc[s.yogaType] = (acc[s.yogaType] || 0) + 1;
    return acc;
  }, {});
  
  const topYoga = Object.entries(yogaCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const maxSessions = topYoga.length > 0 ? topYoga[0][1] : 1;

  // २. फेभरेट रेसिपीहरू
  const favRecipes = nutrition.recipes.filter(r => r.isFavorite) || [];

  return (
    <div className="space-y-12 pb-20 animate-fade-in font-sans">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start p-2">
        <div>
          <SmallLabel>PERSONAL SANCTUARY</SmallLabel>
          <h2 className="text-4xl font-serif text-stone-900 mt-2 tracking-tight">Your Collection</h2>
          <p className="text-stone-400 text-sm mt-2 font-light italic">A curated space reflecting your journey of peace.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-8">
  
          <Card className="p-8 bg-[#ae511f] text-white border-none shadow-xl shadow-[#ae511f]/20 rounded-[45px] relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-white/5 text-[10rem] font-serif italic select-none">🧘</div>
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
                    {/* सानो प्रोग्रेस बार */}
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-1000" 
                        style={{ width: `${(count / maxSessions) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                
                {topYoga.length === 0 && (
                  <div className="text-center py-6 space-y-4">
                    <p className="text-[11px] opacity-60 italic">No practices found yet.</p>
                    <button 
                      onClick={() => setActiveTab('planner')}
                      className="text-[10px] font-black border border-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-[#ae511f] transition-all"
                    >
                      PLAN A RITUAL
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-10 bg-white border border-stone-100 shadow-sm rounded-[45px] flex flex-col items-center text-center justify-center space-y-4">
            <span className="text-[#ae511f] text-2xl animate-pulse">✨</span>
            <h4 className="text-lg font-serif text-stone-800 leading-relaxed italic">
              "Your sacred space is where you can find yourself again and again."
            </h4>
            <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">— Joseph Campbell</p>
          </Card>
        </div>
        <div className="lg:col-span-8">
          <Card className="p-10 bg-stone-50/50 border border-stone-100/50 shadow-none rounded-[55px] h-full">
            <div className="flex justify-between items-end mb-10 px-2">
              <div>
                <SmallLabel>NOURISHMENT</SmallLabel>
                <h3 className="text-3xl font-serif text-stone-900 mt-1">Favorite Recipes</h3>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-2xl font-serif text-stone-900">{favRecipes.length}</p>
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Items Saved</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favRecipes.map(recipe => (
                <div 
                  key={recipe.id} 
                  className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ae511f] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button 
                    onClick={() => toggleRecipeFavorite(recipe.id)}
                    className="absolute top-8 right-8 text-[#ae511f] hover:scale-125 transition-transform z-20"
                    title="Remove from favorites"
                  >
                    ❤️
                  </button>
                  
                  <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.2em] mb-2">Essential</p>
                  <h5 className="text-xl font-serif text-stone-800 mb-8 lowercase tracking-tight group-hover:text-[#ae511f] transition-colors pr-6">
                    {recipe.name}
                  </h5>
                  
                  <button 
                    onClick={() => handleAddGroceryItem(recipe.name)}
                    className="w-full py-4 bg-stone-900 text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.15em] hover:bg-[#ae511f] active:scale-[0.98] transition-all shadow-lg shadow-stone-200"
                  >
                    Add to Grocery List
                  </button>
                </div>
              ))}
              
              {favRecipes.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white/40 rounded-[45px] border-2 border-dashed border-stone-200 flex flex-col items-center">
                  <span className="text-4xl mb-4 opacity-30">🥣</span>
                  <p className="text-stone-400 font-serif italic text-lg px-4">Your heart list is currently empty.</p>
                  <button 
                    onClick={() => setActiveTab('nutrition')}
                    className="mt-6 text-[10px] font-black bg-stone-900 text-white px-8 py-4 rounded-full uppercase tracking-widest hover:bg-[#ae511f] transition-all"
                  >
                    EXPLORE RECIPES
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default FavoritesTab;