import React from 'react';

const RitualManagerTab = ({ sessions = [], deleteSession, loading }) => {
  if (loading) return <div className="p-10 text-center font-serif italic">Loading Rituals...</div>;

  return (
    <div className="bg-[#F9F7F2] rounded-[45px] p-10 border border-[#E5E1D8] animate-fade-in shadow-sm">
      <div className="mb-10">
        <p className="text-[10px] font-black text-[#A8A294] uppercase tracking-widest mb-1">Ritual Oversight</p>
        <h2 className="text-3xl font-serif text-[#3A352E]">Global Yoga Sessions</h2>
      </div>

      <div className="overflow-hidden rounded-[35px] border border-stone-100 bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 border-b border-stone-100">
              <th className="p-8">Seeker</th>
              <th className="p-8">Yoga Type</th>
              <th className="p-8">Duration</th>
              <th className="p-8">Date</th>
              <th className="p-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <tr key={session.id} className="hover:bg-stone-50/50 transition-all group">
                  <td className="p-8 font-bold text-stone-700">{session.seeker?.username || "Unknown"}</td>
                  <td className="p-8">
                    <span className="px-3 py-1 bg-[#E5E1D8] text-[#3A352E] rounded-full text-[10px] font-black uppercase">
                      {session.type}
                    </span>
                  </td>
                  <td className="p-8 text-sm text-stone-500 font-serif italic">{session.durationMinutes} mins</td>
                  <td className="p-8 text-sm text-stone-400">{new Date(session.date).toLocaleDateString()}</td>
                  <td className="p-8 text-right">
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Delete Log
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="p-20 text-center text-stone-300 italic">No ritual logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RitualManagerTab;