import { ExerciseTemplate } from "@/types";

// Mapping des exercices de tes programmes vers notre structure
export const EXERCISE_MAPPING: Record<string, ExerciseTemplate> = {
  // Force - Bilateral Lifts
  "KB Sumo Deadlift": {
    name: "KB Sumo Deadlift",
    category: "HINGE_PATTERN",
    muscleGroups: ["GLUTES", "HAMSTRINGS", "CORE"],
    equipment: ["KETTLEBELLS"],
    defaultSets: 3,
    defaultReps: "8-10",
    oneRMPercentage: 70,
    description: "Soulevé de terre sumo avec kettlebell",
    instructions: [
      "Pieds écartés, kettlebell au centre",
      "Hanches vers l'arrière, dos droit",
      "Poussée explosive des hanches vers l'avant",
    ],
  },
  "Goblet Squat": {
    name: "Goblet Squat",
    category: "SQUAT_PATTERN",
    muscleGroups: ["QUADRICEPS", "GLUTES", "CORE"],
    equipment: ["KETTLEBELLS", "DUMBBELLS"],
    defaultSets: 3,
    defaultReps: "8-10",
    oneRMPercentage: 75,
    description: "Squat avec poids tenu devant la poitrine",
  },

  // Force - Press movements
  "Strict Press Ups": {
    name: "Strict Press Ups",
    category: "HORIZONTAL_PRESS",
    muscleGroups: ["CHEST", "TRICEPS", "SHOULDERS"],
    equipment: [],
    defaultSets: 3,
    defaultReps: "8-12",
    description: "Pompes strictes, tempo contrôlé",
  },
  "1/2 Kneeling DB Shoulder Press": {
    name: "Half Kneeling DB Shoulder Press",
    category: "VERTICAL_PRESS",
    muscleGroups: ["SHOULDERS", "CORE", "TRICEPS"],
    equipment: ["DUMBBELLS"],
    defaultSets: 3,
    defaultReps: "8-10",
    oneRMPercentage: 70,
  },

  // Plyométrie
  "Altitude Landings": {
    name: "Altitude Landings",
    category: "PLYOMETRIC",
    muscleGroups: ["QUADRICEPS", "GLUTES", "CALVES"],
    equipment: ["JUMP_BOX"],
    defaultSets: 3,
    defaultReps: "5",
    description: "Réception d'altitude pour développer l'absorption d'impact",
  },
  "Ice Skaters": {
    name: "Ice Skaters",
    category: "PLYOMETRIC",
    muscleGroups: ["GLUTES", "QUADRICEPS", "CORE"],
    equipment: [],
    defaultSets: 3,
    defaultReps: "5 e/s",
    description: "Saut latéral alternant, imitation du patineur",
  },
  "Box Jump": {
    name: "Box Jump",
    category: "PLYOMETRIC",
    muscleGroups: ["QUADRICEPS", "GLUTES", "CALVES"],
    equipment: ["JUMP_BOX"],
    defaultSets: 3,
    defaultReps: "5",
    description: "Saut vertical explosif sur box",
  },
  "Drop CMJ": {
    name: "Drop Counter Movement Jump",
    category: "PLYOMETRIC",
    muscleGroups: ["QUADRICEPS", "GLUTES", "CALVES"],
    equipment: ["JUMP_BOX"],
    defaultSets: 3,
    defaultReps: "5",
    description: "Chute depuis box suivie d'un saut vertical maximal",
  },

  // Core/Stability
  "Plank Shoulder Taps": {
    name: "Plank Shoulder Taps",
    category: "CORE",
    muscleGroups: ["CORE", "SHOULDERS"],
    equipment: [],
    defaultSets: 3,
    defaultReps: "6 e/s",
    description: "Planche avec alternance de touches d'épaules",
  },
  "1/2 Deadbug": {
    name: "Half Deadbug",
    category: "CORE",
    muscleGroups: ["CORE"],
    equipment: [],
    defaultSets: 3,
    defaultReps: "5 e/s",
    description: "Deadbug modifié pour stabilisation du core",
  },
};

// Structure des phases de tes programmes
export const PROGRAM_PHASES = {
  force: [
    {
      name: "Phase 1 - Volume et Technique",
      weekStart: 1,
      weekEnd: 3,
      focus: "HIGH_VOLUME_STRENGTH",
      description: "Construction de la base avec volume élevé et technique",
    },
    {
      name: "Phase 2 - Force et Puissance",
      weekStart: 4,
      weekEnd: 7,
      focus: "STRENGTH_POWER",
      description: "Développement de la force maximale et puissance",
    },
    {
      name: "Phase 3 - Pic et Affûtage",
      weekStart: 8,
      weekEnd: 9,
      focus: "PEAK_PERFORMANCE",
      description: "Affûtage final et pic de performance",
    },
  ],
  cardio: [
    {
      name: "Phase 1 - Endurance Musculaire",
      weekStart: 1,
      weekEnd: 3,
      focus: "MUSCULAR_ENDURANCE",
      description: "Développement de l'endurance musculaire de base",
    },
    {
      name: "Phase 2 - Puissance Aérobie",
      weekStart: 4,
      weekEnd: 7,
      focus: "AEROBIC_POWER",
      description: "Amélioration de la puissance aérobie et seuil",
    },
    {
      name: "Phase 3 - Capacité Anaérobie",
      weekStart: 8,
      weekEnd: 9,
      focus: "ANAEROBIC_CAPACITY",
      description: "Développement de la capacité anaérobie spécifique",
    },
  ],
};

// Progression des intensités par semaine
export const INTENSITY_PROGRESSION = {
  strength: {
    week1: { percentage: 70, reps: "8-10" },
    week2: { percentage: 75, reps: "6-8" },
    week3: { percentage: 80, reps: "5-6" },
    week4: { percentage: 85, reps: "3-5" },
    week5: { percentage: 87, reps: "3-4" },
    week6: { percentage: 90, reps: "2-3" },
    week7: { percentage: 85, reps: "4-5" },
    week8: { percentage: 95, reps: "1-2" },
    week9: { percentage: 75, reps: "6-8" }, // Deload/taper
  },
  cardio: {
    week1: { intensity: "LOW", rpe: "6-7" },
    week2: { intensity: "MODERATE", rpe: "7-8" },
    week3: { intensity: "MODERATE_HIGH", rpe: "8" },
    week4: { intensity: "HIGH", rpe: "8-9" },
    week5: { intensity: "HIGH", rpe: "9" },
    week6: { intensity: "VERY_HIGH", rpe: "9-10" },
    week7: { intensity: "HIGH", rpe: "8-9" },
    week8: { intensity: "VERY_HIGH", rpe: "9-10" },
    week9: { intensity: "MODERATE", rpe: "7-8" }, // Taper
  },
};

// Fonction pour convertir les données Excel en structure de programme
export function convertExcelToProgram(
  excelData: any[],
  programType: "force" | "cardio"
) {
  const phases = PROGRAM_PHASES[programType];

  return {
    name: `Train Like A Champion - ${programType.toUpperCase()}`,
    description: `Programme ${programType} périodisé sur 9 semaines`,
    duration: 9,
    difficulty: "INTERMEDIATE",
    phases: phases.map((phase) => ({
      ...phase,
      workouts: generateWorkoutsForPhase(phase, programType),
    })),
  };
}

function generateWorkoutsForPhase(phase: any, programType: "force" | "cardio") {
  const workouts = [];

  for (let week = phase.weekStart; week <= phase.weekEnd; week++) {
    // Générer 2-3 séances par semaine selon le type
    const sessionsPerWeek = programType === "force" ? 2 : 3;

    for (let session = 1; session <= sessionsPerWeek; session++) {
      workouts.push({
        name: `${phase.name} - Semaine ${week} - Session ${session}`,
        week,
        session,
        type: programType === "force" ? "STRENGTH" : "CARDIO",
        exercises: generateExercisesForWorkout(
          week,
          session,
          programType,
          phase.focus
        ),
      });
    }
  }

  return workouts;
}

function generateExercisesForWorkout(
  week: number,
  session: number,
  programType: "force" | "cardio",
  focus: string
) {
  const exercises = [];

  if (programType === "force") {
    // Structure basée sur tes programmes Excel
    const intensity =
      INTENSITY_PROGRESSION.strength[
        `week${week}` as keyof typeof INTENSITY_PROGRESSION.strength
      ];

    if (session === 1) {
      // Session 1 - Focus membres inférieurs + core
      exercises.push(
        ...createSuperset("1A", [
          { exerciseName: "KB Sumo Deadlift", ...intensity, order: 1 },
          { exerciseName: "Goblet Squat", ...intensity, order: 2 },
        ]),
        ...createSuperset("1B", [
          {
            exerciseName: "Plank Shoulder Taps",
            reps: "6 e/s",
            sets: 3,
            order: 3,
          },
          { exerciseName: "1/2 Deadbug", reps: "5 e/s", sets: 3, order: 4 },
        ])
      );
    } else {
      // Session 2 - Focus membres supérieurs + puissance
      exercises.push(
        ...createSuperset("2A", [
          { exerciseName: "Strict Press Ups", ...intensity, order: 1 },
          {
            exerciseName: "1/2 Kneeling DB Shoulder Press",
            ...intensity,
            order: 2,
          },
        ]),
        // Pliométrie selon la semaine
        ...createPlyometricBlock(week, 3)
      );
    }
  } else {
    // Programme cardio basé sur tes données
    const cardioIntensity =
      INTENSITY_PROGRESSION.cardio[
        `week${week}` as keyof typeof INTENSITY_PROGRESSION.cardio
      ];

    exercises.push({
      exerciseName: getCardioExerciseForWeek(week, session),
      sets: 1,
      reps: getCardioProtocol(week, session),
      rpe: cardioIntensity.rpe,
      notes: `Intensité: ${cardioIntensity.intensity}`,
      order: 1,
    });
  }

  return exercises;
}

function createSuperset(groupName: string, exercises: any[]) {
  return exercises.map((ex) => ({
    ...ex,
    supersetGroup: groupName,
    sets: ex.sets || 3,
    rest: 60, // secondes entre supersets
  }));
}

function createPlyometricBlock(week: number, startOrder: number) {
  const plyoExercises = ["Box Jump", "Ice Skaters", "Altitude Landings"];

  if (week <= 3) {
    // Phase 1: Volume plus élevé, intensité modérée
    return plyoExercises.map((name, index) => ({
      exerciseName: name,
      sets: 3,
      reps: "5",
      rest: 90,
      order: startOrder + index,
      notes: "Focus sur la technique et la réception",
    }));
  } else if (week <= 7) {
    // Phase 2: Intensité plus élevée
    return [
      {
        exerciseName: "Drop CMJ",
        sets: 4,
        reps: "3",
        rest: 120,
        order: startOrder,
        notes: "Maximum d'explosivité",
      },
      {
        exerciseName: "Box Jump",
        sets: 3,
        reps: "5",
        rest: 90,
        order: startOrder + 1,
      },
    ];
  } else {
    // Phase 3: Spécifique combat
    return [
      {
        exerciseName: "Drop CMJ",
        sets: 3,
        reps: "2",
        rest: 180,
        order: startOrder,
        notes: "Qualité maximale, récupération complète",
      },
    ];
  }
}

function getCardioExerciseForWeek(week: number, session: number): string {
  // Basé sur ta structure cardio Excel
  if (week <= 3) {
    return session === 3 ? "Sprint Intervals" : "Tempo Run";
  } else if (week <= 7) {
    return session === 1
      ? "Tempo Run"
      : session === 2
      ? "Threshold Intervals"
      : "Sprint Intervals";
  } else {
    return "Boxing-Specific Cardio";
  }
}

function getCardioProtocol(week: number, session: number): string {
  // Protocoles extraits de tes données Excel
  const protocols = {
    1: {
      session1: "2 min ON, 3 min OFF x 5",
      session2: "2 min ON, 3 min OFF x 5",
      session3: "1 min ON, 2 min OFF x 4",
    },
    2: {
      session1: "2 min ON, 3 min OFF x 6",
      session2: "2 min ON, 3 min OFF x 6",
      session3: "1 min ON, 2 min OFF x 8",
    },
    3: {
      session1: "6 min ON, 2 min OFF x 4",
      session2: "7 min ON, 2 min OFF x 4",
      session3: "8 min ON, 2 min OFF x 4",
    },
    // ... continuer selon tes données
  };

  return (
    protocols[week as keyof typeof protocols]?.[
      `session${session}` as keyof (typeof protocols)[1]
    ] || "2 min ON, 3 min OFF x 5"
  );
}

// Fonction principale pour créer le seed data
export async function seedProgramsFromExcel() {
  const forceProgram = convertExcelToProgram([], "force");
  const cardioProgram = convertExcelToProgram([], "cardio");

  return {
    forceProgram,
    cardioProgram,
    exercises: Object.values(EXERCISE_MAPPING),
  };
}
