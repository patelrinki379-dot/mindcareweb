import { useState } from 'react';
import { useFitness, WorkoutSession, Exercise } from '../../context/FitnessContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus, Trash2, Edit2, Clock, Thermometer, Calendar, Video, Play, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function Workouts() {
  const { workouts, addWorkout, updateWorkout, deleteWorkout } = useFitness();
  const [isOpen, setIsOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutSession | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    type: '',
    duration: '',
    caloriesBurned: '',
    temperature: '',
    videoUrl: '',
  });

  const [exercises, setExercises] = useState<Exercise[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const workout: WorkoutSession = {
      id: editingWorkout?.id || Date.now().toString(),
      date: formData.date,
      time: formData.time,
      type: formData.type,
      duration: Number(formData.duration),
      caloriesBurned: Number(formData.caloriesBurned),
      temperature: formData.temperature ? Number(formData.temperature) : undefined,
      exercises,
      videoUrl: formData.videoUrl,
    };

    if (editingWorkout) {
      updateWorkout(editingWorkout.id, workout);
      toast.success('Workout updated successfully!');
    } else {
      addWorkout(workout);
      toast.success('Workout added successfully!');
    }

    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      type: '',
      duration: '',
      caloriesBurned: '',
      temperature: '',
      videoUrl: '',
    });
    setExercises([]);
    setEditingWorkout(null);
  };

  const handleEdit = (workout: WorkoutSession) => {
    setEditingWorkout(workout);
    setFormData({
      date: workout.date,
      time: workout.time,
      type: workout.type,
      duration: workout.duration.toString(),
      caloriesBurned: workout.caloriesBurned.toString(),
      temperature: workout.temperature?.toString(),
      videoUrl: workout.videoUrl || '',
    });
    setExercises(workout.exercises);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteWorkout(id);
    toast.success('Workout deleted successfully!');
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      { id: Date.now().toString(), name: '', sets: 0, reps: 0, weight: 0 },
    ]);
  };

  const updateExercise = (id: string, field: string, value: any) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  // Helper function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
      /youtube\.com\/embed\/([^&\s]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }

    // If it's already an embed URL or other video URL, return as is
    if (url.includes('youtube.com/embed/') || url.includes('vimeo.com')) {
      return url;
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
          <p className="text-gray-600 mt-1">Track and manage your workout sessions</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingWorkout ? 'Edit Workout' : 'Add New Workout'}</DialogTitle>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Workout Type</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g., Strength Training"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="calories">Calories Burned</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.caloriesBurned}
                    onChange={(e) => setFormData({ ...formData, caloriesBurned: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Exercises</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addExercise}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Exercise
                  </Button>
                </div>
                <div className="space-y-3">
                  {exercises.map((exercise) => (
                    <div key={exercise.id} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Input
                          placeholder="Exercise name"
                          value={exercise.name}
                          onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          placeholder="Sets"
                          value={exercise.sets || ''}
                          onChange={(e) => updateExercise(exercise.id, 'sets', Number(e.target.value))}
                        />
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          placeholder="Reps"
                          value={exercise.reps || ''}
                          onChange={(e) => updateExercise(exercise.id, 'reps', Number(e.target.value))}
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          placeholder="Weight (kg)"
                          value={exercise.weight || ''}
                          onChange={(e) => updateExercise(exercise.id, 'weight', Number(e.target.value))}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExercise(exercise.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="videoUrl">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-4 h-4" />
                    <span>Workout Video URL (Optional)</span>
                  </div>
                </Label>
                <Input
                  id="videoUrl"
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add a YouTube or Vimeo video link for workout guidance
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingWorkout ? 'Update' : 'Add'} Workout
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {workouts.map((workout) => (
          <Card key={workout.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{workout.type}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(workout.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{workout.time}</span>
                    </div>
                    {workout.temperature && (
                      <div className="flex items-center gap-1">
                        <Thermometer className="w-4 h-4" />
                        <span>{workout.temperature}°C</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(workout)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(workout.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="text-lg font-semibold">{workout.duration} minutes</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Calories Burned</div>
                  <div className="text-lg font-semibold">{workout.caloriesBurned}</div>
                </div>
              </div>

              {workout.videoUrl && getYouTubeEmbedUrl(workout.videoUrl) && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Workout Video</span>
                  </div>
                  <div className="relative rounded-lg overflow-hidden bg-gray-900" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src={getYouTubeEmbedUrl(workout.videoUrl)!}
                      className="absolute top-0 left-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {workout.exercises.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Exercises</div>
                  <div className="space-y-2">
                    {workout.exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium">{exercise.name}</span>
                        <span className="text-sm text-gray-600">
                          {exercise.sets} sets × {exercise.reps} reps
                          {exercise.weight ? ` @ ${exercise.weight}kg` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}