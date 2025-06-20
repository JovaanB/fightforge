import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Création d'un programme avec sections et exercices
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, sections } = body;

    // Création du programme
    const program = await prisma.program.create({
      data: {
        name,
        description,
        duration: 4, // valeur par défaut
        difficulty: "BEGINNER", // valeur par défaut
      },
    });

    // Pour chaque section, créer un Workout et ses sections
    for (const [sectionIdx, section] of sections.entries()) {
      // Création d'un Workout pour chaque section (simplifié)
      const workout = await prisma.workout.create({
        data: {
          phaseId: "", // à relier à une phase si besoin
          name: section.name,
          description: section.isCircuit ? "Circuit" : "Section",
          week: 1,
          session: sectionIdx + 1,
          type: section.isCircuit ? "CIRCUIT" : "STRENGTH",
        },
      });

      // Création de la section
      const workoutSection = await prisma.workoutSection.create({
        data: {
          workoutId: workout.id,
          name: section.name,
          type: section.isCircuit ? "CIRCUIT" : "STRENGTH",
          order: 1,
          isCircuit: section.isCircuit,
          circuitSets: section.circuitSets,
        },
      });

      // Création des exercices
      for (const [exIdx, ex] of section.exercises.entries()) {
        // Vérifier si l'exercice existe déjà
        let exercise = await prisma.exercise.findFirst({
          where: { name: ex.name },
        });
        if (!exercise) {
          exercise = await prisma.exercise.create({
            data: {
              name: ex.name,
              category: "STRENGTH", // valeur par défaut
              muscleGroups: [],
              equipment: [],
            },
          });
        }
        await prisma.sectionExercise.create({
          data: {
            sectionId: workoutSection.id,
            exerciseId: exercise.id,
            order: exIdx + 1,
            sets: ex.sets,
            reps: ex.duration,
            weight: ex.weight ? Number(ex.weight) : undefined,
          },
        });
      }
    }

    return NextResponse.json({ success: true, programId: program.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création du programme" },
      { status: 500 }
    );
  }
}
