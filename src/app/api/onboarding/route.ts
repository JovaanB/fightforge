import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OnboardingFormData } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const formData: OnboardingFormData = await request.json();

    console.log("Received onboarding data:", formData);

    // 1. Créer ou mettre à jour l'utilisateur
    // Note: Pour le MVP, on simule un utilisateur. Plus tard, on utilisera la session
    const tempEmail = `user-${Date.now()}@fightforge.com`;

    const user = await prisma.user.create({
      data: {
        name: formData.name,
        email: tempEmail,

        // Profil physique
        age: formData.age ? parseInt(formData.age) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        experience: mapExperienceLevel(formData.experience),

        // Objectifs
        fightDate: formData.fightDate ? new Date(formData.fightDate) : null,
        fightType: mapFightType(formData.fightType),
        goals: mapGoals(formData.goals),

        // Condition physique
        trainingFrequency: formData.trainingFrequency,
        currentCondition: mapConditionLevel(formData.currentCondition),
        injuries: formData.injuries || null,

        // Tests de force
        benchPress: formData.benchPress
          ? parseFloat(formData.benchPress)
          : null,
        squat: formData.squat ? parseFloat(formData.squat) : null,
        deadlift: formData.deadlift ? parseFloat(formData.deadlift) : null,

        // Planning
        sessionsPerWeek: formData.sessionsPerWeek
          ? parseInt(formData.sessionsPerWeek)
          : null,
        sessionDuration: formData.sessionDuration
          ? parseInt(formData.sessionDuration)
          : null,
        equipment: mapEquipment(formData.equipment),
      },
    });

    console.log("Created user:", user.id);

    // 2. Générer le programme personnalisé
    const generatedProgram = await assignExistingProgram(user);

    console.log("Generated program:", generatedProgram.id);

    // 3. Créer l'assignation utilisateur-programme
    const userProgram = await prisma.userProgram.create({
      data: {
        userId: user.id,
        programId: generatedProgram.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 63 * 24 * 60 * 60 * 1000), // 9 semaines plus tard
        currentWeek: 1,
        currentPhase: 1,
      },
    });

    console.log("Created user program assignment:", userProgram.id);

    return NextResponse.json({
      success: true,
      userId: user.id,
      programId: generatedProgram.id,
      userProgramId: userProgram.id,
      message: "Programme généré avec succès !",
    });
  } catch (error) {
    console.error("Onboarding API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la création du programme",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function assignExistingProgram(user: any) {
  // Pour le MVP, on assigne le programme Force existant
  const existingProgram = await prisma.program.findFirst({
    where: { name: "Train Like A Champion - FORCE" },
  });

  if (!existingProgram) {
    throw new Error("Aucun programme disponible");
  }

  return existingProgram;
}

// Fonctions de mapping pour convertir les strings en enums Prisma
function mapExperienceLevel(experience: string) {
  const mapping: Record<string, any> = {
    beginner: "BEGINNER",
    novice: "NOVICE",
    intermediate: "INTERMEDIATE",
    advanced: "ADVANCED",
    elite: "ELITE",
  };
  return mapping[experience] || null;
}

function mapFightType(fightType: string) {
  const mapping: Record<string, any> = {
    "amateur-fight": "AMATEUR_FIGHT",
    "pro-fight": "PRO_FIGHT",
    sparring: "SPARRING",
    competition: "COMPETITION",
    "training-camp": "TRAINING_CAMP",
    fitness: "FITNESS",
  };
  return mapping[fightType] || null;
}

function mapGoals(goals: string[]) {
  const mapping: Record<string, any> = {
    "Puissance explosive": "EXPLOSIVE_POWER",
    "Endurance cardio": "CARDIO_ENDURANCE",
    "Force maximale": "MAX_STRENGTH",
    "Vitesse de frappe": "PUNCH_SPEED",
    "Agilité/Mobilité": "AGILITY_MOBILITY",
    "Résistance musculaire": "MUSCULAR_ENDURANCE",
  };
  return goals.map((goal) => mapping[goal]).filter(Boolean);
}

function mapConditionLevel(condition: string) {
  const mapping: Record<string, any> = {
    poor: "POOR",
    fair: "FAIR",
    good: "GOOD",
    excellent: "EXCELLENT",
  };
  return mapping[condition] || null;
}

function mapEquipment(equipment: string[]) {
  const mapping: Record<string, any> = {
    Haltères: "DUMBBELLS",
    Kettlebells: "KETTLEBELLS",
    "Barre olympique": "BARBELL",
    "Sac de frappe": "PUNCHING_BAG",
    "Corde à sauter": "JUMP_ROPE",
    "Tapis de course": "TREADMILL",
    Élastiques: "RESISTANCE_BANDS",
    "Medecine ball": "MEDICINE_BALL",
    "Box de jump": "JUMP_BOX",
  };
  return equipment.map((eq) => mapping[eq]).filter(Boolean);
}
