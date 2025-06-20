"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import WorkoutInterface from "@/components/workout/WorkoutInterface";
import { WorkoutWithExercises } from "@/types";

interface SetData {
  setNumber: number;
  reps?: string | null;
  weight?: number | null;
  duration?: number | null;
  distance?: number | null;
  rpe?: number | null;
  completed: boolean;
  isBodyweight?: boolean;
}

interface AdaptedExerciseData {
  exerciseId: string;
  sets: SetData[];
  isBodyweight?: boolean;
}

export default function WorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutWithExercises | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchWorkout(params.id as string);
    }
  }, [params.id]);

  const fetchWorkout = async (workoutId: string) => {
    try {
      const response = await fetch(`/api/workout/${workoutId}`);
      if (response.ok) {
        const workoutData = await response.json();
        setWorkout(workoutData);
      } else {
        console.error("Failed to fetch workout");
      }
    } catch (error) {
      console.error("Error fetching workout:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutComplete = async (workoutProgress: any) => {
    try {
      const adaptedProgress: {
        workoutId: string;
        startTime: Date;
        endTime: Date;
        exercises: AdaptedExerciseData[];
        notes: string;
      } = {
        workoutId: workoutProgress.workoutId,
        startTime: workoutProgress.startTime,
        endTime: workoutProgress.endTime,
        exercises: [],
        notes: workoutProgress.notes || "",
      };

      Object.entries(workoutProgress.sections || {}).forEach(
        ([sectionId, sectionData]: [string, any]) => {
          Object.entries(sectionData.exercises || {}).forEach(
            ([exerciseId, exerciseData]: [string, any]) => {
              adaptedProgress.exercises.push({
                exerciseId,
                sets: exerciseData.sets.map((set: any) => ({
                  ...set,
                  weight: exerciseData.isBodyweight ? null : set.weight,
                })),
                isBodyweight: exerciseData.isBodyweight,
              });
            }
          );
        }
      );

      const response = await fetch("/api/workout/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adaptedProgress),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Workout completed:", result);
        router.push("/dashboard?completed=true");
      } else {
        const error = await response.json();
        console.error("Workout completion failed:", error);
        throw new Error(error.error || "Failed to complete workout");
      }
    } catch (error) {
      console.error("Error completing workout:", error);
      throw error; // Re-throw pour que l'interface puisse gérer l'erreur
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de ta séance...</p>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Séance introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkoutInterface workout={workout} onComplete={handleWorkoutComplete} />
    </div>
  );
}
