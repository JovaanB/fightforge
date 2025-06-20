import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface WorkoutSession {
  id: string;
  endTime: Date | null;
  startTime: Date | null;
  workout: {
    week: number;
    name: string;
    session: number;
  };
}

interface Exercise {
  exercise: {
    name: string;
  };
  sets: number;
  reps: string;
  rest: number;
}

interface Section {
  name: string;
  exercises: Exercise[];
}

interface Workout {
  id: string;
  name: string;
  week: number;
  session: number;
  duration: number;
  sections: Section[];
}

interface Phase {
  name: string;
  description: string;
  workouts: Workout[];
}

interface Program {
  name: string;
  description: string;
  phases: Phase[];
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Récupérer les séances terminées par l'utilisateur
    const completedWorkouts = await prisma.workoutSession.findMany({
      where: {
        userId,
        completed: true,
      },
      include: {
        workout: {
          include: {
            phase: {
              include: {
                program: true,
              },
            },
            sections: {
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
      orderBy: {
        endTime: "desc",
      },
    });

    // 2. Calculer la progression actuelle
    const totalWorkouts = completedWorkouts.length;
    const lastCompletedWorkout = completedWorkouts[0];

    let currentWeek = 1;
    let currentSession = 1;

    if (lastCompletedWorkout) {
      const lastWeek = lastCompletedWorkout.workout.week;
      const lastSession = lastCompletedWorkout.workout.session;

      // Logique de progression séquentielle
      if (lastSession === 1) {
        // Si dernière séance était session 1, prochaine = session 2 même semaine
        currentWeek = lastWeek;
        currentSession = 2;
      } else {
        // Si dernière séance était session 2, prochaine = session 1 semaine suivante
        currentWeek = lastWeek + 1;
        currentSession = 1;
      }
    }

    // 3. Trouver le prochain workout
    console.log("Recherche du prochain workout:", {
      currentWeek,
      currentSession,
      totalWorkouts,
      lastCompletedWorkout: lastCompletedWorkout
        ? {
            week: lastCompletedWorkout.workout.week,
            session: lastCompletedWorkout.workout.session,
          }
        : null,
    });

    // Rechercher le workout correspondant à la semaine et session calculées
    const nextWorkout = await prisma.workout.findFirst({
      where: {
        week: currentWeek,
        session: currentSession,
        phase: {
          program: {
            name: "Train Like A Champion - FORCE",
          },
        },
      },
      include: {
        sections: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });

    console.log(
      "Résultat de la recherche:",
      nextWorkout
        ? {
            week: nextWorkout.week,
            session: nextWorkout.session,
            name: nextWorkout.name,
          }
        : "Non trouvé"
    );

    const nextWorkoutId = nextWorkout?.id || null;

    // 5. Calculer les jours jusqu'au combat (si défini)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        fightDate: true,
        name: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        stripeSubscriptionId: true,
      },
    });

    const daysUntilFight = user?.fightDate
      ? Math.ceil(
          (user.fightDate.getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    // 6. Récupérer les détails du programme
    const program = await prisma.program.findFirst({
      where: {
        name: "Train Like A Champion - FORCE",
      },
      include: {
        phases: {
          include: {
            workouts: {
              include: {
                sections: {
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
        },
      },
    });

    // 4. Calculer les stats
    const thisWeekWorkouts = completedWorkouts.filter(
      (w: WorkoutSession) => w.workout.week === currentWeek
    ).length;
    const totalPossibleWorkouts =
      program?.phases.reduce((total: number, phase: Phase) => {
        return total + phase.workouts.length;
      }, 0) || 0;
    const progressPercentage = Math.round(
      (totalWorkouts / totalPossibleWorkouts) * 100
    );

    // Calculer le nombre total de semaines
    const totalWeeks =
      program?.phases.reduce((max: number, phase: Phase) => {
        const phaseMaxWeek = Math.max(
          ...phase.workouts.map((w: Workout) => w.week)
        );
        return Math.max(max, phaseMaxWeek);
      }, 0) || 9;

    return NextResponse.json({
      user: {
        name: user?.name || session.user.name,
        daysUntilFight,
        subscription: {
          status: user?.subscriptionStatus || "free",
          plan: user?.subscriptionPlan || "free",
          isActive: user?.subscriptionStatus === "active",
        },
      },
      progression: {
        currentWeek,
        currentSession,
        totalWorkouts,
        totalPossibleWorkouts,
        progressPercentage,
        thisWeekWorkouts,
        totalWeeks,
      },
      nextWorkout: nextWorkoutId
        ? {
            id: nextWorkoutId,
            name: `Semaine ${currentWeek} - Session ${currentSession}`,
            type: "Force",
            duration: "60 min",
            week: currentWeek,
            session: currentSession,
          }
        : null,
      recentWorkouts: completedWorkouts
        .slice(0, 3)
        .map((w: WorkoutSession) => ({
          id: w.id,
          name: `Semaine ${w.workout.week} - Session ${w.workout.session}`,
          completedAt: w.endTime,
          duration:
            w.endTime && w.startTime
              ? Math.round(
                  (w.endTime.getTime() - w.startTime.getTime()) / 60000
                )
              : null,
        })),
      program: program
        ? {
            name: program.name,
            description: program.description,
            totalWeeks,
            phases: program.phases.map((phase: Phase) => ({
              name: phase.name,
              description: phase.description,
              startWeek: Math.min(
                ...phase.workouts.map((w: Workout) => w.week)
              ),
              endWeek: Math.max(...phase.workouts.map((w: Workout) => w.week)),
              workouts: phase.workouts.map((workout: Workout) => ({
                id: workout.id,
                name: workout.name,
                week: workout.week,
                session: workout.session,
                duration: workout.duration,
                sections: workout.sections.map((section: Section) => ({
                  name: section.name,
                  exercises: section.exercises.map((exercise: Exercise) => ({
                    name: exercise.exercise.name,
                    sets: exercise.sets,
                    reps: exercise.reps,
                    rest: exercise.rest,
                  })),
                })),
              })),
            })),
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la progression" },
      { status: 500 }
    );
  }
}
