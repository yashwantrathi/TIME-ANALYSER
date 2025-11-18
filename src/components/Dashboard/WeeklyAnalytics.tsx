import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface CategoryData {
  name: string;
  hours: number;
  color: string;
  icon: string;
  percentage: number;
}

interface DayData {
  date: string;
  total: number;
  categories: Record<string, number>;
}

const categoryConfig = {
  study: { label: 'Study', color: '#3b82f6', icon: '📚' },
  sleep: { label: 'Sleep', color: '#a855f7', icon: '😴' },
  social_media: { label: 'Social Media', color: '#ec4899', icon: '📱' },
  eating: { label: 'Eating', color: '#f97316', icon: '🍽️' },
  college: { label: 'College', color: '#22c55e', icon: '🎓' },
  commute: { label: 'Commute', color: '#eab308', icon: '🚗' },
  leisure: { label: 'Leisure', color: '#06b6d4', icon: '🎮' },
  other: { label: 'Other', color: '#6b7280', icon: '⚡' },
};

export function WeeklyAnalytics() {
  const { user } = useAuth();
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeeklyData();
  }, []);

  const loadWeeklyData = async () => {
    if (!user) return;

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const { data } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('entry_date', sevenDaysAgo.toISOString().split('T')[0])
      .lte('entry_date', today.toISOString().split('T')[0])
      .order('entry_date', { ascending: true });

    if (data) {
      const days: DayData[] = data.map(entry => ({
        date: entry.entry_date,
        total: Number(entry.study) + Number(entry.sleep) + Number(entry.social_media) +
               Number(entry.eating) + Number(entry.college) + Number(entry.commute) +
               Number(entry.leisure) + Number(entry.other),
        categories: {
          study: Number(entry.study),
          sleep: Number(entry.sleep),
          social_media: Number(entry.social_media),
          eating: Number(entry.eating),
          college: Number(entry.college),
          commute: Number(entry.commute),
          leisure: Number(entry.leisure),
          other: Number(entry.other),
        },
      }));

      setWeekData(days);

      const totals = Object.keys(categoryConfig).reduce((acc, key) => {
        acc[key] = days.reduce((sum, day) => sum + (day.categories[key] || 0), 0);
        return acc;
      }, {} as Record<string, number>);

      const totalHours = Object.values(totals).reduce((sum, val) => sum + val, 0);

      const categories: CategoryData[] = Object.entries(categoryConfig).map(([key, config]) => ({
        name: config.label,
        hours: totals[key],
        color: config.color,
        icon: config.icon,
        percentage: totalHours > 0 ? (totals[key] / totalHours) * 100 : 0,
      })).sort((a, b) => b.hours - a.hours);

      setCategoryData(categories);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
      </div>
    );
  }

  const avgDailyHours = weekData.length > 0
    ? weekData.reduce((sum, day) => sum + day.total, 0) / weekData.length
    : 0;

  const mostProductiveDay = weekData.reduce((max, day) =>
    day.total > (max?.total || 0) ? day : max
  , weekData[0]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Avg Daily Hours</span>
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-white">{avgDailyHours.toFixed(1)}h</div>
          <div className="text-xs text-gray-400 mt-1">Last 7 days</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Most Productive</span>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {mostProductiveDay ? new Date(mostProductiveDay.date).toLocaleDateString('en-US', { weekday: 'short' }) : '-'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {mostProductiveDay ? `${mostProductiveDay.total.toFixed(1)}h tracked` : 'No data yet'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Total This Week</span>
            <TrendingDown className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {weekData.reduce((sum, day) => sum + day.total, 0).toFixed(1)}h
          </div>
          <div className="text-xs text-gray-400 mt-1">{weekData.length} days logged</div>
        </div>
      </div>

      <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 lg:p-8">
        <h3 className="text-xl font-bold text-white mb-6">Category Breakdown</h3>
        <div className="space-y-4">
          {categoryData.map((category) => (
            <div key={category.name} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium text-gray-200">{category.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-semibold">{category.hours.toFixed(1)}h</span>
                  <span className="text-gray-400 text-sm ml-2">({category.percentage.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${category.percentage}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {weekData.length > 0 && (
        <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 lg:p-8">
          <h3 className="text-xl font-bold text-white mb-6">Daily Overview</h3>
          <div className="grid grid-cols-7 gap-2">
            {weekData.map((day) => {
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              const heightPercentage = (day.total / 24) * 100;

              return (
                <div key={day.date} className="flex flex-col items-center">
                  <div className="w-full h-32 bg-gray-700/30 rounded-lg overflow-hidden flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 transition-all duration-500"
                      style={{ height: `${heightPercentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-2">{dayName}</div>
                  <div className="text-sm font-semibold text-white">{day.total.toFixed(1)}h</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
