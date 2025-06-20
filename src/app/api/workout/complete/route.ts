import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const workoutProgress = await request.json();

    console.log("Completing workout for user:", session.user.id);

    // 1. Créer la session de workout
    const workoutSession = await prisma.workoutSession.create({
      data: {
        userId: session.user.id, // Utiliser l'ID de la session
        workoutId: workoutProgress.workoutId,
        startTime: new Date(workoutProgress.startTime),
        endTime: new Date(workoutProgress.endTime),
        completed: true,
        notes: workoutProgress.notes || "",
      },
    });

    const setResults = [];

    for (const exercise of workoutProgress.exercises || []) {
      for (const set of exercise.sets || []) {
        if (set.completed) {
          setResults.push({
            workoutSessionId: workoutSession.id,
            exerciseId: exercise.exerciseId,
            setNumber: set.setNumber,
            reps: set.reps || null,
            weight: set.weight || null,
            duration: set.duration || null,
            distance: set.distance || null,
            rpe: set.rpe || null,
            completed: set.completed,
          });
        }
      }
    }

    // Insertion en batch si il y a des résultats
    if (setResults.length > 0) {
      await prisma.setResult.createMany({
        data: setResults,
      });
    }

    console.log("Workout completed successfully:", workoutSession.id);
    console.log("Sets : ", setResults.length);

    return NextResponse.json({
      success: true,
      workoutSessionId: workoutSession.id,
      completedSets: setResults.length,
      message: "Séance terminée avec succès !",
    });
  } catch (error) {
    console.error("Error completing workout:", error);

    // Gestion spécifique de l'erreur de timeout
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2024"
    ) {
      return NextResponse.json(
        { error: "Timeout de base de données. Veuillez réessayer." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Erreur lors de la sauvegarde",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    // Ne pas déconnecter Prisma ici pour permettre la réutilisation des connexions
    // await prisma.$disconnect();
  }
}
