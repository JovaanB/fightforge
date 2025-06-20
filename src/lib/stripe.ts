import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
  typescript: true,
});

export const PRICING_PLANS = {
  free: {
    name: "Découverte",
    description: "Accès limité pour découvrir FightForge",
    price: 0,
    priceId: null,
    features: ["Accès à 1 entraînement"],
    limitations: [
      "Limiter à 1 seul entraînement",
      "Pas de personnalisation avancée",
      "Pas de suivi de progression",
      "Pas de support prioritaire",
    ],
  },

  starter: {
    name: "Champion",
    description: "Pour les boxeurs sérieux qui veulent progresser",
    price: 29,
    priceId: "price_1RZI6HQfxK1ZzVYj7ApqEH2q",
    currency: "eur",
    interval: "month",
    features: [
      "Séances illimitées",
      "Adaptation automatique des charges",
      "Suivi détaillé de progression",
      "Tests de force intégrés",
      "Support prioritaire",
    ],
    popular: true,
  },
};

export type PricingPlan = keyof typeof PRICING_PLANS;
