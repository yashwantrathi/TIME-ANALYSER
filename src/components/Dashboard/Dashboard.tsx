import { useState } from 'react';
import { Header } from './Header';
import { TimeEntryForm } from './TimeEntryForm';
import { WeeklyAnalytics } from './WeeklyAnalytics';
import { ExportData } from './ExportData';
import { BarChart3, PlusCircle, Download } from 'lucide-react';

type Tab = 'entry' | 'analytics' | 'export';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('entry');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-blue-900/20"></div>

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {activeTab === 'entry' && 'Log Your Time'}
                {activeTab === 'analytics' && 'Weekly Insights'}
                {activeTab === 'export' && 'Export Data'}
              </h2>
              <p className="text-gray-400">
                {activeTab === 'entry' && 'Track how you spend your day'}
                {activeTab === 'analytics' && 'Understand your time usage patterns'}
                {activeTab === 'export' && 'Download your tracking history'}
              </p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('entry')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'entry'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              New Entry
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === 'export'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        <div className="animate-fade-in">
          {activeTab === 'entry' && <TimeEntryForm />}
          {activeTab === 'analytics' && <WeeklyAnalytics />}
          {activeTab === 'export' && <ExportData />}
        </div>
      </main>
    </div>
  );
}
