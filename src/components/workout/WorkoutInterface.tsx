import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Dumbbell,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Timer from "./Timer";
import SectionCard from "./SectionCard";
import {
  WorkoutWithSections,
  WorkoutSection,
  SectionExerciseWithDetails,
} from "@/types";

interface WorkoutInterfaceProps {
  workout: WorkoutWithSections;
  onComplete: (workoutProgress: any) => void;
}

const WorkoutInterface: React.FC<WorkoutInterfaceProps> = ({
  workout,
  onComplete,
}) => {
  const router = useRouter();
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [sectionsProgress, setSectionsProgress] = useState<Record<string, any>>(
    {}
  );
  const [showExitModal, setShowExitModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialProgress: Record<string, any> = {};
    workout.sections.forEach((section: WorkoutSection) => {
      const sectionId = section.id;
      const exercisesProgress: Record<string, any> = {};
      section.exercises.forEach((ex: SectionExerciseWithDetails) => {
        const sets = section.isCircuit
          ? section.circuitSets || 3
          : ex.sets || 1;
        exercisesProgress[ex.exercise.id] = {
          sets: Array.from({ length: sets }, (_, i) => ({
            setNumber: i + 1,
            leftSide: ex.isUnilateral
              ? { reps: undefined, weight: ex.weight, completed: false }
              : null,
            rightSide: ex.isUnilateral
              ? { reps: undefined, weight: ex.weight, completed: false }
              : null,
            bilateral: !ex.isUnilateral
              ? {
                  reps: undefined,
                  weight: ex.weight,
                  duration: ex.duration,
                  completed: false,
                }
              : null,
            rpe: undefined,
            completed: false,
          })),
        };
      });
      initialProgress[sectionId] = {
        exercises: exercisesProgress,
        completed: false,
        currentRound: section.isCircuit ? 1 : 0,
      };
    });
    setSectionsProgress(initialProgress);
  }, [workout.sections]);

  const startWorkout = () => {
    setIsStarted(true);
    setStartTime(new Date());
  };

  const pauseWorkout = () => {
    setIsPaused(!isPaused);
  };

  const resetWorkout = () => {
    setIsStarted(false);
    setIsPaused(false);
    setCurrentSectionIndex(0);
    setStartTime(null);
    setSectionsProgress({});
  };

  const completeWorkout = async () => {
    const endTime = new Date();
    const progress = {
      workoutId: (workout as any).id,
      sections: sectionsProgress,
      startTime,
      endTime,
      notes: "",
    };
    try {
      setIsLoading(true);
      await onComplete(progress);
    } catch (error) {
      console.error("Error completing workout:", error);
      alert("Erreur lors de la sauvegarde. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextSection = () => {
    if (currentSectionIndex < workout.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const updateSectionProgress = (
    sectionId: string,
    exerciseId: string,
    setIndex: number,
    data: any
  ) => {
    setSectionsProgress((prev: Record<string, any>) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        exercises: {
          ...prev[sectionId].exercises,
          [exerciseId]: {
            ...prev[sectionId].exercises[exerciseId],
            sets: prev[sectionId].exercises[exerciseId].sets.map(
              (set: any, index: number) =>
                index === setIndex ? { ...set, ...data } : set
            ),
          },
        },
      },
    }));
  };

  const currentSection = workout.sections[currentSectionIndex];
  const currentSectionProgress = sectionsProgress[currentSection?.id] || {
    exercises: {},
    completed: false,
  };

  const totalSections = workout.sections.length;
  const completedSections = Object.values(sectionsProgress).filter(
    (section: any) => section.completed
  ).length;
  const progressPercentage =
    totalSections > 0 ? (completedSections / totalSections) * 100 : 0;

  const isWorkoutComplete = true;

  const totalExercises = workout.sections.reduce(
    (acc: number, section: WorkoutSection) => acc + section.exercises.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowExitModal(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {(workout as any).name}
                </h1>
                <p className="text-sm text-gray-500">
                  {(workout as any).description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isStarted && <Timer startTime={startTime} isPaused={isPaused} />}
              <div className="text-right">
                <div className="text-sm text-gray-500">Progression</div>
                <div className="text-lg font-bold text-gray-900">
                  {Math.round(progressPercentage)}%
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>
                {completedSections} / {totalSections} sections
              </span>
              <span>{totalExercises} exercices</span>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        {!isStarted ? (
          <div className="text-center space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <Dumbbell className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Séance Complète Prête
              </h2>
              <p className="text-gray-600 mb-6">
                {totalSections} sections • {totalExercises} exercices • ~45-60
                minutes
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {workout.sections.map(
                  (section: WorkoutSection, index: number) => (
                    <div key={section.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h3 className="font-medium text-gray-900 text-sm">
                          {section.name}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500">
                        {section.exercises.length} exercices
                        {section.isCircuit && ` • ${section.circuitSets} tours`}
                      </p>
                      <div className="mt-2 space-y-1">
                        {section.exercises
                          .slice(0, 2)
                          .map((ex: SectionExerciseWithDetails) => (
                            <div key={ex.id} className="text-xs text-gray-600">
                              • {ex.exercise.name}
                            </div>
                          ))}
                        {section.exercises.length > 2 && (
                          <div className="text-xs text-gray-400">
                            +{section.exercises.length - 2} autres
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
              <button
                onClick={startWorkout}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all flex items-center space-x-2 mx-auto"
              >
                <Play className="w-6 h-6" />
                <span>Commencer l'Entraînement</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <button
                  onClick={goToPreviousSection}
                  disabled={currentSectionIndex === 0}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Section précédente</span>
                </button>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    {currentSection.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Section {currentSectionIndex + 1}/{totalSections}
                    {currentSection.isCircuit &&
                      ` • Circuit ${currentSectionProgress.currentRound || 1}/${
                        currentSection.circuitSets
                      }`}
                  </p>
                </div>
                <button
                  onClick={goToNextSection}
                  disabled={currentSectionIndex === workout.sections.length - 1}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Section suivante</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            {currentSection && (
              <SectionCard
                section={currentSection}
                progress={currentSectionProgress}
                onUpdateProgress={updateSectionProgress}
              />
            )}
            <div className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={pauseWorkout}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {isPaused ? (
                    <Play className="w-5 h-5" />
                  ) : (
                    <Pause className="w-5 h-5" />
                  )}
                  <span>{isPaused ? "Reprendre" : "Pause"}</span>
                </button>
                <button
                  onClick={resetWorkout}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset</span>
                </button>
                {isWorkoutComplete && (
                  <button
                    onClick={completeWorkout}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    <span>
                      {isLoading ? "Sauvegarde..." : "Terminer la Séance"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quitter la séance ?
            </h3>
            <p className="text-gray-600 mb-6">
              Ton progrès sera perdu si tu quittes maintenant. Es-tu sûr ?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Continuer
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutInterface;
