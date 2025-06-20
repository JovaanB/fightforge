"use client";

import { useRouter } from "next/navigation";
import OnboardingComponent from "@/components/onboarding/OnBoardingComponent";
import { OnboardingFormData } from "@/types";

export default function OnboardingPage() {
  const router = useRouter();

  const handleOnboardingComplete = async (formData: OnboardingFormData) => {
    try {
      // Sauvegarder les données d'onboarding
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Onboarding completed:", result);

        // Rediriger vers le dashboard avec le programme généré
        router.push("/dashboard");
      } else {
        console.error("Onboarding failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <OnboardingComponent onComplete={handleOnboardingComplete} />
    </div>
  );
}
