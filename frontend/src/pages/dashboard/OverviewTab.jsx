import React from 'react';
import { Users, Flower2, DollarSign, TrendingUp } from 'lucide-react';

const OverviewTab = ({ users = [], globalStats = {}, loading, setActiveTab }) => {

  // Stats Card Component
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-stone-200 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-stone-500 text-xs font-bold uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-serif text-stone-800 mt-1">
          {loading ? "..." : value}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/*Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => setActiveTab('directory')}
          className="cursor-pointer"
        >
          <StatCard
            title="Total Seekers"
            value={globalStats?.totalSeekers ?? users.length ?? 0}
            icon={Users}
            color="bg-[#C67347]"
          />
        </div>
        <StatCard
          title="Total Rituals"
          value={globalStats?.totalRituals ?? 0}
          icon={Flower2}
          color="bg-[#8A9A5B]"
        />
      </div>

      {/*Recent Growth Section */}
      <div className="grid grid-cols-1 gap-8">
        {/* Recent Seekers List */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-serif text-stone-800 italic">Newly Joined Seekers</h4>
            <span className="text-[10px] bg-stone-100 px-3 py-1 rounded-full font-bold uppercase tracking-tighter text-stone-500">Live Updates</span>
          </div>

          <div className="space-y-4">
            {users && users.length > 0 ? (
              users.slice(0, 5).map((user) => (
                <div key={user?.id || Math.random()} className="flex items-center justify-between p-3 hover:bg-stone-50 rounded-xl transition-colors border border-transparent hover:border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 font-bold uppercase text-xs overflow-hidden">
                      {user?.username ? user.username.substring(0, 2) : "S"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-800">{user?.username || "Unknown Seeker"}</p>
                      <p className="text-xs text-stone-500">{user?.email || "No contact info"}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-stone-50 rounded-full mb-3 flex items-center justify-center">
                  <Users className="w-5 h-5 text-stone-300" />
                </div>
                <p className="text-stone-400 text-sm italic">Waiting for new souls to join...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;