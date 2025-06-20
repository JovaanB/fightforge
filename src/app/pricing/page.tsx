"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trophy, Check, Zap, Crown, Star, ArrowRight } from "lucide-react";
import { PRICING_PLANS } from "@/lib/stripe";

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<{
    status: string;
    plan: string;
    isActive: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch("/api/user/progress");
        if (response.ok) {
          const data = await response.json();
          setCurrentSubscription(data.user.subscription);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    };

    if (session) {
      fetchSubscription();
    }
  }, [session]);

  const handleSubscribe = async (planKey: string) => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=/pricing");
      return;
    }

    if (planKey === "free") {
      if (currentSubscription?.isActive) {
        router.push("/api/stripe/cancel-subscription");
        return;
      }
      router.push("/dashboard");
      return;
    }

    setIsLoading(planKey);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: PRICING_PLANS[planKey as keyof typeof PRICING_PLANS].priceId,
          planName: planKey,
        }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Erreur lors de la création de la session de paiement");
    } finally {
      setIsLoading(null);
    }
  };

  const getPlanIcon = (planKey: string) => {
    switch (planKey) {
      case "free":
        return <Star className="w-8 h-8 text-gray-500" />;
      case "starter":
        return <Zap className="w-8 h-8 text-blue-500" />;
      default:
        return <Trophy className="w-8 h-8 text-red-500" />;
    }
  };

  const getPlanGradient = (planKey: string) => {
    switch (planKey) {
      case "free":
        return "from-gray-500 to-gray-600";
      case "starter":
        return "from-blue-500 to-blue-600";
      default:
        return "from-red-500 to-orange-500";
    }
  };

  const isCurrentPlan = (planKey: string) => {
    return (
      currentSubscription?.plan === planKey && currentSubscription?.isActive
    );
  };

  const isFreePlan = (planKey: string) => {
    return planKey === "free";
  };

  const isDisabledPlan = (planKey: string) => {
    return (
      isCurrentPlan(planKey) ||
      (isFreePlan(planKey) && currentSubscription?.status !== "active")
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold text-gray-900">
                FightForge
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Choisis ton plan
          </h1>
          {currentSubscription?.isActive && (
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
              <Crown className="w-5 h-5" />
              <span className="font-medium">
                Plan actuel :{" "}
                {PRICING_PLANS[
                  currentSubscription.plan as keyof typeof PRICING_PLANS
                ]?.name || "Champion"}
              </span>
            </div>
          )}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Débloque tout ton potentiel avec FightForge. Programmes
            personnalisés, suivi intelligent, résultats garantis.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {Object.entries(PRICING_PLANS).map(([planKey, plan]) => (
            <div
              key={planKey}
              className={`bg-white rounded-2xl shadow-xl border-2 transition-all hover:shadow-2xl ${
                plan.popular
                  ? "border-blue-500 scale-105"
                  : "border-gray-200 hover:border-gray-300"
              } ${isCurrentPlan(planKey) ? "ring-2 ring-green-500" : ""} ${
                isDisabledPlan(planKey) ? "opacity-75" : ""
              }`}
            >
              {/* Plan Header */}
              <div className="p-8 text-center">
                {plan.popular && (
                  <div className="inline-flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                    <Star className="w-4 h-4" />
                    <span>Plus populaire</span>
                  </div>
                )}

                {isCurrentPlan(planKey) && (
                  <div className="inline-flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                    <Check className="w-4 h-4" />
                    <span>Plan actuel</span>
                  </div>
                )}

                {isFreePlan(planKey) &&
                  currentSubscription?.plan === "free" && (
                    <div className="inline-flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                      <Check className="w-4 h-4" />
                      <span>Plan actuel</span>
                    </div>
                  )}

                <div className="mb-4">{getPlanIcon(planKey)}</div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}€
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500">/mois</span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="px-8 pb-8">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Limitations for free plan */}
                {plan.limitations && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">
                      Limitations :
                    </h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="text-sm text-gray-500">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(planKey)}
                  disabled={isLoading === planKey || isDisabledPlan(planKey)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                    isDisabledPlan(planKey)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : plan.popular
                      ? `bg-gradient-to-r ${getPlanGradient(
                          planKey
                        )} text-white hover:shadow-lg`
                      : "border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading === planKey ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {isCurrentPlan(planKey)
                          ? "Plan actuel"
                          : isFreePlan(planKey) &&
                            currentSubscription?.plan === "free"
                          ? "Plan actuel"
                          : planKey === "free" && currentSubscription?.isActive
                          ? "Rétrograder vers le plan gratuit"
                          : planKey === "free"
                          ? "Commencer gratuitement"
                          : "Choisir ce plan"}
                      </span>
                      {!isDisabledPlan(planKey) && (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </>
                  )}
                </button>

                {planKey !== "free" && !isCurrentPlan(planKey) && (
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Annulation possible à tout moment
                  </p>
                )}

                {planKey === "free" && currentSubscription?.isActive && (
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Tu conserveras l'accès à ton plan actuel jusqu'à la fin de
                    ta période de facturation
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Questions fréquentes
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Puis-je changer de plan à tout moment ?
              </h3>
              <p className="text-gray-600">
                Oui, vous pouvez upgrader ou downgrader votre plan à tout
                moment. Les changements prennent effet immédiatement.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Y a-t-il une période d'essai ?
              </h3>
              <p className="text-gray-600">
                Le plan Découverte est gratuit et vous permet de tester nos
                fonctionnalités de base. Aucune carte de crédit requise.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Que se passe-t-il si j'annule ?
              </h3>
              <p className="text-gray-600">
                Vous gardez l'accès à votre plan jusqu'à la fin de votre période
                de facturation, puis vous revenez au plan gratuit.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Les programmes sont-ils vraiment personnalisés ?
              </h3>
              <p className="text-gray-600">
                Oui, nos algorithmes créent des programmes uniques basés sur
                votre profil, vos objectifs et votre progression en temps réel.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-8 rounded-2xl max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à transformer ton entraînement ?
            </h2>
            <p className="text-xl opacity-90 mb-6">
              Rejoins des milliers de boxeurs qui font confiance à FightForge
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center space-x-2 bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <span>Commencer maintenant</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
