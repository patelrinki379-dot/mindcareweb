import { useState } from 'react';
import { useFitness, MoodEntry } from '../../context/FitnessContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Slider } from '../ui/slider';
import { Plus, Trash2, Edit2, Smile, Meh, Frown, TrendingUp, TrendingDown, Moon, Zap, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const moodEmojis = {
  excellent: { icon: '😄', label: 'Excellent', color: 'bg-green-500' },
  good: { icon: '🙂', label: 'Good', color: 'bg-blue-500' },
  neutral: { icon: '😐', label: 'Neutral', color: 'bg-yellow-500' },
  bad: { icon: '😟', label: 'Bad', color: 'bg-orange-500' },
  terrible: { icon: '😢', label: 'Terrible', color: 'bg-red-500' },
};

export function MoodTracker() {
  const { moods, addMood, updateMood, deleteMood } = useFitness();
  const [isOpen, setIsOpen] = useState(false);
  const [editingMood, setEditingMood] = useState<MoodEntry | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    mood: 'good' as 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible',
    energy: 5,
    stress: 5,
    sleep: 7,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry: MoodEntry = {
      id: editingMood?.id || Date.now().toString(),
      date: formData.date,
      time: formData.time,
      mood: formData.mood,
      energy: formData.energy,
      stress: formData.stress,
      sleep: formData.sleep,
      notes: formData.notes,
    };

    if (editingMood) {
      updateMood(editingMood.id, entry);
      toast.success('Mood entry updated successfully!');
    } else {
      addMood(entry);
      toast.success('Mood entry added successfully!');
    }

    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      mood: 'good',
      energy: 5,
      stress: 5,
      sleep: 7,
      notes: '',
    });
    setEditingMood(null);
  };

  const handleEdit = (mood: MoodEntry) => {
    setEditingMood(mood);
    setFormData({
      date: mood.date,
      time: mood.time,
      mood: mood.mood,
      energy: mood.energy,
      stress: mood.stress,
      sleep: mood.sleep,
      notes: mood.notes || '',
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMood(id);
    toast.success('Mood entry deleted successfully!');
  };

  // Calculate averages
  const avgEnergy = moods.length > 0
    ? (moods.reduce((sum, m) => sum + m.energy, 0) / moods.length).toFixed(1)
    : '0';
  const avgStress = moods.length > 0
    ? (moods.reduce((sum, m) => sum + m.stress, 0) / moods.length).toFixed(1)
    : '0';
  const avgSleep = moods.length > 0
    ? (moods.reduce((sum, m) => sum + m.sleep, 0) / moods.length).toFixed(1)
    : '0';

  // Prepare chart data
  const chartData = moods
    .slice(0, 14)
    .reverse()
    .map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      energy: m.energy,
      stress: m.stress,
      sleep: m.sleep,
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mood Tracker</h1>
          <p className="text-gray-600 mt-1">Track your mental wellness and daily mood</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Mood Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMood ? 'Edit Mood Entry' : 'Add New Mood Entry'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="mb-3 block">How are you feeling?</Label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(moodEmojis).map(([key, { icon, label, color }]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood: key as any })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.mood === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-1">{icon}</div>
                      <div className="text-xs font-medium">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="energy">Energy Level: {formData.energy}/10</Label>
                <Slider
                  id="energy"
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.energy]}
                  onValueChange={(value) => setFormData({ ...formData, energy: value[0] })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="stress">Stress Level: {formData.stress}/10</Label>
                <Slider
                  id="stress"
                  min={1}
                  max={10}
                  step={1}
                  value={[formData.stress]}
                  onValueChange={(value) => setFormData({ ...formData, stress: value[0] })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="sleep">Hours of Sleep: {formData.sleep}h</Label>
                <Slider
                  id="sleep"
                  min={0}
                  max={12}
                  step={0.5}
                  value={[formData.sleep]}
                  onValueChange={(value) => setFormData({ ...formData, sleep: value[0] })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="How was your day? Any thoughts or observations..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMood ? 'Update' : 'Add'} Entry
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Energy</CardTitle>
            <Zap className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{avgEnergy}/10</div>
            <p className="text-xs text-gray-500 mt-1">Last {moods.length} entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Stress</CardTitle>
            <Brain className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{avgStress}/10</div>
            <p className="text-xs text-gray-500 mt-1">Last {moods.length} entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Sleep</CardTitle>
            <Moon className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{avgSleep}h</div>
            <p className="text-xs text-gray-500 mt-1">Per night</p>
          </CardContent>
        </Card>
      </div>

      {/* Mood Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="energy" stroke="#eab308" strokeWidth={2} name="Energy" />
              <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} name="Stress" />
              <Line type="monotone" dataKey="sleep" stroke="#6366f1" strokeWidth={2} name="Sleep (hrs)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mood Entries */}
      <div className="space-y-4">
        {moods.map((mood) => {
          const moodInfo = moodEmojis[mood.mood];
          return (
            <Card key={mood.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-5xl">{moodInfo.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${moodInfo.color}`}>
                          {moodInfo.label}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(mood.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })} at {mood.time}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm text-gray-600">Energy: {mood.energy}/10</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-600">Stress: {mood.stress}/10</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm text-gray-600">Sleep: {mood.sleep}h</span>
                        </div>
                      </div>

                      {mood.notes && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{mood.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(mood)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(mood.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
