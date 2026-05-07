import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MissionControl from './pages/MissionControl';
import LeadQueue from './pages/LeadQueue';
import VoiceConsole from './pages/VoiceConsole';
import RMHandoff from './pages/RMHandoff';
import WhatsAppAutomation from './pages/WhatsAppAutomation';
import Analytics from './pages/Analytics';
import LeadInterface from './pages/LeadInterface';
import RMDashboard from './pages/RMDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MissionControl />} />
          <Route path="queue" element={<LeadQueue />} />
          <Route path="console" element={<VoiceConsole />} />
          <Route path="handoff" element={<RMHandoff />} />
          <Route path="whatsapp" element={<WhatsAppAutomation />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="lead" element={<LeadInterface />} />
          <Route path="rm" element={<RMDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
