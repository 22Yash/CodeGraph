import React from 'react';
import { GitBranch, Bell, Sun, Settings, Search } from 'lucide-react';

const GraphHeader = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md z-10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-blue-600 font-bold text-xl">
          <GitBranch className="mr-2" size={24} />
          <span>CodeGraph</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Sun size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Settings size={20} className="text-gray-600" />
        </button>
        <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
          JD
        </div>
      </div>
    </header>
  );
};

export default GraphHeader;
