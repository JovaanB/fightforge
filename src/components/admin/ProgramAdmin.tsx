"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ProgramAdmin: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sections, setSections] = useState([
    {
      name: "",
      isCircuit: false,
      circuitSets: 1,
      exercises: [{ name: "", sets: 1, duration: "", weight: "" }],
    },
  ]);

  const handleSectionChange = (idx: number, field: string, value: any) => {
    setSections((sections) =>
      sections.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
    );
  };

  const handleExerciseChange = (
    sectionIdx: number,
    exIdx: number,
    field: string,
    value: any
  ) => {
    setSections((sections) =>
      sections.map((s, i) =>
        i === sectionIdx
          ? {
              ...s,
              exercises: s.exercises.map((ex, j) =>
                j === exIdx ? { ...ex, [field]: value } : ex
              ),
            }
          : s
      )
    );
  };

  const addSection = () => {
    setSections((sections) => [
      ...sections,
      {
        name: "",
        isCircuit: false,
        circuitSets: 1,
        exercises: [{ name: "", sets: 1, duration: "", weight: "" }],
      },
    ]);
  };

  const removeSection = (idx: number) => {
    setSections((sections) => sections.filter((_, i) => i !== idx));
  };

  const addExercise = (sectionIdx: number) => {
    setSections((sections) =>
      sections.map((s, i) =>
        i === sectionIdx
          ? {
              ...s,
              exercises: [
                ...s.exercises,
                { name: "", sets: 1, duration: "", weight: "" },
              ],
            }
          : s
      )
    );
  };

  const removeExercise = (sectionIdx: number, exIdx: number) => {
    setSections((sections) =>
      sections.map((s, i) =>
        i === sectionIdx
          ? { ...s, exercises: s.exercises.filter((_, j) => j !== exIdx) }
          : s
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, sections }),
      });
      if (!res.ok) throw new Error("Erreur lors de la création du programme");
      router.push("/admin/programs");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h2 className="text-2xl font-bold mb-6">Ajouter un Programme</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sections</label>
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="border rounded-xl p-6 mb-6 bg-gradient-to-br from-orange-50 to-white shadow"
            >
              <div className="flex gap-2 mb-4 items-center">
                <input
                  type="text"
                  placeholder="Nom de la section"
                  value={section.name}
                  onChange={(e) =>
                    handleSectionChange(idx, "name", e.target.value)
                  }
                  className="border rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-orange-400"
                  required
                />
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={section.isCircuit}
                    onChange={(e) =>
                      handleSectionChange(idx, "isCircuit", e.target.checked)
                    }
                    className="accent-orange-500"
                  />
                  <span className="font-semibold text-orange-600">Circuit</span>
                </label>
                {section.isCircuit && (
                  <input
                    type="number"
                    min={1}
                    value={section.circuitSets}
                    onChange={(e) =>
                      handleSectionChange(
                        idx,
                        "circuitSets",
                        Number(e.target.value)
                      )
                    }
                    className="border rounded-lg px-3 py-2 w-20 focus:ring-2 focus:ring-orange-400"
                    placeholder="Tours"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeSection(idx)}
                  className="text-red-500 ml-2 hover:underline"
                >
                  Supprimer
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2">
                  Exercices
                </label>
                {section.exercises.map((ex, exIdx) => (
                  <div
                    key={exIdx}
                    className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 items-center bg-white rounded-lg p-2 shadow-sm"
                  >
                    <input
                      type="text"
                      placeholder="Nom de l'exercice"
                      value={ex.name}
                      onChange={(e) =>
                        handleExerciseChange(idx, exIdx, "name", e.target.value)
                      }
                      className="border rounded-lg px-2 py-1 focus:ring-2 focus:ring-orange-400"
                      required
                    />
                    <input
                      type="number"
                      min={1}
                      value={ex.sets}
                      onChange={(e) =>
                        handleExerciseChange(
                          idx,
                          exIdx,
                          "sets",
                          Number(e.target.value)
                        )
                      }
                      className="border rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-orange-400"
                      placeholder="Sets"
                      required
                    />
                    <input
                      type="text"
                      value={ex.duration}
                      onChange={(e) =>
                        handleExerciseChange(
                          idx,
                          exIdx,
                          "duration",
                          e.target.value
                        )
                      }
                      className="border rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-orange-400"
                      placeholder="Durée (ex: 30s ou 10 reps)"
                    />
                    <input
                      type="text"
                      value={ex.weight}
                      onChange={(e) =>
                        handleExerciseChange(
                          idx,
                          exIdx,
                          "weight",
                          e.target.value
                        )
                      }
                      className="border rounded-lg px-2 py-1 w-full focus:ring-2 focus:ring-orange-400"
                      placeholder="Poids (kg)"
                    />
                    <button
                      type="button"
                      onClick={() => removeExercise(idx, exIdx)}
                      className="text-red-500 text-xs ml-2 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addExercise(idx)}
                  className="text-xs text-blue-500 mt-2 hover:underline"
                >
                  + Ajouter un exercice
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addSection}
            className="text-xs text-blue-500 mt-2 hover:underline"
          >
            + Ajouter une section
          </button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded font-semibold w-full"
        >
          {isLoading ? "Ajout..." : "Ajouter le programme"}
        </button>
      </form>
    </div>
  );
};

export default ProgramAdmin;
