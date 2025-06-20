import React, { useState } from "react";
import { Check, Info, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { SectionExerciseWithDetails } from "@/types";

// Typage explicite pour les sets unilatéraux/bilatéraux
interface UnilateralSet {
  setNumber: number;
  leftSide?: { reps?: number; weight?: number };
  rightSide?: { reps?: number; weight?: number };
  rpe?: number;
  completed: boolean;
}
interface BilateralSet {
  setNumber: number;
  bilateral?: { reps?: number; weight?: number; duration?: number };
  rpe?: number;
  completed: boolean;
}

type SetType = UnilateralSet | BilateralSet;

interface ExerciseRowProps {
  exercise: SectionExerciseWithDetails;
  progress: { sets: SetType[] };
  onUpdateProgress: (setIndex: number, data: Partial<SetType>) => void;
  isCircuit?: boolean;
  supersetPartner?: SectionExerciseWithDetails;
}

const ExerciseRow: React.FC<ExerciseRowProps> = ({
  exercise,
  progress,
  onUpdateProgress,
  isCircuit = false,
  supersetPartner,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedSet, setExpandedSet] = useState<number | null>(null);

  const updateWeight = (
    setIndex: number,
    side: "bilateral" | "leftSide" | "rightSide",
    delta: number
  ) => {
    const currentSet = progress.sets[setIndex] as any;
    if (!currentSet) return;
    const currentWeight = currentSet[side]?.weight || 0;
    const newWeight = Math.max(0, currentWeight + delta);
    onUpdateProgress(setIndex, {
      [side]: { ...currentSet[side], weight: newWeight },
    });
  };

  const updateReps = (
    setIndex: number,
    side: "bilateral" | "leftSide" | "rightSide",
    reps: number
  ) => {
    const currentSet = progress.sets[setIndex] as any;
    if (!currentSet) return;
    onUpdateProgress(setIndex, {
      [side]: { ...currentSet[side], reps },
    });
  };

  const updateDuration = (setIndex: number, duration: number) => {
    const currentSet = progress.sets[setIndex] as any;
    if (!currentSet) return;
    onUpdateProgress(setIndex, {
      bilateral: { ...currentSet.bilateral, duration },
    });
  };

  const toggleSetComplete = (setIndex: number) => {
    const currentSet = progress.sets[setIndex] as any;
    if (!currentSet) return;
    const isComplete = !currentSet.completed;
    // Vérification métier : pour unilatéral, les deux côtés doivent être remplis
    if (exercise.isUnilateral && isComplete) {
      const leftDone = currentSet.leftSide?.reps > 0;
      const rightDone = currentSet.rightSide?.reps > 0;
      if (!leftDone || !rightDone) {
        alert("Complète les deux côtés avant de valider la série");
        return;
      }
    }
    onUpdateProgress(setIndex, { completed: isComplete });
  };

  const completedSets = progress.sets.filter((set) => set.completed).length;
  const totalSets = progress.sets.length;

  const getSupersetBadgeColor = () => {
    if (!exercise.supersetGroup) return "";
    const groupNumber = exercise.supersetGroup.match(/\d+/)?.[0];
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-orange-500",
    ];
    return colors[(parseInt(groupNumber || "1") - 1) % colors.length];
  };

  const formatRepsDisplay = (reps: string) => {
    if (reps.includes("e/s")) {
      return reps.replace("e/s", "chaque côté");
    }
    if (reps.includes("secondes")) {
      return reps;
    }
    return `${reps} reps`;
  };

  return (
    <div
      className={`border-2 rounded-lg p-4 transition-all ${
        completedSets === totalSets
          ? "border-green-200 bg-green-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {exercise.supersetGroup && (
            <span
              className={`px-2 py-1 ${getSupersetBadgeColor()} text-white text-xs rounded-full font-medium`}
            >
              {exercise.supersetGroup}
            </span>
          )}
          <div>
            <h4 className="font-semibold text-gray-900">
              {exercise.exercise.name}
              {exercise.exercise.isBodyweight && (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Poids du corps
                </span>
              )}
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>🎯 {formatRepsDisplay(exercise.reps || "1")}</span>
              {!exercise.exercise.isBodyweight && exercise.weight && (
                <span>⚖️ {exercise.weight}kg</span>
              )}
              {exercise.duration && <span>⏱️ {exercise.duration}s</span>}
              {isCircuit && <span>🔄 Circuit</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {completedSets}/{totalSets}
            </div>
            <div className="text-xs text-gray-500">séries</div>
          </div>
          {exercise.exercise.instructions && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Info className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>
      {supersetPartner && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            🔗 <strong>Superset avec:</strong> {supersetPartner.exercise.name} (
            {supersetPartner.reps} reps)
          </p>
        </div>
      )}
      {showDetails && exercise.exercise.instructions && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-900 mb-2">Instructions:</h5>
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
      <div className="space-y-3">
        {progress.sets.map((set, index) => (
          <div key={index} className="relative">
            <div
              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${
                set.completed
                  ? "border-green-300 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() =>
                setExpandedSet(expandedSet === index ? null : index)
              }
            >
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-900">
                  {isCircuit
                    ? `Tour ${set.setNumber}`
                    : `Série ${set.setNumber}`}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {exercise.isUnilateral ? (
                    <>
                      <span>G: {(set as any).leftSide?.reps || "-"}</span>
                      <span>D: {(set as any).rightSide?.reps || "-"}</span>
                    </>
                  ) : (
                    <>
                      {exercise.duration ? (
                        <span>{(set as any).bilateral?.duration || "-"}s</span>
                      ) : (
                        <span>{(set as any).bilateral?.reps || "-"} reps</span>
                      )}
                      {(set as any).bilateral?.weight && (
                        <span>{(set as any).bilateral.weight}kg</span>
                      )}
                    </>
                  )}
                  {(set as any).rpe && <span>RPE {(set as any).rpe}</span>}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSetComplete(index);
                  }}
                  className={`p-2 rounded-full transition-all ${
                    set.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
                {expandedSet === index ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
            {expandedSet === index && (
              <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                {exercise.isUnilateral ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Côté Gauche
                      </label>
                      <div className="space-y-2">
                        {!exercise.exercise.isBodyweight && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                updateWeight(index, "leftSide", -2.5)
                              }
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              value={(set as any).leftSide?.weight || ""}
                              onChange={(e) =>
                                onUpdateProgress(index, {
                                  leftSide: {
                                    ...(set as any).leftSide,
                                    weight: parseFloat(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="kg"
                              step="0.5"
                            />
                            <button
                              onClick={() =>
                                updateWeight(index, "leftSide", 2.5)
                              }
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <input
                          type="number"
                          value={(set as any).leftSide?.reps || ""}
                          onChange={(e) =>
                            updateReps(
                              index,
                              "leftSide",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          placeholder="Reps"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Côté Droit
                      </label>
                      <div className="space-y-2">
                        {!exercise.exercise.isBodyweight && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                updateWeight(index, "rightSide", -2.5)
                              }
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              value={(set as any).rightSide?.weight || ""}
                              onChange={(e) =>
                                onUpdateProgress(index, {
                                  rightSide: {
                                    ...(set as any).rightSide,
                                    weight: parseFloat(e.target.value) || 0,
                                  },
                                })
                              }
                              className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                              placeholder="kg"
                              step="0.5"
                            />
                            <button
                              onClick={() =>
                                updateWeight(index, "rightSide", 2.5)
                              }
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <input
                          type="number"
                          value={(set as any).rightSide?.reps || ""}
                          onChange={(e) =>
                            updateReps(
                              index,
                              "rightSide",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          placeholder="Reps"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {!exercise.exercise.isBodyweight && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Poids (kg)
                        </label>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateWeight(index, "bilateral", -2.5)
                            }
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            value={(set as any).bilateral?.weight || ""}
                            onChange={(e) =>
                              onUpdateProgress(index, {
                                bilateral: {
                                  ...(set as any).bilateral,
                                  weight: parseFloat(e.target.value) || 0,
                                },
                              })
                            }
                            className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                            step="0.5"
                          />
                          <button
                            onClick={() =>
                              updateWeight(index, "bilateral", 2.5)
                            }
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        value={(set as any).bilateral?.reps || ""}
                        onChange={(e) =>
                          onUpdateProgress(index, {
                            bilateral: {
                              ...(set as any).bilateral,
                              reps: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        placeholder="Reps"
                      />
                    </div>
                    {exercise.duration && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Durée (s)
                        </label>
                        <input
                          type="number"
                          value={(set as any).bilateral?.duration || ""}
                          onChange={(e) =>
                            updateDuration(index, parseInt(e.target.value) || 0)
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          placeholder="Secondes"
                        />
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    RPE (intensité)
                  </label>
                  <input
                    type="number"
                    value={(set as any).rpe || ""}
                    onChange={(e) =>
                      onUpdateProgress(index, {
                        rpe: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="RPE"
                    min={1}
                    max={10}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseRow;
