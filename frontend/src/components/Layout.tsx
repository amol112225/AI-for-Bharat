import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 overflow-y-auto max-h-screen custom-scrollbar">
        <Outlet />
      </main>
    </div>
  );
}
