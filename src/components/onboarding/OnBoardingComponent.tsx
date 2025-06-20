import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Target,
  Calendar,
  Dumbbell,
  Activity,
  Trophy,
  User,
  Clock,
  Zap,
} from "lucide-react";
import { OnboardingFormData } from "@/types";

interface OnboardingComponentProps {
  onComplete: (formData: OnboardingFormData) => void;
  initialData?: Partial<OnboardingFormData>;
}

const OnboardingComponent: React.FC<OnboardingComponentProps> = ({
  onComplete,
  initialData = {},
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingFormData>({
    // Profil de base (avec données initiales)
    name: initialData.name || "",
    age: initialData.age || "",
    weight: initialData.weight || "",
    height: initialData.height || "",
    experience: initialData.experience || "",

    // Objectifs
    fightDate: "",
    fightType: "",
    goals: [],

    // Niveau physique
    trainingFrequency: "",
    currentCondition: "",
    injuries: "",

    // Tests 1RM (optionnel pour MVP)
    benchPress: "",
    squat: "",
    deadlift: "",

    // Disponibilités
    sessionsPerWeek: "",
    sessionDuration: "",
    equipment: [],
  });

  const steps = [
    {
      id: "welcome",
      title: "Bienvenue dans FightForge",
      subtitle:
        "Ton programme d'entraînement personnalisé pour dominer sur le ring",
      icon: <Trophy className="w-12 h-12 text-red-500" />,
    },
    {
      id: "profile",
      title: "Ton Profil",
      subtitle: "Aide-nous à mieux te connaître",
      icon: <User className="w-8 h-8 text-blue-500" />,
    },
    {
      id: "goals",
      title: "Tes Objectifs",
      subtitle: "Que veux-tu accomplir ?",
      icon: <Target className="w-8 h-8 text-green-500" />,
    },
    {
      id: "fitness",
      title: "Ton Niveau Actuel",
      subtitle: "Évalue ta condition physique",
      icon: <Activity className="w-8 h-8 text-purple-500" />,
    },
    {
      id: "strength",
      title: "Tests de Force",
      subtitle: "Pour personnaliser tes charges (optionnel)",
      icon: <Dumbbell className="w-8 h-8 text-orange-500" />,
    },
    {
      id: "schedule",
      title: "Ton Planning",
      subtitle: "Organisons ton entraînement",
      icon: <Clock className="w-8 h-8 text-indigo-500" />,
    },
    {
      id: "summary",
      title: "Ton Programme Est Prêt !",
      subtitle: "Récapitulatif de ton profil",
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
    },
  ];

  const updateFormData = (field: keyof OnboardingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: "goals" | "equipment", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(formData);
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case "welcome":
        return (
          <div className="text-center space-y-8 py-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-3xl opacity-20"></div>
              <Trophy className="w-24 h-24 text-red-500 mx-auto relative z-10" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                FightForge
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Programme d'entraînement scientifique conçu par des champions
                pour t'amener au sommet de tes performances
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-red-500" />
                </div>
                <p className="font-medium">Personnalisé</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
                <p className="font-medium">Périodisé</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-green-500" />
                </div>
                <p className="font-medium">Efficace</p>
              </div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ton prénom"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Âge
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poids (kg)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => updateFormData("weight", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille (cm)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="175"
                  value={formData.height}
                  onChange={(e) => updateFormData("height", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expérience en boxe
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={formData.experience}
                onChange={(e) => updateFormData("experience", e.target.value)}
              >
                <option value="">Sélectionne ton niveau</option>
                <option value="beginner">Débutant (moins de 6 mois)</option>
                <option value="novice">Novice (6 mois - 2 ans)</option>
                <option value="intermediate">Intermédiaire (2-5 ans)</option>
                <option value="advanced">Avancé (5+ ans)</option>
                <option value="elite">Elite/Compétiteur</option>
              </select>
            </div>
          </div>
        );

      case "goals":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de ton prochain combat/stage
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={formData.fightDate}
                onChange={(e) => updateFormData("fightDate", e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Cette date déterminera la périodisation de ton programme
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'objectif
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={formData.fightType}
                onChange={(e) => updateFormData("fightType", e.target.value)}
              >
                <option value="">Sélectionne ton objectif</option>
                <option value="amateur-fight">Combat amateur</option>
                <option value="pro-fight">Combat professionnel</option>
                <option value="sparring">Session de sparring</option>
                <option value="competition">Compétition</option>
                <option value="training-camp">Stage d'entraînement</option>
                <option value="fitness">Condition physique générale</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tes priorités (sélectionne 2-3 maximum)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Puissance explosive",
                  "Endurance cardio",
                  "Force maximale",
                  "Vitesse de frappe",
                  "Agilité/Mobilité",
                  "Résistance musculaire",
                ].map((goal: string) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleArrayField("goals", goal)}
                    className={`p-3 text-left border rounded-lg transition-all ${
                      formData.goals.includes(goal)
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-300 hover:border-red-300"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "fitness":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fréquence d'entraînement actuelle
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={formData.trainingFrequency}
                onChange={(e) =>
                  updateFormData("trainingFrequency", e.target.value)
                }
              >
                <option value="">Combien de fois par semaine ?</option>
                <option value="1-2">1-2 fois par semaine</option>
                <option value="3-4">3-4 fois par semaine</option>
                <option value="5-6">5-6 fois par semaine</option>
                <option value="daily">Tous les jours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment évalues-tu ta condition physique actuelle ?
              </label>
              <div className="space-y-2">
                {[
                  { value: "poor", label: "Faible - Je commence tout juste" },
                  { value: "fair", label: "Correcte - J'ai une base" },
                  {
                    value: "good",
                    label: "Bonne - Je m'entraîne régulièrement",
                  },
                  {
                    value: "excellent",
                    label: "Excellente - Je suis en très bonne forme",
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="currentCondition"
                      value={option.value}
                      checked={formData.currentCondition === option.value}
                      onChange={(e) =>
                        updateFormData("currentCondition", e.target.value)
                      }
                      className="w-4 h-4 text-red-500"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blessures ou limitations actuelles
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Décris toute blessure ou limitation physique (optionnel)"
                rows={3}
                value={formData.injuries}
                onChange={(e) => updateFormData("injuries", e.target.value)}
              />
            </div>
          </div>
        );

      case "strength":
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Optionnel :</strong> Ces tests nous aident à
                personnaliser tes charges d'entraînement. Si tu ne connais pas
                tes 1RM, nous les estimerons avec des tests simples dans l'app.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Développé couché (1RM)
                  <span className="text-gray-500 text-xs block">en kg</span>
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="80"
                  value={formData.benchPress}
                  onChange={(e) => updateFormData("benchPress", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Squat (1RM)
                  <span className="text-gray-500 text-xs block">en kg</span>
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="100"
                  value={formData.squat}
                  onChange={(e) => updateFormData("squat", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soulevé de terre (1RM)
                  <span className="text-gray-500 text-xs block">en kg</span>
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="120"
                  value={formData.deadlift}
                  onChange={(e) => updateFormData("deadlift", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Séances par semaine souhaitées
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={formData.sessionsPerWeek}
                  onChange={(e) =>
                    updateFormData("sessionsPerWeek", e.target.value)
                  }
                >
                  <option value="">Sélectionne</option>
                  <option value="3">3 séances/semaine</option>
                  <option value="4">4 séances/semaine</option>
                  <option value="5">5 séances/semaine</option>
                  <option value="6">6 séances/semaine</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée par séance
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={formData.sessionDuration}
                  onChange={(e) =>
                    updateFormData("sessionDuration", e.target.value)
                  }
                >
                  <option value="">Sélectionne</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 heure</option>
                  <option value="75">1h15</option>
                  <option value="90">1h30</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Équipement disponible
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "Haltères",
                  "Kettlebells",
                  "Barre olympique",
                  "Sac de frappe",
                  "Corde à sauter",
                  "Tapis de course",
                  "Élastiques",
                  "Medecine ball",
                  "Box de jump",
                ].map((equipment: string) => (
                  <button
                    key={equipment}
                    type="button"
                    onClick={() => toggleArrayField("equipment", equipment)}
                    className={`p-3 text-sm text-left border rounded-lg transition-all ${
                      formData.equipment.includes(equipment)
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-300 hover:border-red-300"
                    }`}
                  >
                    {equipment}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "summary":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Félicitations {formData.name} !
              </h3>
              <p className="text-gray-600">
                Ton programme personnalisé est prêt. Voici un récapitulatif :
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-xl">
              <h4 className="font-bold text-lg mb-4">
                Ton Programme FightForge
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="opacity-80">Objectif :</span>
                  <div className="font-medium">
                    {formData.fightType || "Non spécifié"}
                  </div>
                </div>
                <div>
                  <span className="opacity-80">Échéance :</span>
                  <div className="font-medium">
                    {formData.fightDate
                      ? new Date(formData.fightDate).toLocaleDateString("fr-FR")
                      : "À définir"}
                  </div>
                </div>
                <div>
                  <span className="opacity-80">Fréquence :</span>
                  <div className="font-medium">
                    {formData.sessionsPerWeek || "?"} séances/semaine
                  </div>
                </div>
                <div>
                  <span className="opacity-80">Durée :</span>
                  <div className="font-medium">
                    {formData.sessionDuration || "?"} min/séance
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">
                  Priorités d'entraînement
                </h5>
                <ul className="space-y-1">
                  {formData.goals.length > 0 ? (
                    formData.goals.map((goal: string, index: number) => (
                      <li key={index} className="text-gray-600">
                        • {goal}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400">Non spécifiées</li>
                  )}
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">
                  Niveau actuel
                </h5>
                <p className="text-gray-600 capitalize">
                  {formData.experience
                    ? formData.experience.replace("-", " ")
                    : "Non spécifié"}
                </p>
                <p className="text-gray-600 capitalize">
                  Condition : {formData.currentCondition || "Non évaluée"}
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleComplete}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all"
              >
                Lancer Mon Programme 🥊
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Programme de 9 semaines • Suivi personnalisé • Ajustements
                automatiques
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">
            Étape {currentStep + 1} sur {steps.length}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {steps[currentStep].icon}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600 text-lg">{steps[currentStep].subtitle}</p>
        </div>

        <div className="max-w-2xl mx-auto">{renderStepContent()}</div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
            currentStep === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Précédent</span>
        </button>

        {currentStep < steps.length - 1 && (
          <button
            onClick={nextStep}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <span>Suivant</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingComponent;
