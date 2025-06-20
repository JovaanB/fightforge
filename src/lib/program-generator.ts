import { prisma } from "@/lib/prisma";
import { calculateWeeksUntil } from "@/lib/utils";
import { User } from "@prisma/client/wasm";

export async function generateProgramForUser(user: User) {
  console.log("Generating program for user:", user.id);

  // 1. Analyser le profil utilisateur
  const programAnalysis = analyzeUserProfile(user);
  console.log("Program analysis:", programAnalysis);

  // 2. Sélectionner le programme de base approprié
  const baseProgram = await selectBaseProgram(programAnalysis);
  console.log("Selected base program:", baseProgram?.name);

  if (!baseProgram) {
    throw new Error("Aucun programme de base trouvé");
  }

  // 3. Créer une copie personnalisée du programme
  const personalizedProgram = await createPersonalizedProgram(
    baseProgram,
    user,
    programAnalysis
  );
  console.log("Created personalized program:", personalizedProgram.id);

  return personalizedProgram;
}

function analyzeUserProfile(user: any) {
  // Calculer les semaines jusqu'au combat
  const weeksUntilFight = user.fightDate
    ? calculateWeeksUntil(user.fightDate)
    : 12;

  // Déterminer le focus principal basé sur les objectifs
  const primaryFocus = determinePrimaryFocus(user.goals || []);

  // Évaluer le niveau d'intensité recommandé
  const intensityLevel = determineIntensityLevel(
    user.experience,
    user.currentCondition
  );

  // Adapter selon l'équipement disponible
  const availableEquipment = user.equipment || [];

  return {
    weeksUntilFight,
    primaryFocus,
    intensityLevel,
    availableEquipment,
    sessionsPerWeek: user.sessionsPerWeek || 4,
    sessionDuration: user.sessionDuration || 60,
    hasOneRM: !!(user.benchPress && user.squat && user.deadlift),
  };
}

function determinePrimaryFocus(goals: string[]) {
  const focusMapping: Record<string, string> = {
    EXPLOSIVE_POWER: "power",
    MAX_STRENGTH: "strength",
    CARDIO_ENDURANCE: "cardio",
    PUNCH_SPEED: "speed",
    AGILITY_MOBILITY: "agility",
    MUSCULAR_ENDURANCE: "endurance",
  };

  if (goals.length === 0) return "balanced";
  return goals.length === 1 ? focusMapping[goals[0]] || "balanced" : "balanced";
}

function determineIntensityLevel(
  experience: string | null,
  condition: string | null
) {
  if (experience === "BEGINNER" || condition === "POOR") return "beginner";
  if (experience === "ELITE" && condition === "EXCELLENT") return "elite";
  if (experience === "ADVANCED" || condition === "EXCELLENT") return "advanced";
  return "intermediate";
}

async function selectBaseProgram(analysis: any) {
  // Pour le MVP, on utilise toujours le programme Force
  const program = await prisma.program.findFirst({
    where: {
      name: "Train Like A Champion - FORCE",
    },
    include: {
      phases: {
        include: {
          workouts: {
            include: {
              exercises: {
                include: {
                  exercise: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return program;
}

async function createPersonalizedProgram(
  baseProgram: any,
  user: any,
  analysis: any
) {
  console.log("Creating personalized program...");

  // 1. Créer le nouveau programme personnalisé
  const personalizedProgram = await prisma.program.create({
    data: {
      name: `${baseProgram.name} - ${user.name}`,
      description: `Programme personnalisé pour ${user.name} - ${analysis.primaryFocus} focus`,
      duration: Math.min(analysis.weeksUntilFight, 9),
      difficulty: mapIntensityToDifficulty(analysis.intensityLevel),
    },
  });

  // 2. Copier et adapter les phases
  for (const phase of baseProgram.phases) {
    const adaptedPhase = await prisma.phase.create({
      data: {
        programId: personalizedProgram.id,
        name: phase.name,
        description: phase.description,
        weekStart: phase.weekStart,
        weekEnd: Math.min(phase.weekEnd, analysis.weeksUntilFight),
        focus: phase.focus,
      },
    });

    // 3. Copier et adapter les workouts
    for (const workout of phase.workouts) {
      if (workout.week > analysis.weeksUntilFight) continue;
      if (workout.session > analysis.sessionsPerWeek) continue;

      const adaptedWorkout = await prisma.workout.create({
        data: {
          phaseId: adaptedPhase.id,
          name: workout.name,
          description: workout.description,
          week: workout.week,
          session: workout.session,
          type: workout.type,
        },
      });

      // 4. Copier et adapter les exercices
      for (const workoutExercise of workout.exercises) {
        // Vérifier que l'équipement est disponible
        const exerciseEquipment = workoutExercise.exercise.equipment || [];
        const hasRequiredEquipment =
          exerciseEquipment.length === 0 ||
          exerciseEquipment.some((eq: string) =>
            analysis.availableEquipment.includes(eq)
          );

        if (!hasRequiredEquipment) {
          // Trouver un exercice de substitution
          const substituteExercise = await findSubstituteExercise(
            workoutExercise.exercise,
            analysis.availableEquipment
          );
          if (!substituteExercise) continue;
        }

        // Adapter les charges si on a les 1RM
        const adaptedWeight = adaptWeight(
          workoutExercise.weight,
          workoutExercise.exercise,
          user,
          workout.week
        );

        await prisma.workoutExercise.create({
          data: {
            workoutId: adaptedWorkout.id,
            exerciseId: workoutExercise.exerciseId,
            order: workoutExercise.order,
            sets: workoutExercise.sets,
            reps: adaptReps(workoutExercise.reps, analysis.intensityLevel),
            weight: adaptedWeight,
            rest: adaptRest(workoutExercise.rest, analysis.intensityLevel),
            tempo: workoutExercise.tempo,
            rpe: workoutExercise.rpe,
            notes: generateAdaptedNotes(workoutExercise, analysis),
            supersetGroup: workoutExercise.supersetGroup,
          },
        });
      }
    }
  }

  console.log("Personalized program created successfully");
  return personalizedProgram;
}

function mapIntensityToDifficulty(intensity: string) {
  const mapping: Record<string, any> = {
    beginner: "BEGINNER",
    intermediate: "INTERMEDIATE",
    advanced: "ADVANCED",
    elite: "ELITE",
  };
  return mapping[intensity] || "INTERMEDIATE";
}

async function findSubstituteExercise(
  originalExercise: any,
  availableEquipment: string[]
) {
  // Trouver un exercice similaire avec l'équipement disponible
  const substitute = await prisma.exercise.findFirst({
    where: {
      category: originalExercise.category,
      equipment: {
        hasSome: availableEquipment,
      },
    },
  });
  return substitute;
}

function adaptWeight(
  originalWeight: number | null,
  exercise: any,
  user: any,
  week: number
) {
  if (!originalWeight || !user.benchPress) return originalWeight;
  // Logique d'adaptation des poids basée sur les 1RM
  // Progression plus conservative pour débutants
  const progressionFactor = getProgressionFactor(user.experience, week);
  return originalWeight ? Math.round(originalWeight * progressionFactor) : null;
}

function adaptReps(originalReps: string | null, intensityLevel: string) {
  if (!originalReps) return originalReps;
  if (intensityLevel === "beginner" && originalReps.includes("-")) {
    const [min, max] = originalReps.split("-").map((n) => parseInt(n.trim()));
    return `${min + 1}-${max + 2}`;
  }
  return originalReps;
}

function adaptRest(originalRest: number | null, intensityLevel: string) {
  if (!originalRest) return originalRest;
  if (intensityLevel === "beginner") {
    return Math.round(originalRest * 1.2);
  }
  return originalRest;
}

function generateAdaptedNotes(workoutExercise: any, analysis: any) {
  let notes = workoutExercise.notes || "";
  if (analysis.intensityLevel === "beginner") {
    notes += " | Focus technique avant intensité";
  }
  if (!analysis.hasOneRM) {
    notes += " | Charges estimées - ajuster selon sensation";
  }
  return notes.trim();
}

function getProgressionFactor(experience: string | null, week: number) {
  const baseFactors: Record<string, number> = {
    BEGINNER: 0.8,
    NOVICE: 0.9,
    INTERMEDIATE: 1.0,
    ADVANCED: 1.1,
    ELITE: 1.2,
  };
  const baseFactor = baseFactors[experience || "INTERMEDIATE"] || 1.0;
  const weeklyProgression = 1 + (week - 1) * 0.02;

  return baseFactor * weeklyProgression;
}
