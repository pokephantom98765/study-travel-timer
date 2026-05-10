import React from 'react';
import { Profile, JourneyRecord } from '../../types';
import { ArrowLeft, Flame, Download } from 'lucide-react';
import { PilotLicense } from '../PilotLicense';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { toPng } from 'html-to-image';

interface AnalyticsProps {
  onBack: () => void;
  profile: Profile;
  history: JourneyRecord[];
}

interface SubjectSlice {
  name: string;
  value: number;
}

export const Analytics: React.FC<AnalyticsProps> = ({ onBack, profile, history }) => {
  const totalHrs = (profile.totalMs / 3600000).toFixed(1);

  const downloadLicense = async () => {
    const node = document.getElementById('pilot-license');
    if (!node) return;

    try {
      const dataUrl = await toPng(node);
      const link = document.createElement('a');
      link.download = 'study-travel-license.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export pilot license image:', error);
    }
  };

  const chartData = history.slice(0, 7).reverse().map((h) => ({
    date: h.date,
    mins: Math.round(h.duration / 60000),
    subject: h.subject
  }));

  const subjectMap = history.reduce<Map<string, number>>((acc, record) => {
    const current = acc.get(record.subject) || 0;
    acc.set(record.subject, current + 1);
    return acc;
  }, new Map());

  const subjectData: SubjectSlice[] = Array.from(subjectMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="relative z-10 min-h-[100dvh] bg-[#0a0e1a] p-4 text-white sm:p-6 [padding-bottom:calc(1rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-3xl py-6 sm:py-10">
        <div className="mb-8 flex items-center justify-between sm:mb-10">
          <h2 className="text-2xl font-bold italic tracking-tighter sm:text-3xl">Analytics</h2>
          <button onClick={onBack} className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10">
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="mb-10 flex flex-col items-center gap-6 md:mb-12 md:flex-row md:items-start md:gap-8">
          <div className="w-full flex-1">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Digital License</span>
              <button onClick={downloadLicense} className="flex items-center gap-1 text-[10px] font-bold uppercase text-blue-400 transition-transform hover:text-blue-300 active:scale-95">
                <Download size={14} /> Export
              </button>
            </div>
            <PilotLicense profile={profile} history={history} />
          </div>

          <div className="grid w-full flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#1a2235] p-6 text-center shadow-xl">
              <span className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-gray-500 italic">Flight Time</span>
              <p className="mb-1 flex items-center justify-center gap-2 text-2xl font-black sm:text-3xl">{totalHrs}h</p>
              <p className="text-[10px] font-bold text-gray-500">Logged</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1a2235] p-6 text-center shadow-xl">
              <span className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-gray-500 italic">Streak</span>
              <p className="mb-1 flex items-center justify-center gap-2 text-2xl font-black text-orange-500 sm:text-3xl">{profile.streak} <Flame size={20} fill="currentColor" /></p>
              <p className="text-[10px] font-bold text-gray-500">Active Days</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1a2235] p-6 text-center shadow-xl">
              <span className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-gray-500 italic">Sessions</span>
              <p className="mb-1 text-2xl font-black sm:text-3xl">{profile.sessions}</p>
              <p className="text-[10px] font-bold text-gray-500">Journeys</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#1a2235] p-6 text-center shadow-xl">
              <span className="mb-4 block text-[10px] font-bold uppercase tracking-widest text-gray-500 italic">XP</span>
              <p className="mb-1 text-2xl font-black text-emerald-400 sm:text-3xl">{profile.xp}</p>
              <p className="text-[10px] font-bold uppercase text-gray-500">Total Points</p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <div className="rounded-2xl border border-white/10 bg-[#1a2235] p-5 shadow-xl sm:p-6">
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">Recent Activity</h3>
            <div className="h-44 w-full sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #ffffff10', borderRadius: '8px' }}
                    itemStyle={{ color: '#60a5fa', fontSize: '12px' }}
                  />
                  <Bar dataKey="mins" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#1a2235] p-5 shadow-xl sm:p-6">
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">Subject Distribution</h3>
            <div className="h-44 w-full sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #ffffff10', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff', fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-white/10 bg-[#1a2235] p-5 shadow-xl sm:p-8">
          <h3 className="mb-6 border-b border-white/5 pb-4 text-xs font-bold uppercase tracking-widest text-gray-400">Full Log Export</h3>
          <div className="space-y-4">
            {history.length > 0 ? history.slice(0, 5).map((h) => (
              <div key={`${h.id}-${h.timestamp}`} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:border-white/10">
                <div>
                  <p className="text-sm font-bold tracking-tight">{h.from} -&gt; {h.to}</p>
                  <p className="text-[10px] font-medium uppercase text-gray-500">{h.date} . {h.mode}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black tabular-nums text-blue-400">{Math.floor(h.duration / 60000)}<span className="ml-1 text-[10px]">MIN</span></p>
                  <p className="text-[9px] uppercase text-gray-500">{h.subject}</p>
                </div>
              </div>
            )) : <p className="text-center text-sm italic text-gray-500">No journeys recorded yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
