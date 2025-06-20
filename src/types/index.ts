import {
  User,
  Program,
  Workout,
  Exercise,
  WorkoutSession,
} from "@prisma/client";

// Onboarding form data
export interface OnboardingFormData {
  // Profil de base
  name: string;
  age: string;
  weight: string;
  height: string;
  experience: string;

  // Objectifs
  fightDate: string;
  fightType: string;
  goals: string[];

  // Niveau physique
  trainingFrequency: string;
  currentCondition: string;
  injuries: string;

  // Tests 1RM
  benchPress: string;
  squat: string;
  deadlift: string;

  // Disponibilités
  sessionsPerWeek: string;
  sessionDuration: string;
  equipment: string[];
}

// Extended user type with all relations
export interface UserProfile extends User {
  programs?: UserProgramWithDetails[];
  workouts?: WorkoutSession[];
}

export interface UserProgramWithDetails {
  id: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  currentWeek: number;
  currentPhase: number;
  program: ProgramWithDetails;
}

export interface ProgramWithDetails extends Program {
  phases: PhaseWithWorkouts[];
  exercises: Exercise[];
}

export interface PhaseWithWorkouts {
  id: string;
  name: string;
  description?: string;
  weekStart: number;
  weekEnd: number;
  focus?: string;
  workouts: WorkoutWithExercises[];
}

export interface WorkoutWithExercises extends Workout {
  exercises: WorkoutExerciseWithDetails[];
}

export interface WorkoutExerciseWithDetails {
  id: string;
  order: number;
  sets?: number;
  reps?: string;
  weight?: number;
  rest?: number;
  tempo?: string;
  rpe?: number;
  notes?: string;
  supersetGroup?: string;
  exercise: Exercise;
}

// Program generation types
export interface ProgramGenerationParams {
  userGoals: string[];
  fightDate: Date;
  experience: string;
  currentCondition: string;
  sessionsPerWeek: number;
  sessionDuration: number;
  equipment: string[];
  oneRMs: {
    bench?: number;
    squat?: number;
    deadlift?: number;
  };
}

export interface ExerciseTemplate {
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  defaultSets: number;
  defaultReps: string;
  oneRMPercentage?: number;
  description?: string;
  instructions?: string[];
}

// Workout tracking types
export interface WorkoutProgress {
  workoutId: string;
  exercises: ExerciseProgress[];
  startTime: Date;
  endTime?: Date;
  notes?: string;
}

export interface ExerciseProgress {
  exerciseId: string;
  sets: SetProgress[];
}

export interface SetProgress {
  setNumber: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  rpe?: number;
  completed: boolean;
}

// Nouveaux types pour les sections
export interface WorkoutSection {
  id: string;
  name: string;
  type: string;
  order: number;
  description?: string;
  restBetweenSets?: number;
  isCircuit: boolean;
  circuitSets?: number;
  exercises: SectionExerciseWithDetails[];
}

export interface SectionExerciseWithDetails {
  id: string;
  order: number;
  sets?: number;
  reps?: string;
  weight?: number;
  duration?: number;
  restAfter?: number;
  isUnilateral: boolean;
  supersetGroup?: string;
  exercise: Exercise;
}

export interface WorkoutWithSections extends Workout {
  sections: WorkoutSection[];
}
