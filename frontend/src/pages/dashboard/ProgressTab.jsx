import React from 'react';
import { Card } from './ui';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressTab = ({ 
  sessions = [], 
  streak = 0, 
  monthlyCount = 0, 
  weeklyCount = 0, 
  weeklyGoal = 4, 
  weeklyProgressPct = 0,
  sessionsLast14DaysBars, 
  popularType = "—"
}) => {
  

  const chartData = sessionsLast14DaysBars?.days.map(d => ({
    name: d.date.split('-').slice(1).join('/'), 
    count: d.count
  })) || [];

  return (
    <div className="flex flex-col space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-8">
          <Card className="p-12 rounded-[40px] border-none bg-[#F9F7F2] shadow-sm min-h-[600px]">
            <header className="mb-10">
              <p className="text-[11px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Progress Tracking</p>
              <h2 className="text-3xl font-serif text-stone-800">Your practice history</h2>
            </header>

            {/* Chart Section */}
            <div className="mb-12">
               <span className="text-[13px] font-semibold text-stone-800 block mb-6">Activity (Last 14 Days)</span>
               <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#A8A29E'}} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}} />
                      <Bar dataKey="count" fill="#D6D3D1" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
            
            <div className="mb-14">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[13px] font-semibold text-stone-800">Weekly activity</span>
                <span className="text-[13px] font-bold text-stone-800">{weeklyCount}/{weeklyGoal}</span>
              </div>
              <div className="w-full bg-[#EEEBE3] h-[10px] rounded-full overflow-hidden">
                <div className="bg-stone-400 h-full transition-all duration-1000" style={{ width: `${weeklyProgressPct}%` }}></div>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[13px] font-semibold text-stone-800">Recent sessions</span>
              <div className="space-y-3">
                {sessions.slice(0, 5).map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-white/60 rounded-2xl border border-stone-100/30">
                    <div>
                      <p className="text-[14px] font-medium text-stone-800">{s.type || s.yogaType || 'Yoga'}</p>
                      <p className="text-[11px] text-stone-400">{String(s.date || '').split('T')[0]}</p>
                      {s.notes && <p className="text-[10px] text-stone-400 italic mt-1">“{s.notes}”</p>}
                    </div>
                    <div className="text-[13px] font-bold text-stone-600">{(s.durationMinutes ?? s.duration ?? 0)} min</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-4 space-y-4">
          <InsightCard label="Current streak" value={streak} unit="days" />
          <InsightCard label="This month" value={monthlyCount} unit="sessions" />
          <InsightCard label="Most popular type" value={popularType} unit="yoga" />
        </div>
      </div>
    </div>
  );
};

const InsightCard = ({ label, value, unit }) => (
  <Card className="p-8 bg-[#F9F7F2] border-none rounded-[32px] shadow-sm">
    <span className="text-[13px] font-semibold text-stone-800 block mb-1">{label}</span>
    <div className="text-4xl font-serif text-stone-800">{value}</div>
    <p className="text-[12px] text-stone-400 mt-1">{unit}</p>
  </Card>
);

export default ProgressTab;