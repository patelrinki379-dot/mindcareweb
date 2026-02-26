import { useFitness } from '../../context/FitnessContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Activity, Flame, Target, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function Dashboard() {
  const { workouts, nutrition, profile } = useFitness();

  // Calculate stats
  const totalWorkouts = workouts.length;
  const totalCaloriesBurned = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const avgWorkoutDuration = workouts.length > 0
    ? Math.round(workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length)
    : 0;
  const todayCalories = nutrition
    .filter(n => n.date === '2026-02-24')
    .reduce((sum, n) => sum + n.calories, 0);

  // Prepare chart data for weekly calories burned
  const workoutChartData = workouts.slice(0, 7).reverse().map(w => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    calories: w.caloriesBurned,
  }));

  // Prepare nutrition chart data
  const nutritionByDate = nutrition.reduce((acc, n) => {
    if (!acc[n.date]) {
      acc[n.date] = 0;
    }
    acc[n.date] += n.calories;
    return acc;
  }, {} as Record<string, number>);

  const nutritionChartData = Object.entries(nutritionByDate)
    .slice(0, 7)
    .map(([date, calories]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calories,
    }))
    .reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {profile.name}! Here's your fitness overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Workouts</CardTitle>
            <Activity className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalWorkouts}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Calories Burned</CardTitle>
            <Flame className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalCaloriesBurned.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Duration</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{avgWorkoutDuration} min</div>
            <p className="text-xs text-gray-500 mt-1">Per workout</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Calories</CardTitle>
            <Target className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{todayCalories}</div>
            <p className="text-xs text-gray-500 mt-1">Consumed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calories Burned</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workoutChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calorie Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={nutritionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calories" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Workouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workouts.slice(0, 3).map((workout) => (
              <div
                key={workout.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">{workout.type}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(workout.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{workout.duration} min</div>
                  <div className="text-sm text-gray-500">{workout.caloriesBurned} cal</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
