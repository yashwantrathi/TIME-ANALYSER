import { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface TimeEntry {
  study: number;
  sleep: number;
  social_media: number;
  eating: number;
  college: number;
  commute: number;
  leisure: number;
  other: number;
}

const categories = [
  { key: 'study', label: 'Study', color: 'from-blue-500 to-blue-600', icon: '📚' },
  { key: 'sleep', label: 'Sleep', color: 'from-purple-500 to-purple-600', icon: '😴' },
  { key: 'social_media', label: 'Social Media', color: 'from-pink-500 to-pink-600', icon: '📱' },
  { key: 'eating', label: 'Eating', color: 'from-orange-500 to-orange-600', icon: '🍽️' },
  { key: 'college', label: 'College', color: 'from-green-500 to-green-600', icon: '🎓' },
  { key: 'commute', label: 'Commute', color: 'from-yellow-500 to-yellow-600', icon: '🚗' },
  { key: 'leisure', label: 'Leisure', color: 'from-cyan-500 to-cyan-600', icon: '🎮' },
  { key: 'other', label: 'Other', color: 'from-gray-500 to-gray-600', icon: '⚡' },
] as const;

export function TimeEntryForm() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeEntry, setTimeEntry] = useState<TimeEntry>({
    study: 0,
    sleep: 0,
    social_media: 0,
    eating: 0,
    college: 0,
    commute: 0,
    leisure: 0,
    other: 0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const totalHours = Object.values(timeEntry).reduce((sum, val) => sum + val, 0);
  const isValid = totalHours <= 24;

  useEffect(() => {
    loadEntry();
  }, [selectedDate]);

  const loadEntry = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('entry_date', selectedDate)
      .maybeSingle();

    if (data) {
      setTimeEntry({
        study: Number(data.study),
        sleep: Number(data.sleep),
        social_media: Number(data.social_media),
        eating: Number(data.eating),
        college: Number(data.college),
        commute: Number(data.commute),
        leisure: Number(data.leisure),
        other: Number(data.other),
      });
    } else {
      setTimeEntry({
        study: 0,
        sleep: 0,
        social_media: 0,
        eating: 0,
        college: 0,
        commute: 0,
        leisure: 0,
        other: 0,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isValid) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: upsertError } = await supabase
        .from('time_entries')
        .upsert({
          user_id: user.id,
          entry_date: selectedDate,
          ...timeEntry,
        }, {
          onConflict: 'user_id,entry_date',
        });

      if (upsertError) throw upsertError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof TimeEntry, value: string) => {
    const numValue = parseFloat(value) || 0;
    setTimeEntry(prev => ({ ...prev, [key]: Math.max(0, Math.min(24, numValue)) }));
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 lg:p-8">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none text-white"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {categories.map(({ key, label, color, icon }) => (
          <div key={key} className="group">
            <label className="flex items-center justify-between text-sm font-medium text-gray-300 mb-2">
              <span className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                {label}
              </span>
              <span className="text-gray-400">{timeEntry[key as keyof TimeEntry]}h</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={timeEntry[key as keyof TimeEntry]}
              onChange={(e) => handleChange(key as keyof TimeEntry, e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none text-white"
            />
            <div className="mt-2 h-2 bg-gray-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${color} transition-all duration-300`}
                style={{ width: `${(timeEntry[key as keyof TimeEntry] / 24) * 100}%` }}
              />
            </div>
          </div>
        ))}

        <div className={`p-4 rounded-lg border-2 transition-all ${
          isValid
            ? 'bg-cyan-500/10 border-cyan-500/50'
            : 'bg-red-500/10 border-red-500/50'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-200">Total Hours</span>
            <span className={`text-xl font-bold ${isValid ? 'text-cyan-400' : 'text-red-400'}`}>
              {totalHours.toFixed(1)} / 24h
            </span>
          </div>
          {!isValid && (
            <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Total cannot exceed 24 hours</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
            Entry saved successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isValid}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </div>
  );
}
