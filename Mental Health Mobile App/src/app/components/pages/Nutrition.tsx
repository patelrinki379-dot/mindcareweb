import { useState } from 'react';
import { useFitness, NutritionEntry } from '../../context/FitnessContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '../ui/progress';

export function Nutrition() {
  const { nutrition, addNutrition, updateNutrition, deleteNutrition } = useFitness();
  const [isOpen, setIsOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<NutritionEntry | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mealType: 'breakfast' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  // Calculate daily totals for today
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = nutrition.filter(n => n.date === today);
  const dailyTotals = todayEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Daily goals
  const goals = {
    calories: 2500,
    protein: 150,
    carbs: 250,
    fat: 80,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry: NutritionEntry = {
      id: editingEntry?.id || Date.now().toString(),
      date: formData.date,
      mealType: formData.mealType,
      name: formData.name,
      calories: Number(formData.calories),
      protein: Number(formData.protein),
      carbs: Number(formData.carbs),
      fat: Number(formData.fat),
    };

    if (editingEntry) {
      updateNutrition(editingEntry.id, entry);
      toast.success('Nutrition entry updated successfully!');
    } else {
      addNutrition(entry);
      toast.success('Nutrition entry added successfully!');
    }

    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      mealType: 'breakfast',
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
    });
    setEditingEntry(null);
  };

  const handleEdit = (entry: NutritionEntry) => {
    setEditingEntry(entry);
    setFormData({
      date: entry.date,
      mealType: entry.mealType,
      name: entry.name,
      calories: entry.calories.toString(),
      protein: entry.protein.toString(),
      carbs: entry.carbs.toString(),
      fat: entry.fat.toString(),
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteNutrition(id);
    toast.success('Nutrition entry deleted successfully!');
  };

  const getMealTypeColor = (mealType: string) => {
    const colors = {
      breakfast: 'bg-yellow-100 text-yellow-800',
      lunch: 'bg-green-100 text-green-800',
      dinner: 'bg-blue-100 text-blue-800',
      snack: 'bg-purple-100 text-purple-800',
    };
    return colors[mealType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nutrition</h1>
          <p className="text-gray-600 mt-1">Track your daily nutrition and meals</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingEntry ? 'Edit Meal' : 'Add New Meal'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Label htmlFor="mealType">Meal Type</Label>
                  <Select
                    value={formData.mealType}
                    onValueChange={(value: any) => setFormData({ ...formData, mealType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="name">Meal Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Grilled Chicken Salad"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    value={formData.fat}
                    onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEntry ? 'Update' : 'Add'} Meal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Daily Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Calories</span>
                <span className="text-sm font-medium">
                  {dailyTotals.calories} / {goals.calories}
                </span>
              </div>
              <Progress value={(dailyTotals.calories / goals.calories) * 100} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Protein</span>
                <span className="text-sm font-medium">
                  {dailyTotals.protein}g / {goals.protein}g
                </span>
              </div>
              <Progress value={(dailyTotals.protein / goals.protein) * 100} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Carbs</span>
                <span className="text-sm font-medium">
                  {dailyTotals.carbs}g / {goals.carbs}g
                </span>
              </div>
              <Progress value={(dailyTotals.carbs / goals.carbs) * 100} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Fat</span>
                <span className="text-sm font-medium">
                  {dailyTotals.fat}g / {goals.fat}g
                </span>
              </div>
              <Progress value={(dailyTotals.fat / goals.fat) * 100} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Entries */}
      <div className="space-y-4">
        {nutrition.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMealTypeColor(entry.mealType)}`}>
                      {entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{entry.name}</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Calories</div>
                      <div className="font-semibold">{entry.calories}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Protein</div>
                      <div className="font-semibold">{entry.protein}g</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Carbs</div>
                      <div className="font-semibold">{entry.carbs}g</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Fat</div>
                      <div className="font-semibold">{entry.fat}g</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
