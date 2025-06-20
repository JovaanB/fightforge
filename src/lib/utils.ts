import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function calculateWeeksUntil(targetDate: Date): number {
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return Math.max(diffWeeks, 1); // Au minimum 1 semaine
}

export function calculateTrainingLoad(
  oneRM: number,
  targetPercentage: number,
  reps: number
): number {
  // Formule de base pour calculer la charge d'entraînement
  return Math.round(oneRM * (targetPercentage / 100));
}

export function estimateOneRM(weight: number, reps: number): number {
  // Formule d'Epley pour estimer le 1RM
  return Math.round(weight * (1 + reps / 30));
}
