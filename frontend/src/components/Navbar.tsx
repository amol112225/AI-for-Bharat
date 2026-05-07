import { NavLink } from 'react-router-dom';
import { Briefcase, Mic } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">AP Hunter</span>
          </div>
          <div className="flex items-center space-x-8">
            <NavLink
              to="/lead"
              className={({ isActive }) => cn("flex items-center gap-2 text-sm font-medium transition-colors", isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-500 hover:text-gray-900")}
            >
              <Mic className="w-4 h-4" />
              Lead Interface
            </NavLink>
            <NavLink
              to="/rm"
              className={({ isActive }) => cn("flex items-center gap-2 text-sm font-medium transition-colors", isActive ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-500 hover:text-gray-900")}
            >
              <Briefcase className="w-4 h-4" />
              RM Dashboard
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
