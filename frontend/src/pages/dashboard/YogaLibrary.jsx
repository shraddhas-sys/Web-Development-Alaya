import React, { useState, useEffect } from 'react';
import api from "../../services/api"; 
import { Plus, Trash2, Flower } from 'lucide-react';

const YogaLibrary = () => {
  const [yogaName, setYogaName] = useState("");
  const [yogas, setYogas] = useState([]);
// fetch yogas
  const fetchYogas = async () => {
    try {
      const res = await api.API.get('/admin/yoga-types');
      setYogas(res.data.data || []);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => { fetchYogas(); }, []);

  const handleAddYoga = async (e) => {
    e.preventDefault();
    if (!yogaName) return;
    try {
      await api.API.post('/admin/add-yoga', { name: yogaName });
      setYogaName("");
      fetchYogas();
    } catch (err) { alert("Already exists or Server Error"); }
  };

  const deleteYoga = async (id) => {
    if (window.confirm("Remove this yoga?")) {
      try {
        await api.API.delete(`/admin/yoga-type/${id}`);
        fetchYogas();
      } catch (err) { alert("Delete failed"); }
    }
  };

  return (
    <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm animate-fade-in">
      <h2 className="text-2xl font-serif text-stone-800 mb-6 italic">Yoga Sanctuary Library</h2>
      
      <form onSubmit={handleAddYoga} className="mb-8 flex gap-3">
        <input 
          value={yogaName}
          onChange={(e) => setYogaName(e.target.value)}
          placeholder="New Yoga (e.g. Hatha Yoga)"
          className="flex-1 p-4 rounded-2xl bg-stone-100 border-none focus:ring-2 focus:ring-[#C67347]"
        />
        <button type="submit" className="bg-[#C67347] text-white px-8 rounded-2xl hover:bg-[#a65d36] transition-all flex items-center gap-2 font-bold">
          <Plus size={20}/> ADD
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {yogas.length > 0 ? yogas.map(yoga => (
          <div key={yoga.id} className="p-5 rounded-2xl border border-stone-100 bg-stone-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Flower className="text-[#8A9A5B]" size={20} />
              <span className="font-bold text-stone-700">{yoga.name}</span>
            </div>
            <button onClick={() => deleteYoga(yoga.id)} className="text-stone-300 hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        )) : <p className="text-stone-400 italic">No yoga types added yet.</p>}
      </div>
    </div>
  );
};

export default YogaLibrary;