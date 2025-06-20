"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  Dumbbell,
  TrendingUp,
  Play,
  CheckCircle,
  Crown,
} from "lucide-react";
import { PRICING_PLANS } from "@/lib/stripe";

interface Phase {
  name: string;
  description: string;
  startWeek: number;
  endWeek: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const completed = searchParams.get("completed");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    fetchUserProgress();
  }, [session, status, router]);

  const fetchUserProgress = async () => {
    try {
      const response = await fetch("/api/user/progress");
      if (response.ok) {
        const data = await response.json();
        setProgressData(data);
      } else {
        console.error("Failed to fetch progress");
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Chargement de ton programme...</p>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Erreur lors du chargement</p>
          <button
            onClick={fetchUserProgress}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const { user, progression, nextWorkout, recentWorkouts } = progressData;
  const programCompleted =
    progression.totalWorkouts >= progression.totalPossibleWorkouts;

  console.log({
    programCompleted,
    totalWorkouts: progression.totalWorkouts,
    totalPossibleWorkouts: progression.totalPossibleWorkouts,
    nextWorkout,
  });

  console.log({ progression });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8 text-red-500" />
                <h1 className="text-2xl font-bold text-gray-900">FightForge</h1>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Salut {user.name} !</span>
              <Link
                href="/pricing"
                className={`px-4 py-2 rounded-lg font-medium ${
                  user.subscription.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {user.subscription.isActive
                  ? `Plan ${user.subscription.plan}`
                  : "Mettre à niveau"}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Success Message */}
        {completed && (
          <div className="mb-8 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">
                🎉 Excellent travail ! Ta séance a été enregistrée avec succès.
              </span>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Salut {user.name} ! 👋
          </h2>
          {programCompleted ? (
            <p className="text-gray-600">
              🏆 Félicitations ! Tu as terminé ton programme de{" "}
              {progression.totalWeeks}{" "}
              {progression.totalWeeks > 1 ? "semaines" : "semaine"}. Prêt pour
              un nouveau défi ?
            </p>
          ) : (
            <p className="text-gray-600">
              Voici ton programme personnalisé FightForge. Prêt à forger ton
              potentiel ?
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Subscription Status Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Crown className="w-8 h-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Abonnement</p>
                <p className="text-lg font-bold text-gray-900">
                  {user.subscription.isActive
                    ? PRICING_PLANS[
                        user.subscription.plan as keyof typeof PRICING_PLANS
                      ]?.name || "Champion"
                    : "Découverte"}
                </p>
                {!user.subscription.isActive && (
                  <Link
                    href="/pricing"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mettre à niveau →
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">
                  {user.daysUntilFight
                    ? "Jours jusqu'au combat"
                    : "Semaine actuelle"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.daysUntilFight || progression.currentWeek}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">
                  Phase actuelle
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {progression.currentWeek <= 3
                    ? "Phase 1 - Volume et Technique"
                    : progression.currentWeek <= 7
                    ? "Phase 2 - Force et Puissance"
                    : progression.currentWeek <= 9
                    ? "Phase 3 - Pic et Affûtage"
                    : "Programme terminé"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Dumbbell className="w-8 h-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">
                  Séances complétées
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {progression.totalWorkouts}/
                  {progression.totalPossibleWorkouts}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Progression</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progression.progressPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Phase */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-xl mb-8">
          <h3 className="text-xl font-bold mb-2">Phase Actuelle</h3>
          <p className="text-lg opacity-90">
            {progression.currentWeek <= 3
              ? "Phase 1 - Volume et Technique"
              : progression.currentWeek <= 7
              ? "Phase 2 - Force et Puissance"
              : progression.currentWeek <= 9
              ? "Phase 3 - Pic et Affûtage"
              : "Programme terminé"}
          </p>
          <div className="mt-4">
            <div className="bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${(progression.currentWeek / 9) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm opacity-75 mt-2">
              Semaine {progression.currentWeek} sur {progression.totalWeeks}
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Next Workout */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              {nextWorkout ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Prochain Entraînement
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Prêt
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {nextWorkout.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>🔥 {nextWorkout.type}</span>
                        <span>⏱️ {nextWorkout.duration}</span>
                        <span>📅 Semaine {nextWorkout.week}</span>
                      </div>
                    </div>

                    <Link
                      href={`/workout/${nextWorkout.id}`}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <Play className="w-5 h-5" />
                      <span>Commencer l'Entraînement</span>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Programme Terminé !
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Félicitations ! Tu as terminé ton programme de{" "}
                    {progression.totalWeeks} semaine
                    {progression.totalWeeks > 1 ? "s" : ""}.
                  </p>
                  <Link
                    href="/programs"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    <span>Découvrir de nouveaux programmes</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Program Overview */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Aperçu Programme
              </h3>
              <div className="space-y-3">
                {progressData.program?.phases.map((phase: Phase) => (
                  <div key={phase.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {phase.name} (S{phase.startWeek}-{phase.endWeek})
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          progression.currentWeek >= phase.startWeek &&
                          progression.currentWeek <= phase.endWeek
                            ? "text-green-600"
                            : progression.currentWeek > phase.endWeek
                            ? "text-gray-400"
                            : "text-gray-400"
                        }`}
                      >
                        {progression.currentWeek > phase.endWeek
                          ? "✓ Terminée"
                          : progression.currentWeek >= phase.startWeek
                          ? "✓ En cours"
                          : "À venir"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{phase.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Workouts */}
            {recentWorkouts.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Séances Récentes
                </h3>
                <div className="space-y-3">
                  {recentWorkouts.map((workout: any) => (
                    <div
                      key={workout.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {workout.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(workout.completedAt).toLocaleDateString(
                            "fr-FR"
                          )}
                          {workout.duration && ` • ${workout.duration}min`}
                        </p>
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
