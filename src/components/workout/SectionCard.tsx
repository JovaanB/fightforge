import React, { useState } from "react";
import { Clock, Info, Play, Pause, RotateCcw, CheckCircle } from "lucide-react";
import ExerciseRow from "./ExerciseRow";
import { WorkoutSection, SectionExerciseWithDetails } from "@/types";

interface SectionCardProps {
  section: WorkoutSection;
  progress: any;
  onUpdateProgress: (
    sectionId: string,
    exerciseId: string,
    setIndex: number,
    data: any
  ) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({
  section,
  progress,
  onUpdateProgress,
}) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [restInterval, setRestInterval] = useState<NodeJS.Timeout | null>(null);
  const [circuitTimer, setCircuitTimer] = useState<number | null>(null);
  const [isCircuitRest, setIsCircuitRest] = useState(false);

  const startRestTimer = (duration: number, isCircuitRestPeriod = false) => {
    setRestTimer(duration);
    setIsCircuitRest(isCircuitRestPeriod);

    const interval = setInterval(() => {
      setRestTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setRestInterval(null);
          setIsCircuitRest(false);
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
    setIsCircuitRest(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculer le progrès de la section
  const totalExercises = section.exercises.length;
  const totalSets = section.isCircuit
    ? totalExercises * (section.circuitSets || 3)
    : section.exercises.reduce(
        (acc: number, ex: SectionExerciseWithDetails) => acc + (ex.sets || 1),
        0
      );

  const completedSets = Object.values(progress.exercises || {}).reduce(
    (acc: number, exerciseProgress: any) => {
      return (
        acc +
        (exerciseProgress.sets || []).filter((set: any) => set.completed).length
      );
    },
    0
  );

  const sectionProgressPercentage =
    totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  const isSectionComplete = sectionProgressPercentage === 100;

  const getSectionTypeIcon = () => {
    switch (section.type) {
      case "WARMUP":
        return "🔥";
      case "SUPERSET":
        return "💪";
      case "CIRCUIT":
        return "🔄";
      default:
        return "🏋️";
    }
  };

  const getSectionTypeColor = () => {
    switch (section.type) {
      case "WARMUP":
        return "from-orange-500 to-yellow-500";
      case "SUPERSET":
        return "from-blue-500 to-purple-500";
      case "CIRCUIT":
        return "from-green-500 to-teal-500";
      default:
        return "from-red-500 to-orange-500";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Section Header */}
      <div
        className={`p-6 bg-gradient-to-r ${getSectionTypeColor()} text-white`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{getSectionTypeIcon()}</span>
              <h3 className="text-xl font-bold">{section.name}</h3>
              {section.isCircuit && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  Circuit • {section.circuitSets} tours
                </span>
              )}
            </div>

            {section.description && (
              <p className="text-white/90 mb-3">{section.description}</p>
            )}

            <div className="flex items-center space-x-4 text-sm text-white/80">
              <span>📋 {totalExercises} exercices</span>
              <span>🎯 {totalSets} séries totales</span>
              {section.restBetweenSets && (
                <span>⏱️ {section.restBetweenSets}s repos</span>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold">
              {Math.round(sectionProgressPercentage)}%
            </div>
            <div className="text-sm text-white/80">
              {completedSets}/{totalSets} séries
            </div>
            {isSectionComplete && (
              <CheckCircle className="w-6 h-6 text-green-300 mt-2" />
            )}
          </div>
        </div>

        {/* Section Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${sectionProgressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Rest Timer */}
      {restTimer && (
        <div
          className={`p-4 ${
            isCircuitRest
              ? "bg-green-50 border-b border-green-200"
              : "bg-blue-50 border-b border-blue-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock
                className={`w-5 h-5 ${
                  isCircuitRest ? "text-green-600" : "text-blue-600"
                }`}
              />
              <span
                className={`font-medium ${
                  isCircuitRest ? "text-green-900" : "text-blue-900"
                }`}
              >
                {isCircuitRest ? "Repos entre tours" : "Repos en cours"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-xl font-bold ${
                  isCircuitRest ? "text-green-900" : "text-blue-900"
                }`}
              >
                {formatTime(restTimer)}
              </span>
              <button
                onClick={stopRestTimer}
                className={`px-3 py-1 ${
                  isCircuitRest
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white text-sm rounded-lg transition-colors`}
              >
                Arrêter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Circuit Instructions */}
      {section.isCircuit && (
        <div className="p-4 bg-green-50 border-b border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-600 font-medium">
              🔄 Instructions Circuit :
            </span>
          </div>
          <p className="text-sm text-green-800">
            Enchaîne tous les exercices sans pause, puis repos{" "}
            {section.restBetweenSets || 120}s entre chaque tour. Répète{" "}
            {section.circuitSets || 3} fois au total.
          </p>
        </div>
      )}

      {/* Exercises */}
      <div className="p-6">
        <div className="space-y-4">
          {section.exercises.map(
            (exercise: SectionExerciseWithDetails, index: number) => (
              <ExerciseRow
                key={exercise.id}
                exercise={exercise}
                progress={
                  progress.exercises[exercise.exercise.id] || { sets: [] }
                }
                onUpdateProgress={(setIndex, data) =>
                  onUpdateProgress(
                    section.id,
                    exercise.exercise.id,
                    setIndex,
                    data
                  )
                }
                isCircuit={section.isCircuit}
                supersetPartner={
                  exercise.supersetGroup
                    ? section.exercises.find(
                        (ex: SectionExerciseWithDetails) =>
                          ex.supersetGroup === exercise.supersetGroup &&
                          ex.id !== exercise.id
                      )
                    : undefined
                }
              />
            )
          )}
        </div>

        {/* Section Controls */}
        <div className="mt-6 flex justify-center space-x-3">
          {section.restBetweenSets && (
            <button
              onClick={() => startRestTimer(section.restBetweenSets!)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Repos normal ({section.restBetweenSets}s)
            </button>
          )}

          {section.isCircuit && section.restBetweenSets && (
            <button
              onClick={() => startRestTimer(section.restBetweenSets!, true)}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              Repos entre tours
            </button>
          )}

          <button
            onClick={() => startRestTimer(60)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Repos 1min
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionCard;
