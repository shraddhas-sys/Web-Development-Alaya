import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import { Utensils, Plus, Trash2, Loader2, Apple, Clock, Info } from 'lucide-react';

const NutritionLibraryTab = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newRecipe, setNewRecipe] = useState({ 
    name: '', 
    ingredients: '', 
    kcal: '', 
    timeSlot: 'Morning' 
  });

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      console.log("Fetching recipes from /api/admin/recipes...");
      const res = await api.API.get('/admin/recipes'); 
      
      // Backend response handle 
      if (res.data && res.data.success) {
        setRecipes(res.data.data || []);
      } else if (Array.isArray(res.data)) {
        setRecipes(res.data);
      }
    } catch (err) {
      console.error("Fetch Error Detail:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecipes(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newRecipe.name || !newRecipe.timeSlot) return alert("Name and Time Slot are required");

    try {
      setIsSubmitting(true);
      const res = await api.API.post('/admin/recipes', newRecipe); 
      
      if (res.data.success) {
       // New recipe list
        const addedRecipe = res.data.data || res.data;
        setRecipes(prev => [addedRecipe, ...prev]);
        setNewRecipe({ name: '', ingredients: '', kcal: '', timeSlot: 'Morning' });
        alert("Meal added successfully! ✨");
      }
    } catch (err) {
      console.error("Add Error:", err);
      alert(err.response?.data?.message || "Error adding recipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this recipe from the library?")) return;
    try {
      // Backend route 
      const res = await api.API.delete(`/admin/recipes/${id}`); 
      if (res.status === 200 || res.data.success) {
        setRecipes(recipes.filter(r => r.id !== id));
      }
    } catch (err) { 
      console.error("Delete Error:", err.response || err);
      alert("Delete failed. Check console for details."); 
    }
  };

  return (
    <div className="p-8 space-y-10 animate-fade-in bg-[#F9F8F6] min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-stone-200 pb-8">
        <div className="bg-[#C67347] p-4 rounded-[22px] text-white shadow-xl shadow-orange-900/10">
          <Apple size={32} />
        </div>
        <div>
          <h2 className="text-4xl font-serif font-bold text-stone-900 tracking-tight">Nutrition Library</h2>
          <p className="text-stone-500 text-sm font-medium tracking-wide">Curate dietary wisdom for the Alaya community.</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
            <Info size={14} className="text-[#C67347]" />
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Add New Dietary Wisdom</p>
        </div>
        <form onSubmit={handleAdd} className="bg-white p-10 rounded-[45px] shadow-sm border border-stone-100 grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-stone-400 ml-1">Dish Name</label>
              <input 
                  value={newRecipe.name}
                  onChange={(e) => setNewRecipe({...newRecipe, name: e.target.value})}
                  className="w-full p-5 bg-stone-50/50 rounded-[22px] border border-stone-100/50 focus:bg-white focus:ring-2 focus:ring-[#C67347]/20 transition-all outline-none text-sm font-bold text-stone-700" 
                  placeholder="Zen Berry Bowl" required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-stone-400 ml-1">Ingredients</label>
              <input 
                  value={newRecipe.ingredients}
                  onChange={(e) => setNewRecipe({...newRecipe, ingredients: e.target.value})}
                  className="w-full p-5 bg-stone-50/50 rounded-[22px] border border-stone-100/50 focus:bg-white focus:ring-2 focus:ring-[#C67347]/20 transition-all outline-none text-sm font-bold text-stone-700" 
                  placeholder="Oats, Chia..." 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-stone-400 ml-1">Kcal</label>
              <input 
                  type="number"
                  value={newRecipe.kcal}
                  onChange={(e) => setNewRecipe({...newRecipe, kcal: e.target.value})}
                  className="w-full p-5 bg-stone-50/50 rounded-[22px] border border-stone-100/50 focus:bg-white focus:ring-2 focus:ring-[#C67347]/20 transition-all outline-none text-sm font-bold text-stone-700" 
                  placeholder="320" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-black tracking-widest text-stone-400 ml-1">Time Slot</label>
              <select 
                value={newRecipe.timeSlot}
                onChange={(e) => setNewRecipe({...newRecipe, timeSlot: e.target.value})}
                className="w-full p-5 bg-stone-50/50 rounded-[22px] border border-stone-100/50 focus:bg-white focus:ring-2 focus:ring-[#C67347]/20 transition-all appearance-none cursor-pointer outline-none text-sm font-bold text-stone-700"
              >
                <option value="Morning"> Morning</option>
                <option value="Afternoon"> Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
            <button 
              type="submit" disabled={isSubmitting}
              className="bg-[#C67347] text-white h-[64px] rounded-[22px] font-black text-[10px] tracking-[0.15em] flex items-center justify-center gap-3 hover:bg-[#a35d38] transition-all shadow-xl shadow-orange-900/10 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
              ADD TO LIBRARY
            </button>
        </form>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-32 text-center flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-[#C67347]" size={32} /> 
            <span className="text-[10px] font-black tracking-widest uppercase text-stone-400">Fetching Wisdom...</span>
          </div>
        ) : recipes.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-white rounded-[45px] border-2 border-dashed border-stone-100 text-stone-300 flex flex-col items-center gap-4">
            <Utensils size={40} />
            <p>Pantry is empty. Start curating.</p>
          </div>
        ) : (
          recipes.map((r) => (
            <div key={r.id} className="bg-white p-8 rounded-[45px] border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative">
              <div className="flex justify-between items-start mb-8">
                <div className="bg-stone-50 p-5 rounded-[22px] text-[#C67347] group-hover:bg-[#C67347] group-hover:text-white transition-colors">
                  <Utensils size={24} />
                </div>
                <button onClick={() => handleDelete(r.id)} className="p-3 text-stone-200 hover:text-red-500 transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={12} className="text-[#C67347]" />
                <span className="text-[10px] font-black text-[#C67347] uppercase tracking-[0.2em]">{r.timeSlot}</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3">{r.name}</h3>
              <p className="text-stone-500 text-xs italic mb-8 h-10 line-clamp-2">
                {r.ingredients ? `Ingredients: ${r.ingredients}` : "A simple, pure dish."}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-stone-300 uppercase">Energy</span>
                    <span className="text-xs font-bold text-stone-900">{r.kcal || 0} KCAL</span>
                </div>
                <span className="text-[9px] font-black text-[#C67347] bg-orange-50 px-3 py-1 rounded-full">Certified</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NutritionLibraryTab;