import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Card, SmallLabel } from "./ui";

const AdminFavoritesTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.API.get("/admin/favorites");
      if (res.data.success) setItems(res.data.data || []);
      else setItems([]);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const grouped = items.reduce((acc, f) => {
    acc[f.itemType] = acc[f.itemType] || [];
    acc[f.itemType].push(f);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      <div className="px-2">
        <SmallLabel>ADMIN OVERSIGHT</SmallLabel>
        <h2 className="text-4xl font-serif text-stone-900 mt-2 tracking-tight">Favourites</h2>
        <p className="text-stone-400 text-sm mt-2 font-light italic">All items saved by seekers.</p>
      </div>

      {loading ? (
        <div className="p-10 bg-white/60 rounded-[40px] border border-stone-100">Loading...</div>
      ) : (
        <div className="space-y-8">
          {["plan","meal","recipe","yogaType"].map((k) => (
            <Card key={k} className="p-10 rounded-[45px] bg-white/70 border border-stone-100">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{k.toUpperCase()}</p>
                  <h3 className="text-2xl font-serif text-stone-900 mt-1">{(grouped[k] || []).length} saved</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(grouped[k] || []).length > 0 ? (grouped[k] || []).map((f) => (
                  <div key={f.id} className="p-6 bg-stone-50/50 rounded-[30px] border border-stone-100">
                    <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2">
                      {f.user ? `${f.user.username} • ${f.user.email}` : "Unknown user"}
                    </p>
                    <p className="text-sm font-bold text-stone-800">
                      {f.itemType === "plan" ? (f.item?.yogaType || "Plan") :
                       f.itemType === "meal" ? (f.item?.name || "Meal") :
                       f.itemType === "recipe" ? (f.item?.name || "Recipe") :
                       f.itemType === "yogaType" ? (f.item?.name || "Yoga") :
                       "Item"}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-2">
                      {f.itemType === "plan" ? `${f.item?.date || ""} • ${f.item?.duration || 0} mins` :
                       f.itemType === "meal" ? `${f.item?.timeSlot || ""} • ${f.item?.kcal || 0} kcal` :
                       ""}
                    </p>
                  </div>
                )) : (
                  <div className="col-span-full text-xs italic text-stone-400">No favourites saved in this category.</div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFavoritesTab;
