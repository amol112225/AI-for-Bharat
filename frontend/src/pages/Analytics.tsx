import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const languageData = [
  { name: 'Hinglish', value: 4500 },
  { name: 'English', value: 3200 },
  { name: 'Hindi', value: 2800 },
  { name: 'Marathi', value: 1100 },
  { name: 'Telugu', value: 805 },
];
const COLORS = ['#00f0ff', '#0047ff', '#b026ff', '#facc15', '#22c55e'];

const productivityData = [
  { time: '9 AM', withoutAI: 12, withAI: 45 },
  { time: '11 AM', withoutAI: 25, withAI: 110 },
  { time: '1 PM', withoutAI: 35, withAI: 155 },
  { time: '3 PM', withoutAI: 45, withAI: 210 },
  { time: '5 PM', withoutAI: 55, withAI: 280 },
];

const cityData = [
  { city: 'Pune', count: 1200 },
  { city: 'Mumbai', count: 980 },
  { city: 'Delhi', count: 850 },
  { city: 'Bengaluru', count: 720 },
  { city: 'Hyderabad', count: 540 },
];

export default function Analytics() {
  return (
    <div className="h-full flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Business Intelligence</h1>
        <p className="text-slate-400 text-sm mt-1">Deep analytics on autonomous conversion performance.</p>
      </header>

      <div className="grid grid-cols-2 gap-6 flex-1 min-h-[500px]">
        
        {/* Language Distribution */}
        <div className="glass-panel p-6 flex flex-col relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-6">Language Distribution</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="rgba(255,255,255,0.05)"
                >
                  {languageData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {languageData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-slate-300">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Gain */}
        <div className="glass-panel p-6 flex flex-col relative">
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-6">RM Productivity Gain (Calls/Day)</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="withAI" name="With AP Hunter" stroke="#00f0ff" strokeWidth={3} dot={{ r: 4, fill: '#00f0ff', strokeWidth: 2, stroke: '#020617' }} activeDot={{ r: 6, fill: '#00f0ff', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="withoutAI" name="Manual RM" stroke="#64748b" strokeWidth={2} dot={{ r: 3, fill: '#64748b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* City Heatmap (Bar Chart alternative) */}
        <div className="glass-panel p-6 flex flex-col col-span-2 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-6">Top Converting Geographies</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="city" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#0047ff" radius={[4, 4, 0, 0]}>
                  {cityData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#00f0ff' : '#0047ff'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
