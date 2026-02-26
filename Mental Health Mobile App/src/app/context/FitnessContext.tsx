import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface WorkoutSession {
  id: string;
  date: string;
  time: string;
  type: string;
  duration: number; // minutes
  caloriesBurned: number;
  temperature?: number; // celsius
  videoUrl?: string; // YouTube or other video URL
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface NutritionEntry {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MoodEntry {
  id: string;
  date: string;
  time: string;
  mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  energy: number; // 1-10
  stress: number; // 1-10
  sleep: number; // hours
  notes?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  goal: string;
  activityLevel: string;
}

interface FitnessContextType {
  workouts: WorkoutSession[];
  nutrition: NutritionEntry[];
  moods: MoodEntry[];
  profile: UserProfile;
  addWorkout: (workout: WorkoutSession) => void;
  updateWorkout: (id: string, workout: WorkoutSession) => void;
  deleteWorkout: (id: string) => void;
  addNutrition: (entry: NutritionEntry) => void;
  updateNutrition: (id: string, entry: NutritionEntry) => void;
  deleteNutrition: (id: string) => void;
  addMood: (entry: MoodEntry) => void;
  updateMood: (id: string, entry: MoodEntry) => void;
  deleteMood: (id: string) => void;
  updateProfile: (profile: UserProfile) => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

// Sample data
const sampleWorkouts: WorkoutSession[] = [
  {
    id: '1',
    date: '2026-02-24',
    time: '07:30',
    type: 'Strength Training',
    duration: 60,
    caloriesBurned: 350,
    temperature: 22,
    videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    exercises: [
      { id: 'e1', name: 'Bench Press', sets: 4, reps: 10, weight: 80 },
      { id: 'e2', name: 'Squats', sets: 4, reps: 12, weight: 100 },
      { id: 'e3', name: 'Deadlifts', sets: 3, reps: 8, weight: 120 },
    ],
  },
  {
    id: '2',
    date: '2026-02-23',
    time: '18:00',
    type: 'Cardio',
    duration: 45,
    caloriesBurned: 400,
    temperature: 20,
    videoUrl: 'https://www.youtube.com/watch?v=ml6cT4AZdqI',
    exercises: [
      { id: 'e4', name: 'Running', sets: 1, reps: 1 },
      { id: 'e5', name: 'Cycling', sets: 1, reps: 1 },
    ],
  },
  {
    id: '3',
    date: '2026-02-21',
    time: '06:00',
    type: 'HIIT',
    duration: 30,
    caloriesBurned: 320,
    temperature: 21,
    videoUrl: 'https://www.youtube.com/watch?v=M0uO8X3_tEA',
    exercises: [
      { id: 'e6', name: 'Burpees', sets: 5, reps: 15 },
      { id: 'e7', name: 'Mountain Climbers', sets: 5, reps: 20 },
      { id: 'e8', name: 'Jump Squats', sets: 5, reps: 15 },
    ],
  },
];

const sampleNutrition: NutritionEntry[] = [
  {
    id: 'n1',
    date: '2026-02-24',
    mealType: 'breakfast',
    name: 'Oatmeal with Berries',
    calories: 350,
    protein: 12,
    carbs: 55,
    fat: 8,
  },
  {
    id: 'n2',
    date: '2026-02-24',
    mealType: 'lunch',
    name: 'Grilled Chicken Salad',
    calories: 450,
    protein: 35,
    carbs: 30,
    fat: 18,
  },
  {
    id: 'n3',
    date: '2026-02-24',
    mealType: 'snack',
    name: 'Protein Shake',
    calories: 200,
    protein: 25,
    carbs: 15,
    fat: 5,
  },
  {
    id: 'n4',
    date: '2026-02-23',
    mealType: 'dinner',
    name: 'Salmon with Quinoa',
    calories: 550,
    protein: 40,
    carbs: 45,
    fat: 20,
  },
];

const sampleMoods: MoodEntry[] = [
  {
    id: 'm1',
    date: '2026-02-24',
    time: '08:00',
    mood: 'excellent',
    energy: 9,
    stress: 2,
    sleep: 8,
    notes: 'Great start to the day! Morning workout felt amazing.',
  },
  {
    id: 'm2',
    date: '2026-02-23',
    time: '20:00',
    mood: 'good',
    energy: 7,
    stress: 4,
    sleep: 7,
    notes: 'Productive day, feeling satisfied.',
  },
  {
    id: 'm3',
    date: '2026-02-22',
    time: '12:00',
    mood: 'neutral',
    energy: 5,
    stress: 6,
    sleep: 6,
    notes: 'Could use more sleep tonight.',
  },
  {
    id: 'm4',
    date: '2026-02-21',
    time: '09:00',
    mood: 'good',
    energy: 8,
    stress: 3,
    sleep: 7.5,
    notes: 'Feeling energized after a good night\'s rest.',
  },
];

const sampleProfile: UserProfile = {
  name: 'Alex Johnson',
  age: 28,
  weight: 75,
  height: 175,
  goal: 'Build Muscle',
  activityLevel: 'Very Active',
};

export function FitnessProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>(sampleWorkouts);
  const [nutrition, setNutrition] = useState<NutritionEntry[]>(sampleNutrition);
  const [moods, setMoods] = useState<MoodEntry[]>(sampleMoods);
  const [profile, setProfile] = useState<UserProfile>(sampleProfile);

  const addWorkout = (workout: WorkoutSession) => {
    setWorkouts([workout, ...workouts]);
  };

  const updateWorkout = (id: string, workout: WorkoutSession) => {
    setWorkouts(workouts.map(w => w.id === id ? workout : w));
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const addNutrition = (entry: NutritionEntry) => {
    setNutrition([entry, ...nutrition]);
  };

  const updateNutrition = (id: string, entry: NutritionEntry) => {
    setNutrition(nutrition.map(n => n.id === id ? entry : n));
  };

  const deleteNutrition = (id: string) => {
    setNutrition(nutrition.filter(n => n.id !== id));
  };

  const addMood = (entry: MoodEntry) => {
    setMoods([entry, ...moods]);
  };

  const updateMood = (id: string, entry: MoodEntry) => {
    setMoods(moods.map(m => m.id === id ? entry : m));
  };

  const deleteMood = (id: string) => {
    setMoods(moods.filter(m => m.id !== id));
  };

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  return (
    <FitnessContext.Provider
      value={{
        workouts,
        nutrition,
        moods,
        profile,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        addNutrition,
        updateNutrition,
        deleteNutrition,
        addMood,
        updateMood,
        deleteMood,
        updateProfile,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
}

export function useFitness() {
  const context = useContext(FitnessContext);
  if (context === undefined) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
}