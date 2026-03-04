import React, { useState, useEffect } from 'react';
import api from "../../services/api";

const ProgressOverviewTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.API.get('/admin/global-progress');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Progress Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) return <div className="p-10 text-stone-500">Loading Analytics...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-stone-800">Global Progress Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simple Progress Card */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-sm uppercase tracking-widest text-stone-400 mb-2">Completion Rate</p>
          <p className="text-4xl font-serif text-[#C67347]">{stats?.completed || 0}%</p>
          <div className="w-full bg-stone-100 h-2 mt-4 rounded-full overflow-hidden">
            <div
              className="bg-[#C67347] h-full transition-all duration-1000"
              style={{ width: `${stats?.completed || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-sm uppercase tracking-widest text-[#C67347] font-bold mb-2">Live Activity</p>
          <p className="text-4xl font-serif text-stone-800">{stats?.active || 0}</p>
          <p className="text-stone-400 text-sm mt-2 italic">Seekers present in the last 15 mins</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressOverviewTab;