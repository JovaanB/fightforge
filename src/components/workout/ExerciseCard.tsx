import React, { useState } from "react";
import { Check, Info, Plus, Minus, Clock } from "lucide-react";
import {
  WorkoutExerciseWithDetails,
  ExerciseProgress,
  SetProgress,
} from "@/types";

interface ExerciseCardProps {
  exercise: WorkoutExerciseWithDetails;
  progress: ExerciseProgress;
  onUpdateProgress: (
    exerciseId: string,
    setIndex: number,
    setData: Partial<SetProgress>
  ) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  progress,
  onUpdateProgress,
}) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [restInterval, setRestInterval] = useState<NodeJS.Timeout | null>(null);

  const startRestTimer = (duration: number) => {
    setRestTimer(duration);
    const interval = setInterval(() => {
      setRestTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setRestInterval(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    setRestInterval(interval);
  };

  const stopRestTimer = () => {
    if (restInterval) {
      clearInterval(restInterval);
      setRestInterval(null);
    }
    setRestTimer(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const updateWeight = (setIndex: number, delta: number) => {
    const currentWeight = progress.sets[setIndex].weight || 0;
    const newWeight = Math.max(0, currentWeight + delta);
    onUpdateProgress(exercise.exercise.id, setIndex, { weight: newWeight });
  };

  const updateReps = (setIndex: number, reps: number) => {
    onUpdateProgress(exercise.exercise.id, setIndex, { reps });
  };

  const updateRPE = (setIndex: number, rpe: number) => {
    onUpdateProgress(exercise.exercise.id, setIndex, { rpe });
  };

  const toggleSetComplete = (setIndex: number) => {
    const set = progress.sets[setIndex];
    onUpdateProgress(exercise.exercise.id, setIndex, {
      completed: !set.completed,
    });
    // Démarre le timer de repos automatiquement si la série est complétée et qu'un temps de repos est défini
    if (!set.completed && exercise.rest) {
      startRestTimer(exercise.rest);
    }
  };

  const completedSets = progress.sets.filter((set) => set.completed).length;
  const totalSets = progress.sets.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                {exercise.exercise.name}
              </h3>
              {exercise.supersetGroup && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {exercise.supersetGroup}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>🔥 {exercise.sets} séries</span>
              <span>🎯 {exercise.reps} reps</span>
              {exercise.weight && <span>⚖️ {exercise.weight}kg</span>}
              {exercise.rest && <span>⏱️ {exercise.rest}s repos</span>}
              {exercise.rpe && <span>💪 RPE {exercise.rpe}</span>}
            </div>
            {exercise.exercise.description && (
              <p className="text-gray-600 mt-2">
                {exercise.exercise.description}
              </p>
            )}
            {exercise.notes && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">💡 {exercise.notes}</p>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {completedSets}/{totalSets}
              </div>
              <div className="text-xs text-gray-500">séries</div>
            </div>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSets / totalSets) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      {showInstructions && exercise.exercise.instructions && (
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <h4 className="font-medium text-gray-900 mb-2">Instructions :</h4>
          <ol className="space-y-1">
            {exercise.exercise.instructions.map(
              (instruction: string, index: number) => (
                <li key={index} className="text-sm text-gray-600">
                  {index + 1}. {instruction}
                </li>
              )
            )}
          </ol>
        </div>
      )}
      {restTimer && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Repos en cours</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-blue-900">
                {formatTime(restTimer)}
              </span>
              <button
                onClick={stopRestTimer}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Arrêter
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="p-6">
        <div className="space-y-4">
          {progress.sets.map((set, index) => (
            <div
              key={index}
              className={`p-4 border-2 rounded-lg transition-all ${
                set.completed
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">
                  Série {set.setNumber}
                </h4>
                <button
                  onClick={() => toggleSetComplete(index)}
                  className={`p-2 rounded-full transition-all ${
                    set.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Poids (kg)
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateWeight(index, -2.5)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={set.weight || ""}
                      onChange={(e) =>
                        onUpdateProgress(exercise.exercise.id, index, {
                          weight: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                      step="0.5"
                    />
                    <button
                      onClick={() => updateWeight(index, 2.5)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Répétitions
                  </label>
                  <input
                    type="number"
                    value={set.reps || ""}
                    onChange={(e) =>
                      updateReps(index, parseInt(e.target.value) || 0)
                    }
                    className="w-full border border-gray-300 rounded px-3 py-1"
                    placeholder={exercise.reps || ""}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    RPE (1-10)
                  </label>
                  <select
                    value={set.rpe || ""}
                    onChange={(e) =>
                      updateRPE(index, parseInt(e.target.value) || 0)
                    }
                    className="w-full border border-gray-300 rounded px-3 py-1"
                  >
                    <option value="">-</option>
                    {[...Array(10)].map((_, i: number) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                {exercise.tempo && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tempo
                    </label>
                    <div className="text-sm text-gray-600 py-1">
                      {exercise.tempo}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center space-x-3">
          <button
            onClick={() => startRestTimer(exercise.rest || 60)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Démarrer repos
          </button>
          {exercise.rest && (
            <button
              onClick={() => startRestTimer(exercise.rest! + 30)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Repos +30s
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
