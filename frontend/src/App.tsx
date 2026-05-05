import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MissionControl from './pages/MissionControl';
import LeadQueue from './pages/LeadQueue';
import VoiceConsole from './pages/VoiceConsole';
import RMHandoff from './pages/RMHandoff';
import WhatsAppAutomation from './pages/WhatsAppAutomation';
import Analytics from './pages/Analytics';

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
