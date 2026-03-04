import React from 'react';

const SeekerDirectoryTab = ({ users = [], deleteUser, banUser, loading }) => {

  if (loading) {
    return (
      <div className="p-20 text-center font-serif italic text-stone-400 animate-pulse">
        Gathering seeker scrolls...
      </div>
    );
  }

  return (
    <div className="bg-[#F9F7F2] rounded-[45px] p-10 border border-[#E5E1D8] animate-fade-in shadow-sm">
      <div className="flex justify-between items-end mb-10 px-2">
        <div>
          <p className="text-[10px] font-black text-[#A8A294] uppercase tracking-[0.2em] mb-1">Guardian Oversight</p>
          <h2 className="text-4xl font-serif text-[#3A352E]">Seeker Directory</h2>
        </div>
        <div className="text-right">
          <p className="text-2xl font-serif text-[#C67347]">{users.length}</p>
          <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Active Souls</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[35px] border border-stone-100 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/50 text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 border-b border-stone-100">
              <th className="p-8">Seeker Information</th>
              <th className="p-8">Journey Status</th>
              <th className="p-8">Access Level</th>
              <th className="p-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-stone-50/30 transition-all group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#E5E1D8] flex items-center justify-center text-[#3A352E] font-serif text-lg">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-stone-800 text-sm tracking-tight">{user.username}</span>
                        <span className="text-[11px] text-stone-400 font-medium lowercase italic">{user.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-8">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[11px] font-bold ${user.isDisabled ? 'text-red-500' : 'text-stone-600'}`}>
                        {user.isDisabled ? 'BANNED' : 'ACTIVE'}
                      </span>
                      <span className="text-[10px] text-stone-300 uppercase tracking-tighter font-black">
                        Last seen: {user.lastSeen ? new Date(user.lastSeen).toLocaleTimeString() : (user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A')}
                      </span>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest inline-block ${user.role === 'admin'
                        ? 'bg-amber-50 text-amber-600 border border-amber-100'
                        : (user.isDisabled ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-stone-100 text-stone-500 border border-stone-200/50')
                      }`}>
                      {user.role === 'admin' ? 'Admin' : (user.isDisabled ? 'Disabled' : 'Seeker')}
                    </span>
                  </td>
                  <td className="p-8 text-right">
                    {user.role !== 'admin' ? (
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => banUser(user.id)}
                          disabled={user.isDisabled}
                          className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-amber-500 hover:bg-amber-50 disabled:opacity-30 transition-all border border-transparent hover:border-amber-100"
                        >
                          Ban
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-red-400 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <span className="text-[9px] font-black text-stone-200 uppercase tracking-widest">Protected</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-20 text-center text-stone-300 font-serif italic text-lg">
                  The sanctuary is currently quiet. No seekers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-8 px-4 flex justify-between items-center text-[10px] font-black text-stone-300 uppercase tracking-[0.3em]">
        <p>Alaya Guardian Portal • Confidential</p>
        <p>© 2026 Sanctuary Database</p>
      </div>
    </div>
  );
};

export default SeekerDirectoryTab;