import { useState } from 'react';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function ExportData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    if (!user) return null;

    const { data } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false });

    return data;
  };

  const exportAsJSON = async () => {
    setLoading(true);
    try {
      const data = await fetchAllData();
      if (!data) return;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `time-entries-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  const exportAsCSV = async () => {
    setLoading(true);
    try {
      const data = await fetchAllData();
      if (!data || data.length === 0) return;

      const headers = ['Date', 'Study', 'Sleep', 'Social Media', 'Eating', 'College', 'Commute', 'Leisure', 'Other', 'Total'];
      const rows = data.map(entry => {
        const total = Number(entry.study) + Number(entry.sleep) + Number(entry.social_media) +
                     Number(entry.eating) + Number(entry.college) + Number(entry.commute) +
                     Number(entry.leisure) + Number(entry.other);

        return [
          entry.entry_date,
          entry.study,
          entry.sleep,
          entry.social_media,
          entry.eating,
          entry.college,
          entry.commute,
          entry.leisure,
          entry.other,
          total.toFixed(2),
        ].join(',');
      });

      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `time-entries-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Export Your Data</h3>
          <p className="text-gray-400 text-sm">Download your time tracking history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={exportAsJSON}
          disabled={loading}
          className="group relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6 hover:border-blue-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
              <FileJson className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-white mb-1">JSON Format</div>
              <div className="text-xs text-gray-400">Developer-friendly format</div>
            </div>
          </div>
        </button>

        <button
          onClick={exportAsCSV}
          disabled={loading}
          className="group relative overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
              <FileSpreadsheet className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-white mb-1">CSV Format</div>
              <div className="text-xs text-gray-400">Excel & spreadsheet ready</div>
            </div>
          </div>
        </button>
      </div>

      {loading && (
        <div className="mt-4 text-center text-gray-400 text-sm">
          Preparing your export...
        </div>
      )}
    </div>
  );
}
