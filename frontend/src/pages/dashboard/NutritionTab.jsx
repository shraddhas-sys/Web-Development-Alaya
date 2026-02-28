import React, { useState, useEffect } from 'react';
import { Card, SmallLabel } from './ui';

const NutritionTab = ({ 
  nutrition = { pantry: [], grocery: [], week: {}, recipes: [] }, 
  addPantryItem, 
  removePantryItem,
  addGroceryItem, 
  removeGroceryItem, 
  toggleGroceryItem,
  saveMealPlanForDate, 
  upcoming7Days = [],
  addRecipeItem, 
  removeRecipeItem,
  toggleRecipeFavorite 
}) => {
  const [activeBtn, setActiveBtn] = useState('ALL');
  const [pantryInput, setPantryInput] = useState("");
  const [groceryInput, setGroceryInput] = useState("");
  const [recipeInput, setRecipeInput] = useState("");
  const [selectedDate, setSelectedDate] = useState(upcoming7Days[0] || "");
  
  const [meals, setMeals] = useState({ breakfast: "", lunch: "", dinner: "", notes: "" });

  useEffect(() => {
    if (selectedDate && nutrition.week?.[selectedDate]) {
      const plan = nutrition.week[selectedDate];
      setMeals({
        breakfast: plan.breakfast || "",
        lunch: plan.lunch || "",
        dinner: plan.dinner || "",
        notes: plan.notes || ""
      });
    } else {
      setMeals({ breakfast: "", lunch: "", dinner: "", notes: "" });
    }
  }, [selectedDate, nutrition.week]);

  const handleSaveMeals = () => {
    if (!selectedDate) return;
    saveMealPlanForDate(selectedDate, meals);
  };

  const onAddRecipe = () => {
    if (recipeInput.trim()) {
      addRecipeItem(recipeInput.trim());
      setRecipeInput("");
    }
  };

  const onAddGrocery = () => {
    if (groceryInput.trim()) {
      addGroceryItem(groceryInput.trim());
      setGroceryInput("");
    }
  };

  const onAddPantry = () => {
    if (pantryInput.trim()) {
      addPantryItem(pantryInput.trim());
      setPantryInput("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F8F6] font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full">
        <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-8 h-fit">
          <div className="p-2 mb-4">
            <SmallLabel>NUTRITION</SmallLabel>
            <h2 className="text-3xl font-serif text-stone-900 mt-2 tracking-tight">Diet Planner</h2>
          </div>
          <div className="space-y-2">
            {['ALL', 'PANTRY', 'GROCERY LIST', 'THIS WEEK', 'RECIPE BOOK', 'HEALTHY HABITS'].map((btn) => (
              <button 
                key={btn} 
                onClick={() => setActiveBtn(btn)} 
                className={`w-full flex justify-between items-center p-5 rounded-[22px] border text-[10px] font-black tracking-[0.15em] transition-all duration-300 ${activeBtn === btn ? 'bg-[#C67347] border-[#C67347] text-white shadow-xl shadow-[#C67347]/20' : 'bg-white border-stone-100 text-stone-900 hover:bg-stone-50'}`}
              >
                {btn} <span>{activeBtn === btn ? '●' : '›'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-9 space-y-12 pb-20">
      
          {(activeBtn === 'ALL' || activeBtn === 'PANTRY') && (
            <div className={activeBtn === 'ALL' ? "grid grid-cols-1 md:grid-cols-2 gap-8" : ""}>
              <Card className="p-10 bg-white border-none shadow-sm rounded-[45px]">
                <SmallLabel>PANTRY</SmallLabel>
                <h3 className="text-2xl font-serif text-stone-900 mb-1">Your essentials</h3>
                <p className="text-[11px] text-stone-400 mb-8 font-medium">Keep staples you usually have at home.</p>
                
                <div className="flex gap-2 mb-10">
                  <input 
                    value={pantryInput} 
                    onChange={(e) => setPantryInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && onAddPantry()}
                    placeholder="e.g., oats, honey..." 
                    className="flex-1 bg-stone-50/50 p-5 rounded-[22px] text-[11px] outline-none border border-stone-100/50" 
                  />
                  <button onClick={onAddPantry} className="px-8 bg-[#C67347] text-white rounded-[22px] font-black text-[10px] uppercase shadow-lg">ADD</button>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {nutrition.pantry.length === 0 ? (
                    <p className="text-[11px] text-stone-300 text-center py-4 italic">Pantry is empty.</p>
                  ) : (
                    nutrition.pantry.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-5 bg-stone-50/30 rounded-3xl border border-stone-100">
                        <span className="text-[11px] font-bold text-stone-700 lowercase">{item.name}</span>
                        <button onClick={() => removePantryItem(item.id)} className="text-[9px] font-black text-stone-300 hover:text-red-400 uppercase transition-colors">REMOVE</button>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {activeBtn === 'ALL' && (
                <Card className="p-10 bg-white border-none shadow-sm rounded-[45px]">
                  <SmallLabel>GROCERY LIST</SmallLabel>
                  <h3 className="text-2xl font-serif text-stone-900 mb-1">Shop mindfully</h3>
                  <p className="text-[11px] text-stone-400 mb-8 font-medium">Ingredients for the week.</p>
                  
                  <div className="flex gap-2 mb-10">
                    <input 
                      value={groceryInput} 
                      onChange={(e) => setGroceryInput(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && onAddGrocery()}
                      placeholder="e.g., bananas..." 
                      className="flex-1 bg-stone-50/50 p-5 rounded-[22px] text-[11px] outline-none border border-stone-100/50" 
                    />
                    <button onClick={onAddGrocery} className="px-8 bg-[#C67347] text-white rounded-[22px] font-black text-[10px] uppercase shadow-lg">ADD</button>
                  </div>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {nutrition.grocery.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-5 bg-stone-50/30 rounded-3xl border border-stone-100 group">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={item.checked} onChange={() => toggleGroceryItem(item.id)} className="w-4 h-4 accent-[#C67347] cursor-pointer" />
                          <span className={`text-[11px] font-bold lowercase ${item.checked ? 'line-through text-stone-300' : 'text-stone-700'}`}>{item.name}</span>
                        </div>
                        <button onClick={() => removeGroceryItem(item.id)} className="text-[9px] font-black text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all uppercase">REMOVE</button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeBtn === 'GROCERY LIST' && (
            <Card className="p-10 bg-white border-none shadow-sm rounded-[45px]">
              <SmallLabel>SHOPPING LIST</SmallLabel>
              <h3 className="text-2xl font-serif text-stone-900 mb-8">Weekly Grocery</h3>
              <div className="flex gap-2 mb-10">
                <input value={groceryInput} onChange={(e) => setGroceryInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onAddGrocery()} placeholder="Add item..." className="flex-1 bg-stone-50/50 p-5 rounded-[22px] text-[11px] outline-none border border-stone-100/50" />
                <button onClick={onAddGrocery} className="px-10 bg-[#C67347] text-white rounded-[22px] font-black text-[10px] uppercase shadow-lg">ADD ITEM</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nutrition.grocery.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-6 bg-stone-50/30 rounded-3xl border border-stone-100 group">
                    <div className="flex items-center gap-4">
                      <input type="checkbox" checked={item.checked} onChange={() => toggleGroceryItem(item.id)} className="w-5 h-5 accent-[#C67347] cursor-pointer" />
                      <span className={`text-[13px] font-medium lowercase ${item.checked ? 'line-through text-stone-300' : 'text-stone-700'}`}>{item.name}</span>
                    </div>
                    <button onClick={() => removeGroceryItem(item.id)} className="text-[10px] font-black text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 uppercase transition-all">REMOVE</button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {(activeBtn === 'ALL' || activeBtn === 'THIS WEEK') && (
            <Card className="p-10 bg-stone-50/30 border-none shadow-none rounded-[45px]">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <SmallLabel>THIS WEEK</SmallLabel>
                  <h3 className="text-3xl font-serif text-stone-900 mt-1">Weekly meal rhythm</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {upcoming7Days.map((date) => {
                    const plan = nutrition.week?.[date] || {};
                    const isSelected = selectedDate === date;
                    const hasData = plan.breakfast || plan.lunch || plan.dinner;
                    
                    return (
                      <div 
                        key={date} 
                        onClick={() => setSelectedDate(date)} 
                        className={`p-6 rounded-[35px] border transition-all cursor-pointer bg-white ${isSelected ? 'border-[#C67347] shadow-xl ring-1 ring-[#C67347]/20' : 'border-stone-50 hover:border-stone-200'}`}
                      >
                        <p className={`text-[11px] font-black mb-3 ${isSelected ? 'text-[#C67347]' : 'text-stone-900'}`}>{date}</p>
                        <div className="space-y-1.5 text-[10px] font-bold">
                          <p className={plan.breakfast ? "text-stone-700" : "text-stone-200"}>B: {plan.breakfast || '—'}</p>
                          <p className={plan.lunch ? "text-stone-700" : "text-stone-200"}>L: {plan.lunch || '—'}</p>
                          <p className={plan.dinner ? "text-stone-700" : "text-stone-200"}>D: {plan.dinner || '—'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="xl:col-span-5 bg-white p-8 rounded-[45px] border border-stone-100 shadow-sm h-fit">
                  <p className="text-[10px] font-black text-stone-400 tracking-widest mb-1 uppercase">Meal Editor</p>
                  <p className="text-sm font-bold text-stone-900 mb-8 uppercase">Plan for {selectedDate}</p>
                  
                  <div className="space-y-6">
                    {['Breakfast', 'Lunch', 'Dinner'].map(t => (
                      <div key={t}>
                        <label className="text-[9px] font-black text-stone-900/40 mb-2 block uppercase tracking-widest">{t}</label>
                        <input 
                          value={meals[t.toLowerCase()] || ""} 
                          onChange={e => setMeals({...meals, [t.toLowerCase()]: e.target.value})} 
                          className="w-full bg-stone-50/50 border border-stone-100/50 p-4 rounded-2xl text-[11px] outline-none focus:border-[#C67347]/30 transition-all" 
                          placeholder={`Add ${t.toLowerCase()}...`} 
                        />
                      </div>
                    ))}
                    <button 
                      onClick={handleSaveMeals} 
                      className="w-full py-5 bg-[#C67347] text-white rounded-full font-black text-[10px] uppercase shadow-xl shadow-[#C67347]/30 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                    >
                      SAVE MEAL PLAN
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {(activeBtn === 'ALL' || activeBtn === 'RECIPE BOOK') && (
            <Card className="p-10 bg-white border-none shadow-sm rounded-[45px]">
              <SmallLabel>RECIPE BOOK</SmallLabel>
              <h3 className="text-2xl font-serif text-stone-900 mb-8 tracking-tight">Simple ideas</h3>
              
              <div className="flex flex-wrap gap-3 mb-10">
                <input 
                  value={recipeInput} 
                  onChange={(e) => setRecipeInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && onAddRecipe()}
                  placeholder="e.g., Avocado Toast with Hemp Seeds" 
                  className="flex-1 min-w-[240px] bg-stone-50/50 border border-stone-100 p-5 rounded-full text-xs outline-none shadow-sm" 
                />
                <button onClick={onAddRecipe} className="px-10 py-4 bg-[#C67347] text-white rounded-full font-black text-[10px] uppercase shadow-lg hover:bg-stone-900 transition-colors">ADD RECIPE</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {nutrition.recipes.map(recipe => (
                  <div key={recipe.id} className="bg-white p-6 rounded-[35px] border border-stone-100 shadow-sm relative group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <p className="text-[12px] font-black text-stone-800 lowercase break-words leading-tight">{recipe.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleRecipeFavorite(recipe.id)}
                          className={`text-lg transition-transform active:scale-150 ${recipe.isFavorite ? 'text-red-500' : 'text-stone-200 hover:text-stone-300'}`}
                        >
                          {recipe.isFavorite ? '❤️' : '🤍'}
                        </button>
                        <button onClick={() => removeRecipeItem(recipe.id)} className="text-stone-200 hover:text-red-400 text-xl leading-none transition-colors">×</button>
                      </div>
                    </div>
                    <button 
                      onClick={() => addGroceryItem(recipe.name)} 
                      className="w-full py-3 bg-stone-900 text-white rounded-[18px] font-black text-[9px] uppercase tracking-widest hover:bg-[#C67347] transition-colors"
                    >
                      ADD TO GROCERY
                    </button>
                  </div>
                ))}
                {nutrition.recipes.length === 0 && (
                  <p className="col-span-full text-center py-12 text-stone-300 text-[11px] italic font-bold">Your recipe book is empty.</p>
                )}
              </div>
            </Card>
          )}

          {(activeBtn === 'ALL' || activeBtn === 'HEALTHY HABITS') && (
            <Card className="p-10 bg-white border-none shadow-sm rounded-[45px]">
              <SmallLabel>HEALTHY HABITS</SmallLabel>
              <h3 className="text-2xl font-serif text-stone-900 mb-8 tracking-tight">Gentle reminders</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Hydration", text: "Sip water across the day. Add electrolytes after sweaty sessions." },
                  { title: "Timing", text: "Light meals 1–2 hours before practice feel best for many people." },
                  { title: "Recovery", text: "After practice, include protein + carbs to support muscle recovery." }
                ].map(h => (
                  <div key={h.title} className="bg-stone-50/50 p-8 rounded-[35px] border border-stone-100">
                    <p className="text-[12px] font-black text-stone-900 mb-3 uppercase tracking-wider">{h.title}</p>
                    <p className="text-[11px] leading-relaxed text-stone-500 font-medium">{h.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

        </div>
      </div>
      
      <footer className="py-12 border-t border-stone-200/60 flex flex-col items-center mt-10 space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-300">© 2026 ALAYA • BREATHE • PLAN • PEACE</p>
      </footer>
    </div>
  );
};

export default NutritionTab;