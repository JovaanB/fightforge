"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Trophy, Target, Calendar, Zap, ChevronRight } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold">FightForge</span>
          </div>
          <div className="space-x-4">
            {status === "loading" ? (
              <div className="w-8 h-8 animate-pulse bg-gray-300 rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">
                  Salut {session.user?.name}
                </span>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/pricing"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Tarifs
                </Link>
                <Link
                  href="/auth/signin"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-3xl opacity-20"></div>
            <Trophy className="w-24 h-24 text-red-500 mx-auto relative z-10" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              FightForge
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Le programme d'entraînement scientifique conçu par des champions
            pour t'amener au sommet de tes performances en boxe
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/onboarding"
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <span>Créer mon programme</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all"
            >
              En savoir plus
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">9</div>
              <div className="text-gray-400 text-sm">Semaines périodisées</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">100%</div>
              <div className="text-gray-400 text-sm">Personnalisé</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">24/7</div>
              <div className="text-gray-400 text-sm">Suivi adaptatif</div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Pourquoi choisir <span className="text-red-500">FightForge</span> ?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
            <Target className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold mb-4">Totalement Personnalisé</h3>
            <p className="text-gray-400">
              Chaque programme est généré selon ton niveau, tes objectifs, et ta
              date de combat pour maximiser tes performances.
            </p>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
            <Calendar className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold mb-4">
              Périodisation Scientifique
            </h3>
            <p className="text-gray-400">
              Basé sur les méthodes éprouvées des champions, avec une
              progression intelligente vers ton pic de forme.
            </p>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
            <Zap className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold mb-4">Adaptation Continue</h3>
            <p className="text-gray-400">
              Le programme s'adapte à tes performances et ajuste automatiquement
              les charges et intensités.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 p-12 rounded-3xl border border-red-500/20">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à forger ton potentiel ?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Rejoins les boxeurs qui font confiance à FightForge pour atteindre
            leurs objectifs et dominer sur le ring.
          </p>
          <Link
            href="/onboarding"
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-12 py-4 rounded-xl font-semibold text-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center space-x-2"
          >
            <span>Commencer maintenant</span>
            <ChevronRight className="w-6 h-6" />
          </Link>
          <Link
            href="/pricing"
            className="border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all"
          >
            Voir les tarifs
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2024 FightForge. Conçu pour les champions.</p>
        </div>
      </footer>
    </div>
  );
}
