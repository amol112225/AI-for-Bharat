import React, { useState } from 'react';
import LeadControl from './components/LeadControl';
import LiveCall from './components/LiveCall';
import PostCall from './components/PostCall';
import RmDashboard from './components/RmDashboard';
import LeadDetail from './components/LeadDetail';

function App() {
  const [currentView, setCurrentView] = useState('lead_control');
  const [currentLead, setCurrentLead] = useState(null);
  const [callData, setCallData] = useState(null);

  // Flow Navigation
  const goToLiveCall = (lead) => {
    setCurrentLead(lead);
    setCurrentView('live_call');
  };

  const goToPostCall = (data) => {
    setCallData(data);
    setCurrentView('post_call');
  };

  const goToRmDashboard = () => setCurrentView('rm_dashboard');
  const goToLeadControl = () => setCurrentView('lead_control');
  const goToLeadDetail = () => setCurrentView('lead_detail');

  // Breadcrumbs logic
  const getBreadcrumbs = () => {
    switch (currentView) {
      case 'lead_control': return '1. Lead Control Panel';
      case 'live_call': return '1. Lead Control > 2. Live AI Call';
      case 'post_call': return '2. Live AI Call > 3. Post-Call Analysis';
      case 'rm_dashboard': return 'Dashboard > RM Business View';
      case 'lead_detail': return 'RM Dashboard > Lead Detail';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Global Header */}
      <header className="flex items-center justify-between mb-8 max-w-7xl mx-auto pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3 cursor-pointer" onClick={goToLeadControl}>
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-bold text-white text-xl">AP</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AP Hunter</h1>
            <p className="text-xs text-slate-500 font-mono">{getBreadcrumbs()}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-medium flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
          </div>
        </div>
      </header>

      {/* Dynamic Main View */}
      <main className="max-w-7xl mx-auto">
        {currentView === 'lead_control' && <LeadControl onStartCall={goToLiveCall} onGoToDashboard={goToRmDashboard} />}
        {currentView === 'live_call' && <LiveCall lead={currentLead} onCallEnd={goToPostCall} />}
        {currentView === 'post_call' && <PostCall data={callData} onGoToDashboard={goToRmDashboard} />}
        {currentView === 'rm_dashboard' && <RmDashboard onBack={goToLeadControl} onViewDetail={goToLeadDetail} />}
        {currentView === 'lead_detail' && <LeadDetail onBack={goToRmDashboard} data={callData} />}
      </main>
      
    </div>
  );
}

export default App;
