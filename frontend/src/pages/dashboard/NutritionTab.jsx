import React, { useState, useEffect } from 'react';
import { Card, SmallLabel } from './ui';
import api from "../../services/api";
import { Sparkles, Leaf, Sun, Moon } from 'lucide-react';

const NutritionTab = ({ 
  nutrition = { week: {}, recipes: [] }, 
  saveMealPlanForDate, 
  upcoming7Days = [],
  userId,
  addFavorite,
  setActiveTab
}) => {
  const [activeBtn, setActiveBtn] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState(upcoming7Days[0] || "");
  
  const [meals, setMeals] = useState({ breakfast: "", lunch: "", dinner: "", notes: "" });
  const [masterMeals, setMasterMeals] = useState([]);
  const [currentTimeSlot, setCurrentTimeSlot] = useState("Morning");

  // Pulling data from Admin library
  useEffect(() => {
    const fetchAdminMeals = async () => {
      try {
        const res = await api.API.get('/nutrition/available-meals');
        if (res.data && res.data.success) {
          setMasterMeals(res.data.data || res.data.recipes || []); 
        }
      } catch (err) {
        console.error("Error fetching admin meals:", err);
      }
    };
    fetchAdminMeals();
  }, []);

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

  const filteredMeals = masterMeals.filter(m => 
    m.timeSlot?.toLowerCase().trim() === currentTimeSlot.toLowerCase().trim()
  );
// save meals
  const handleSaveMeals = () => {
    if (!selectedDate) return;
    let mealToValidate = "";
    if (currentTimeSlot === "Morning") mealToValidate = meals.breakfast;
    else if (currentTimeSlot === "Afternoon") mealToValidate = meals.lunch;
    else mealToValidate = meals.dinner;

    if (!mealToValidate || mealToValidate.trim() === "" || mealToValidate === "-- Choose Meal --") {
      alert("Please choose a meal from the library before saving! 🥗");
      return; 
    }

    saveMealPlanForDate(selectedDate, meals);
    alert("Meal Plan Saved! ✨");
  };

  const handleChangeMeal = (e) => {
    const val = e.target.value;
    if (currentTimeSlot === "Morning") setMeals(p => ({ ...p, breakfast: val }));
    else if (currentTimeSlot === "Afternoon") setMeals(p => ({ ...p, lunch: val }));
    else setMeals(p => ({ ...p, dinner: val }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F8F6] font-sans pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full px-4">
        
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-8 h-fit mt-8">
          <div className="p-2 mb-4">
            <SmallLabel>NUTRITION</SmallLabel>
            <h2 className="text-3xl font-serif text-stone-900 mt-2 tracking-tight">Diet Planner</h2>
          </div>
          <div className="space-y-2">
            {['ALL', 'THIS WEEK', 'RECIPE BOOK', 'HEALTHY WISDOM'].map((btn) => (
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

        <div className="lg:col-span-9 space-y-12 mt-8">
          
          {/* This week section */}
          {(activeBtn === 'ALL' || activeBtn === 'THIS WEEK') && (
            <Card className="p-10 bg-white border-none shadow-sm rounded-[45px]">
              <div className="mb-10">
                <SmallLabel>WEEKLY RHYTHM</SmallLabel>
                <h3 className="text-3xl font-serif text-stone-900 mt-1">Nourish your practice</h3>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {upcoming7Days.map((date) => (
                    <div key={date} onClick={() => setSelectedDate(date)} className={`p-6 rounded-[35px] border cursor-pointer transition-all ${selectedDate === date ? 'border-[#C67347] bg-orange-50/30' : 'border-stone-50 bg-stone-50/30'}`}>
                      <p className={`text-[11px] font-black mb-3 ${selectedDate === date ? 'text-[#C67347]' : 'text-stone-900'}`}>{date}</p>
                      <div className="space-y-1.5 text-[10px] font-bold text-stone-600">
                        <p>B: {nutrition.week?.[date]?.breakfast || '—'}</p>
                        <p>L: {nutrition.week?.[date]?.lunch || '—'}</p>
                        <p>D: {nutrition.week?.[date]?.dinner || '—'}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="xl:col-span-5 bg-stone-50/50 p-8 rounded-[40px] h-fit border border-stone-100">
                  <p className="text-[10px] font-black text-stone-400 uppercase mb-6">Plan for {selectedDate}</p>
                  <div className="space-y-6">
                    <select value={currentTimeSlot} onChange={(e) => setCurrentTimeSlot(e.target.value)} className="w-full p-5 bg-white rounded-[22px] border-none text-[11px] font-bold outline-none shadow-sm cursor-pointer">
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                    </select>
                    <select 
                      onChange={handleChangeMeal} 
                      className="w-full p-5 bg-white rounded-[22px] border-none text-[11px] font-bold outline-none shadow-sm cursor-pointer" 
                      value={currentTimeSlot === "Morning" ? meals.breakfast : currentTimeSlot === "Afternoon" ? meals.lunch : meals.dinner}
                    >
                      <option value="">-- Choose Meal --</option>
                      {filteredMeals.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                    </select>
                    <button 
                      onClick={handleSaveMeals} 
                      className="w-full py-5 bg-[#C67347] text-white rounded-full font-black text-[10px] uppercase shadow-xl hover:scale-[1.02] transition-all"
                    >
                      SAVE PLAN
                    </button>

                    <button
                      onClick={() => {
                        const selectedName = (currentTimeSlot === "Morning" ? meals.breakfast : currentTimeSlot === "Afternoon" ? meals.lunch : meals.dinner);
                        const m = masterMeals.find(x => x.name === selectedName && String(x.timeSlot || '').toLowerCase() === String(currentTimeSlot).toLowerCase());
                        if (!m) return alert("Choose a meal to favourite first.");
                        if (typeof addFavorite === 'function') addFavorite('meal', m.id);
                      }}
                      className="w-full py-5 bg-white text-[#C67347] border border-[#C67347]/20 rounded-full font-black text-[10px] uppercase shadow-sm hover:shadow-md hover:bg-orange-50 transition-all"
                    >
                      ADD TO FAVOURITES
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Recipe book section */}
          {(activeBtn === 'ALL' || activeBtn === 'RECIPE BOOK') && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="px-2">
                <SmallLabel>COLLECTIVE WISDOM</SmallLabel>
                <h3 className="text-3xl font-serif text-stone-900 mt-1">Sacred Recipes</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {masterMeals.map((recipe) => (
                  <Card key={recipe.id} className="p-8 bg-white border-none shadow-sm rounded-[40px] group hover:shadow-xl transition-all duration-500">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-stone-50 rounded-[18px] flex items-center justify-center text-xl group-hover:bg-[#C67347] group-hover:text-white transition-colors"></div>
                      <div className="flex items-center gap-3">
                      <button
                        onClick={() => typeof addFavorite === 'function' && addFavorite('meal', recipe.id)}
                        className="text-[#C67347] hover:scale-110 transition-transform"
                        title="Add to favourites"
                      >
                        ❤️
                      </button>
                      <span className="text-[9px] font-black text-[#C67347] bg-orange-50 px-4 py-1.5 rounded-full uppercase tracking-widest">{recipe.timeSlot}</span>
                    </div>
                    </div>
                    <h4 className="text-2xl font-serif font-bold text-stone-900 mb-2">{recipe.name}</h4>
                    <p className="text-stone-500 text-xs leading-relaxed mb-8 italic">
                      {recipe.ingredients || "Nourishing elements for your journey."}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                      <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">{recipe.kcal || 0} KCAL</span>
                      <span className="text-[9px] font-black text-[#C67347] uppercase tracking-widest">Sanctuary Certified</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Healthy wisdom tips */}
          {(activeBtn === 'ALL' || activeBtn === 'HEALTHY WISDOM') && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="px-2">
                <SmallLabel>MINDFUL LIVING</SmallLabel>
                <h3 className="text-3xl font-serif text-stone-900 mt-1">Nutrition Wisdom</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-8 bg-[#F3F0EC] border-none rounded-[40px]">
                  <Sun className="text-[#C67347] mb-4" size={24} />
                  <h4 className="text-lg font-serif font-bold mb-2">Morning Ritual</h4>
                  <p className="text-stone-600 text-[11px] leading-relaxed font-medium">Start your day with warm lemon water to awaken your digestive fire (Agni).</p>
                </Card>
                <Card className="p-8 bg-[#F3F0EC] border-none rounded-[40px]">
                  <Leaf className="text-[#C67347] mb-4" size={24} />
                  <h4 className="text-lg font-serif font-bold mb-2">Eat Seasonally</h4>
                  <p className="text-stone-600 text-[11px] leading-relaxed font-medium">Nature provides exactly what your body needs at the right time. Trust local harvests.</p>
                </Card>
                <Card className="p-8 bg-[#F3F0EC] border-none rounded-[40px]">
                  <Moon className="text-[#C67347] mb-4" size={24} />
                  <h4 className="text-lg font-serif font-bold mb-2">Restful Digestion</h4>
                  <p className="text-stone-600 text-[11px] leading-relaxed font-medium">Aim to finish your last meal at least 3 hours before sleep for deeper restoration.</p>
                </Card>
              </div>
              <div className="bg-[#C67347] p-10 rounded-[45px] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-[#C67347]/30">
                <div className="bg-white/10 p-6 rounded-full"><Sparkles size={40} /></div>
                <div>
                  <h4 className="text-2xl font-serif mb-2 text-white">Mindful Eating Tip</h4>
                  <p className="text-orange-50/80 text-sm leading-relaxed max-w-xl">
                    Eat in silence, chew slowly, and appreciate the energy the food provides. When we eat with awareness, we nourish both body and soul.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionTab;