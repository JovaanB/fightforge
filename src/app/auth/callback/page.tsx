"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Trophy } from "lucide-react";

export default function AuthCallbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "loading") return;

    if (session) {
      // Vérifier si c'est un nouvel utilisateur pour redirection vers onboarding
      const isNewUser =
        searchParams.get("newUser") === "true" || session.user.isNewUser;

      if (isNewUser) {
        // Nouvel utilisateur → onboarding
        router.push("/onboarding?newUser=true");
      } else {
        // Utilisateur existant → dashboard
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
        router.push(callbackUrl);
      }
    } else {
      // Pas de session → retour à la connexion
      router.push("/auth/signin");
    }
  }, [session, status, router, searchParams]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Connexion en cours...
          </h2>
          <p className="text-gray-400">
            Finalisation de votre authentification
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="text-center">
        <Trophy className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Redirection...
        </h2>
        <p className="text-gray-400">
          Vous allez être redirigé automatiquement
        </p>
      </div>
    </div>
  );
}
