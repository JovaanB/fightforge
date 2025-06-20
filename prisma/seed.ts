import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("demo123", 12);

  await prisma.user.create({
    data: {
      name: "Utilisateur Démo",
      email: "demo@fightforge.com",
      password: hashedPassword,
      age: 25,
      weight: 75,
      experience: "INTERMEDIATE",
      goals: ["EXPLOSIVE_POWER", "MAX_STRENGTH"],
    },
  });

  console.log("✅ Demo user created: demo@fightforge.com / demo123");

  // 1. Créer les exercices de base
  console.log("📚 Creating exercises...");

  const exercisesData = [
    // Warm-up / Plyométrie
    {
      name: "Altitude Landings",
      category: "PLYOMETRIC",
      isBodyweight: true,
      muscleGroups: ["QUADRICEPS", "GLUTES", "CALVES"],
      equipment: ["JUMP_BOX"],
      description: "Réception d'altitude pour développer l'absorption d'impact",
      instructions: [
        "Monter sur la box",
        "Descendre et réceptionner en position squat",
        "Focus sur l'amortissement",
      ],
    },
    {
      name: "Ice Skaters",
      category: "PLYOMETRIC",
      isBodyweight: true,
      muscleGroups: ["GLUTES", "QUADRICEPS", "CORE"],
      equipment: [],
      description: "Saut latéral alternant, imitation du patineur",
      instructions: [
        "Saut latéral explosif",
        "Réception sur une jambe",
        "Contrôle de l'équilibre",
      ],
    },
    {
      name: "Landmine Punch",
      category: "BOXING_SPECIFIC",
      muscleGroups: ["SHOULDERS", "CORE", "CHEST"],
      equipment: ["BARBELL"],
      description: "Punch explosif avec landmine",
      instructions: [
        "Position boxeur",
        "Rotation du tronc",
        "Extension explosive du bras",
      ],
    },
    {
      name: "Box Jump",
      category: "PLYOMETRIC",
      isBodyweight: true,
      muscleGroups: ["QUADRICEPS", "GLUTES", "CALVES"],
      equipment: ["JUMP_BOX"],
      description: "Saut sur une box",
      instructions: [
        "Démarrer en position squat",
        "Sauter sur la box",
        "Réception amortie",
      ],
    },
    {
      name: "Punch ISO Hold",
      category: "BOXING_SPECIFIC",
      muscleGroups: ["SHOULDERS", "CORE"],
      equipment: ["RESISTANCE_BANDS"],
      description: "Maintien isométrique de punch",
      instructions: [
        "Position de garde",
        "Puncher et maintenir la position",
        "Engager le tronc",
      ],
    },
    {
      name: "Low and Fast Pogos",
      category: "PLYOMETRIC",
      isBodyweight: true,
      muscleGroups: ["CALVES", "ANKLES"],
      equipment: [],
      description: "Sauts rapides et bas, focus sur les chevilles",
      instructions: [
        "Sauts courts et rapides",
        "Minimiser le contact au sol",
        "Utiliser la réactivité des chevilles",
      ],
    },
    // Force
    {
      name: "KB Sumo Deadlift",
      category: "HINGE_PATTERN",
      muscleGroups: ["GLUTES", "HAMSTRINGS", "CORE"],
      equipment: ["KETTLEBELLS"],
      description: "Soulevé de terre sumo avec kettlebell",
      instructions: [
        "Pieds écartés, KB au centre",
        "Hanches vers l'arrière",
        "Poussée explosive des hanches",
      ],
    },
    {
      name: "Plank Shoulder Taps",
      category: "CORE",
      isBodyweight: true,
      muscleGroups: ["CORE", "SHOULDERS"],
      equipment: [],
      description: "Planche avec alternance de touches d'épaules",
      instructions: [
        "Position planche",
        "Toucher épaule opposée",
        "Maintenir hanches stables",
      ],
    },
    {
      name: "Strict Press Ups",
      category: "HORIZONTAL_PRESS",
      muscleGroups: ["CHEST", "TRICEPS", "SHOULDERS"],
      equipment: [],
      description: "Pompes strictes, tempo contrôlé",
      instructions: [
        "Position classique",
        "Descente contrôlée",
        "Poussée explosive",
      ],
    },
    {
      name: "TRX Row",
      category: "HORIZONTAL_PULL",
      isBodyweight: true,
      muscleGroups: ["BACK", "BICEPS"],
      equipment: ["RESISTANCE_BANDS"],
      description: "Tirage horizontal avec TRX",
      instructions: [
        "Corps incliné",
        "Tirer vers la poitrine",
        "Contrôler la descente",
      ],
    },
    {
      name: "Goblet Split Squat",
      category: "UNILATERAL_LIFT",
      muscleGroups: ["QUADRICEPS", "GLUTES"],
      equipment: ["KETTLEBELLS", "DUMBBELLS"],
      description: "Squat bulgare avec poids",
      instructions: [
        "Position fendue",
        "Descente contrôlée",
        "Poussée sur talon avant",
      ],
    },
    {
      name: "Band Pull Aparts",
      category: "HORIZONTAL_PULL",
      muscleGroups: ["BACK", "SHOULDERS"],
      equipment: ["RESISTANCE_BANDS"],
      description: "Écartement d'élastique",
      instructions: [
        "Bras tendus devant",
        "Écarter l'élastique",
        "Contracter omoplates",
      ],
    },
    {
      name: "Band Face Pull",
      category: "HORIZONTAL_PULL",
      muscleGroups: ["BACK", "SHOULDERS"],
      equipment: ["RESISTANCE_BANDS"],
      description: "Tirage facial avec bande élastique",
      instructions: [
        "Saisir la bande à deux mains",
        "Tirer vers le visage en écartant les coudes",
        "Contracter les omoplates",
      ],
    },
    // Core circuit
    {
      name: "Palloff Press",
      category: "CORE",
      muscleGroups: ["CORE"],
      equipment: ["RESISTANCE_BANDS"],
      description: "Anti-rotation du tronc",
      instructions: [
        "Position latérale",
        "Presser devant soi",
        "Résister à la rotation",
      ],
    },
    {
      name: "Hand Elevated Plank Hold",
      category: "CORE",
      isBodyweight: true,
      muscleGroups: ["CORE", "SHOULDERS"],
      equipment: [],
      description: "Planche mains surélevées",
      instructions: [
        "Mains sur support",
        "Corps aligné",
        "Maintenir la position",
      ],
    },
    {
      name: "Leg Lowers",
      category: "CORE",
      isBodyweight: true,
      muscleGroups: ["CORE"],
      equipment: [],
      description: "Descente contrôlée des jambes",
      instructions: [
        "Allongé sur le dos",
        "Jambes à 90°",
        "Descendre sans cambrer",
      ],
    },
    {
      name: "Plank Shoulder Tap",
      category: "CORE",
      isBodyweight: true,
      muscleGroups: ["CORE", "SHOULDERS"],
      equipment: [],
      description: "Planche avec touche d'épaule",
      instructions: [
        "Position planche",
        "Toucher épaule opposée",
        "Maintenir hanches stables",
      ],
    },
    {
      name: "Goblet Squat",
      category: "SQUAT_PATTERN",
      muscleGroups: ["QUADRICEPS", "GLUTES", "CORE"],
      equipment: ["KETTLEBELLS", "DUMBBELLS"],
      description: "Squat avec poids tenu devant la poitrine",
      instructions: [
        "Pieds à largeur d'épaules, orteils légèrement ouverts",
        "Descendre en squat profond, coudes entre les genoux",
        "Garder le dos droit et la poitrine haute",
      ],
    },
    {
      name: "1/2 Deadbug",
      category: "CORE",
      muscleGroups: ["CORE"],
      equipment: [],
      description:
        "Exercice de stabilisation du tronc, moitié du mouvement Deadbug",
      instructions: [
        "Allongé sur le dos, genoux pliés à 90°, pieds à plat",
        "Un bras tendu vers le plafond, jambe opposée tendue vers l'avant",
        "Descendre le bras tendu et la jambe tendue vers le sol simultanément",
        "Maintenir le bas du dos plaqué au sol",
      ],
    },
    {
      name: "1/2 Kneeling DB Shoulder Press",
      category: "VERTICAL_PRESS",
      muscleGroups: ["SHOULDERS", "TRICEPS"],
      equipment: ["DUMBBELLS"],
      description: "Développé épaule haltère en position demi-agenouillée",
      instructions: [
        "Un genou au sol, l'autre jambe fléchie à 90° devant",
        "Haltère en main, coude sous le poignet",
        "Presser l'haltère au-dessus de la tête",
        "Contrôler la descente",
      ],
    },
    {
      name: "Single Arm Cable Pull Down",
      category: "VERTICAL_PULL",
      muscleGroups: ["BACK", "BICEPS"],
      equipment: ["CABLE_MACHINE"],
      description: "Tirage vertical à un bras à la machine à câble",
      instructions: [
        "S'asseoir, saisir la poignée",
        "Tirer la poignée vers l'épaule",
        "Contrôler la remontée",
      ],
    },
    {
      name: "Hip Thrust March",
      category: "HINGE_PATTERN",
      isBodyweight: true,
      muscleGroups: ["GLUTES", "HAMSTRINGS", "CORE"],
      equipment: ["JUMP_BOX"],
      description: "Marche du pont fessier",
      instructions: [
        "Position pont fessier",
        "Soulever une jambe",
        "Maintenir l'alignement des hanches",
      ],
    },
    {
      name: "Single Arm Farmer Walks",
      category: "CORE",
      muscleGroups: ["CORE", "FOREARMS", "SHOULDERS"],
      equipment: ["KETTLEBELLS", "DUMBBELLS"],
      description: "Marche du fermier à un bras",
      instructions: [
        "Tenir un poids lourd dans une main",
        "Marcher droit, maintenir le tronc stable",
        "Épaules en arrière et vers le bas",
      ],
    },
    {
      name: "Supine ISO Hold",
      category: "CORE",
      isBodyweight: true,
      muscleGroups: ["CORE"],
      equipment: [],
      description: "Maintien isométrique sur le dos",
      instructions: [
        "Allongé sur le dos, genoux pliés",
        "Soulever légèrement la tête et les épaules",
        "Maintenir la position, engager les abdos",
      ],
    },
  ];

  const exercises = await Promise.all(
    exercisesData.map((ex) =>
      prisma.exercise.create({
        data: {
          name: ex.name,
          description: ex.description,
          category: ex.category as any,
          muscleGroups: ex.muscleGroups as any[],
          equipment: ex.equipment as any[],
          instructions: ex.instructions,
        },
      })
    )
  );

  console.log(`✅ Created ${exercises.length} exercises`);

  // 2. Créer le programme
  const program = await prisma.program.create({
    data: {
      name: "Train Like A Champion - FORCE",
      description: "Programme de force complet pour boxeurs",
      duration: 3,
      difficulty: "INTERMEDIATE",
    },
  });

  // 3. Créer la phase
  const phase = await prisma.phase.create({
    data: {
      programId: program.id,
      name: "Phase 1 - Volume et Technique",
      description: "Semaines 1-3 - Construction de la base",
      weekStart: 1,
      weekEnd: 3,
      focus: "HIGH_VOLUME_STRENGTH",
    },
  });

  // 4. Créer le workout complet
  const workout1 = await prisma.workout.create({
    data: {
      phaseId: phase.id,
      name: "Semaine 1-3 - Session 1",
      description: "Séance complète Force & Puissance",
      week: 1,
      session: 1,
      type: "STRENGTH",
    },
  });

  console.log("🏋️ Creating workout sections...");

  // 5. SECTION 1: EXTENDED WARM-UP (Session 1)
  const warmupSection1 = await prisma.workoutSection.create({
    data: {
      workoutId: workout1.id,
      name: "EXTENDED WARM-UP",
      type: "WARMUP",
      order: 1,
      description: "Échauffement dynamique et activation",
    },
  });

  const warmupExercises1 = [
    { name: "Altitude Landings", sets: 3, reps: "5" },
    { name: "Ice Skaters", sets: 3, reps: "5 e/s", isUnilateral: true },
    { name: "Landmine Punch", sets: 3, reps: "5 e/s", isUnilateral: true },
  ];

  for (let i = 0; i < warmupExercises1.length; i++) {
    const ex = warmupExercises1[i];
    const exercise = exercises.find((e) => e.name === ex.name);
    if (exercise) {
      await prisma.sectionExercise.create({
        data: {
          sectionId: warmupSection1.id,
          exerciseId: exercise.id,
          order: i + 1,
          sets: ex.sets,
          reps: ex.reps,
          isUnilateral: ex.isUnilateral || false,
        },
      });
    }
  }

  // 6. SECTION 2: SUPERSET 1 (Session 1)
  const superset1_1 = await prisma.workoutSection.create({
    data: {
      workoutId: workout1.id,
      name: "SUPERSET 1",
      type: "SUPERSET",
      order: 2,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset1_1.id,
      exerciseId: exercises.find((e) => e.name === "KB Sumo Deadlift")!.id,
      order: 1,
      sets: 3,
      reps: "8",
      weight: 16,
      supersetGroup: "1A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset1_1.id,
      exerciseId: exercises.find((e) => e.name === "Plank Shoulder Taps")!.id,
      order: 2,
      sets: 3,
      reps: "6 e/s",
      isUnilateral: true,
      supersetGroup: "1B",
    },
  });

  // 7. SECTION 3: SUPERSET 2 (Session 1)
  const superset1_2 = await prisma.workoutSection.create({
    data: {
      workoutId: workout1.id,
      name: "SUPERSET 2",
      type: "SUPERSET",
      order: 3,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset1_2.id,
      exerciseId: exercises.find((e) => e.name === "Strict Press Ups")!.id,
      order: 1,
      sets: 3,
      reps: "10",
      supersetGroup: "2A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset1_2.id,
      exerciseId: exercises.find((e) => e.name === "TRX Row")!.id,
      order: 2,
      sets: 3,
      reps: "12",
      supersetGroup: "2B",
    },
  });

  // 8. SECTION 4: SUPERSET 3 (Session 1)
  const superset1_3 = await prisma.workoutSection.create({
    data: {
      workoutId: workout1.id,
      name: "SUPERSET 3",
      type: "SUPERSET",
      order: 4,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset1_3.id,
      exerciseId: exercises.find((e) => e.name === "Goblet Split Squat")!.id,
      order: 1,
      sets: 3,
      reps: "12",
      isUnilateral: true,
      supersetGroup: "3A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset1_3.id,
      exerciseId: exercises.find((e) => e.name === "Band Pull Aparts")!.id,
      order: 2,
      sets: 3,
      reps: "10",
      supersetGroup: "3B",
    },
  });

  // 9. SECTION 5: CORE CIRCUIT (Session 1)
  const coreCircuit1 = await prisma.workoutSection.create({
    data: {
      workoutId: workout1.id,
      name: "CORE CIRCUIT",
      type: "CIRCUIT",
      order: 5,
      description: "3 à 4 séries sans pause entre exercices",
      isCircuit: true,
      circuitSets: 4,
      restBetweenSets: 120, // repos entre tours de circuit
    },
  });

  const coreExercises1 = [
    { name: "Palloff Press", reps: "6 e/s", isUnilateral: true },
    { name: "Hand Elevated Plank Hold", duration: 30 },
    { name: "Leg Lowers", reps: "10" },
  ];

  for (let i = 0; i < coreExercises1.length; i++) {
    const ex = coreExercises1[i];
    const exercise = exercises.find((e) => e.name === ex.name);
    if (exercise) {
      await prisma.sectionExercise.create({
        data: {
          sectionId: coreCircuit1.id,
          exerciseId: exercise.id,
          order: i + 1,
          sets: 1, // 1 par tour de circuit
          reps: ex.reps,
          duration: ex.duration,
          isUnilateral: ex.isUnilateral || false,
        },
      });
    }
  }

  console.log(`✅ Created complete workout with ${workout1.id}`);
  console.log(`🔗 Test URL: http://localhost:3000/workout/${workout1.id}`);
  console.log("📊 Workout structure:");
  console.log("   - Extended Warm-up: 3 exercises");
  console.log("   - Superset 1: 2 exercises");
  console.log("   - Superset 2: 2 exercises");
  console.log("   - Superset 3: 2 exercises");
  console.log("   - Core Circuit: 3 exercises (4 rounds)");
  console.log("   - Total: 12 exercises, ~45-60min");

  // 10. Créer le workout Session 2
  const workout2 = await prisma.workout.create({
    data: {
      phaseId: phase.id,
      name: "Semaine 1-3 - Session 2",
      description: "Séance complète Force & Puissance",
      week: 1,
      session: 2,
      type: "STRENGTH",
    },
  });

  console.log("🏋️ Creating workout sections for Session 2...");

  // 11. SECTION 1: EXTENDED WARM-UP (Session 2)
  const warmupSection2 = await prisma.workoutSection.create({
    data: {
      workoutId: workout2.id,
      name: "EXTENDED WARM-UP",
      type: "WARMUP",
      order: 1,
      description: "Échauffement dynamique et activation",
    },
  });

  const warmupExercises2 = [
    { name: "Box Jump", sets: 3, reps: "5" },
    { name: "Punch ISO Hold", sets: 3, reps: "5 sec", isUnilateral: true },
    { name: "Low and Fast Pogos", sets: 3, reps: "10" },
  ];

  for (let i = 0; i < warmupExercises2.length; i++) {
    const ex = warmupExercises2[i];
    const exercise = exercises.find((e) => e.name === ex.name);
    if (exercise) {
      await prisma.sectionExercise.create({
        data: {
          sectionId: warmupSection2.id,
          exerciseId: exercise.id,
          order: i + 1,
          sets: ex.sets,
          reps: ex.reps,
          isUnilateral: ex.isUnilateral || false,
        },
      });
    }
  }

  // 12. SECTION 2: SUPERSET 1 (Session 2)
  const superset2_1 = await prisma.workoutSection.create({
    data: {
      workoutId: workout2.id,
      name: "SUPERSET 1",
      type: "SUPERSET",
      order: 2,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset2_1.id,
      exerciseId: exercises.find((e) => e.name === "Goblet Squat")!.id,
      order: 1,
      sets: 3,
      reps: "8",
      weight: 16,
      supersetGroup: "1A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset2_1.id,
      exerciseId: exercises.find((e) => e.name === "1/2 Deadbug")!.id,
      order: 2,
      sets: 3,
      reps: "5 e/s",
      isUnilateral: true,
      supersetGroup: "1B",
    },
  });

  // 13. SECTION 3: SUPERSET 2 (Session 2)
  const superset2_2 = await prisma.workoutSection.create({
    data: {
      workoutId: workout2.id,
      name: "SUPERSET 2",
      type: "SUPERSET",
      order: 3,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset2_2.id,
      exerciseId: exercises.find(
        (e) => e.name === "1/2 Kneeling DB Shoulder Press"
      )!.id,
      order: 1,
      sets: 3,
      reps: "10",
      supersetGroup: "2A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset2_2.id,
      exerciseId: exercises.find(
        (e) => e.name === "Single Arm Cable Pull Down"
      )!.id,
      order: 2,
      sets: 3,
      reps: "10",
      isUnilateral: true,
      supersetGroup: "2B",
    },
  });

  // 14. SECTION 4: SUPERSET 3 (Session 2)
  const superset2_3 = await prisma.workoutSection.create({
    data: {
      workoutId: workout2.id,
      name: "SUPERSET 3",
      type: "SUPERSET",
      order: 4,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset2_3.id,
      exerciseId: exercises.find((e) => e.name === "Hip Thrust March")!.id,
      order: 1,
      sets: 3,
      reps: "10",
      supersetGroup: "3A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset2_3.id,
      exerciseId: exercises.find((e) => e.name === "Band Face Pull")!.id,
      order: 2,
      sets: 3,
      reps: "12",
      supersetGroup: "3B",
    },
  });

  // 15. SECTION 5: CORE CIRCUIT (Session 2)
  const coreCircuit2 = await prisma.workoutSection.create({
    data: {
      workoutId: workout2.id,
      name: "CORE CIRCUIT",
      type: "CIRCUIT",
      order: 5,
      description: "3 à 4 séries sans pause entre exercices",
      isCircuit: true,
      circuitSets: 4,
      restBetweenSets: 120, // repos entre tours de circuit
    },
  });

  const coreExercises2 = [
    {
      name: "Single Arm Farmer Walks",
      reps: "10 steps e/s",
      isUnilateral: true,
    },
    { name: "Plank Shoulder Taps", reps: "8 reps e/s", isUnilateral: true },
    { name: "Supine ISO Hold", duration: 20 },
  ];

  for (let i = 0; i < coreExercises2.length; i++) {
    const ex = coreExercises2[i];
    const exercise = exercises.find((e) => e.name === ex.name);
    if (exercise) {
      await prisma.sectionExercise.create({
        data: {
          sectionId: coreCircuit2.id,
          exerciseId: exercise.id,
          order: i + 1,
          sets: 1, // 1 par tour de circuit
          reps: ex.reps,
          duration: ex.duration,
          isUnilateral: ex.isUnilateral || false,
        },
      });
    }
  }

  console.log(`✅ Created complete workout with ${workout2.id}`);
  console.log(`🔗 Test URL: http://localhost:3000/workout/${workout2.id}`);
  console.log("📊 Workout structure (Session 2):");
  console.log("   - Extended Warm-up: 3 exercises");
  console.log("   - Superset 1: 2 exercises");
  console.log("   - Superset 2: 2 exercises");
  console.log("   - Superset 3: 2 exercises");
  console.log("   - Core Circuit: 3 exercises (4 rounds)");
  console.log("   - Total: 12 exercises, ~45-60min");

  // 16. Créer le workout Semaine 2 - Session 1
  const workout3 = await prisma.workout.create({
    data: {
      phaseId: phase.id,
      name: "Semaine 2 - Session 1",
      description: "Séance complète Force & Puissance",
      week: 2,
      session: 1,
      type: "STRENGTH",
    },
  });

  console.log("🏋️ Creating workout sections for Week 2 - Session 1...");

  // 17. SECTION 1: EXTENDED WARM-UP (Week 2 - Session 1)
  const warmupSection3 = await prisma.workoutSection.create({
    data: {
      workoutId: workout3.id,
      name: "EXTENDED WARM-UP",
      type: "WARMUP",
      order: 1,
      description: "Échauffement dynamique et activation",
    },
  });

  const warmupExercises3 = [
    { name: "Altitude Landings", sets: 3, reps: "5" },
    { name: "Ice Skaters", sets: 3, reps: "5 e/s", isUnilateral: true },
    { name: "Landmine Punch", sets: 3, reps: "5 e/s", isUnilateral: true },
  ];

  for (let i = 0; i < warmupExercises3.length; i++) {
    const ex = warmupExercises3[i];
    const exercise = exercises.find((e) => e.name === ex.name);
    if (exercise) {
      await prisma.sectionExercise.create({
        data: {
          sectionId: warmupSection3.id,
          exerciseId: exercise.id,
          order: i + 1,
          sets: ex.sets,
          reps: ex.reps,
          isUnilateral: ex.isUnilateral || false,
        },
      });
    }
  }

  // 18. SECTION 2: SUPERSET 1 (Week 2 - Session 1)
  const superset3_1 = await prisma.workoutSection.create({
    data: {
      workoutId: workout3.id,
      name: "SUPERSET 1",
      type: "SUPERSET",
      order: 2,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset3_1.id,
      exerciseId: exercises.find((e) => e.name === "KB Sumo Deadlift")!.id,
      order: 1,
      sets: 3,
      reps: "8",
      weight: 18, // Augmentation de poids
      supersetGroup: "1A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset3_1.id,
      exerciseId: exercises.find((e) => e.name === "Plank Shoulder Taps")!.id,
      order: 2,
      sets: 3,
      reps: "6 e/s",
      isUnilateral: true,
      supersetGroup: "1B",
    },
  });

  // 19. SECTION 3: SUPERSET 2 (Week 2 - Session 1)
  const superset3_2 = await prisma.workoutSection.create({
    data: {
      workoutId: workout3.id,
      name: "SUPERSET 2",
      type: "SUPERSET",
      order: 3,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset3_2.id,
      exerciseId: exercises.find((e) => e.name === "Strict Press Ups")!.id,
      order: 1,
      sets: 3,
      reps: "10",
      supersetGroup: "2A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset3_2.id,
      exerciseId: exercises.find((e) => e.name === "TRX Row")!.id,
      order: 2,
      sets: 3,
      reps: "12",
      supersetGroup: "2B",
    },
  });

  // 20. SECTION 4: SUPERSET 3 (Week 2 - Session 1)
  const superset3_3 = await prisma.workoutSection.create({
    data: {
      workoutId: workout3.id,
      name: "SUPERSET 3",
      type: "SUPERSET",
      order: 4,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset3_3.id,
      exerciseId: exercises.find((e) => e.name === "Goblet Split Squat")!.id,
      order: 1,
      sets: 3,
      reps: "12",
      isUnilateral: true,
      supersetGroup: "3A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset3_3.id,
      exerciseId: exercises.find((e) => e.name === "Band Pull Aparts")!.id,
      order: 2,
      sets: 3,
      reps: "10",
      supersetGroup: "3B",
    },
  });

  // 21. SECTION 5: CORE CIRCUIT (Week 2 - Session 1)
  const coreCircuit3 = await prisma.workoutSection.create({
    data: {
      workoutId: workout3.id,
      name: "CORE CIRCUIT",
      type: "CIRCUIT",
      order: 5,
      description: "3 à 4 séries sans pause entre exercices",
      isCircuit: true,
      circuitSets: 4,
      restBetweenSets: 120, // repos entre tours de circuit
    },
  });

  const coreExercises3 = [
    { name: "Palloff Press", reps: "6 e/s", isUnilateral: true },
    { name: "Hand Elevated Plank Hold", duration: 30 },
    { name: "Leg Lowers", reps: "10" },
  ];

  for (let i = 0; i < coreExercises3.length; i++) {
    const ex = coreExercises3[i];
    const exercise = exercises.find((e) => e.name === ex.name);
    if (exercise) {
      await prisma.sectionExercise.create({
        data: {
          sectionId: coreCircuit3.id,
          exerciseId: exercise.id,
          order: i + 1,
          sets: 1, // 1 par tour de circuit
          reps: ex.reps,
          duration: ex.duration,
          isUnilateral: ex.isUnilateral || false,
        },
      });
    }
  }

  console.log(`✅ Created complete workout with ${workout3.id}`);
  console.log(`🔗 Test URL: http://localhost:3000/workout/${workout3.id}`);
  console.log("📊 Workout structure (Week 2 - Session 1):");
  console.log("   - Extended Warm-up: 3 exercises");
  console.log("   - Superset 1: 2 exercises");
  console.log("   - Superset 2: 2 exercises");
  console.log("   - Superset 3: 2 exercises");
  console.log("   - Core Circuit: 3 exercises (4 rounds)");
  console.log("   - Total: 12 exercises, ~45-60min");

  // 22. Créer le workout Semaine 2 - Session 2
  const workout4 = await prisma.workout.create({
    data: {
      phaseId: phase.id,
      name: "Semaine 2 - Session 2",
      description: "Séance complète Force & Puissance",
      week: 2,
      session: 2,
      type: "STRENGTH",
    },
  });

  console.log("🏋️ Creating workout sections for Week 2 - Session 2...");

  // 23. SECTION 1: EXTENDED WARM-UP (Week 2 - Session 2)
  const warmupSection4 = await prisma.workoutSection.create({
    data: {
      workoutId: workout4.id,
      name: "EXTENDED WARM-UP",
      type: "WARMUP",
      order: 1,
      description: "Échauffement dynamique et activation",
    },
  });

  const warmupExercises4 = [
    { name: "Box Jump", sets: 3, reps: "5" },
    { name: "Punch ISO Hold", sets: 3, reps: "5 sec", isUnilateral: true },
    { name: "Low and Fast Pogos", sets: 3, reps: "10" },
  ];

  for (let i = 0; i < warmupExercises4.length; i++) {
    const ex = warmupExercises4[i];
    const exercise = exercises.find((e) => e.name === ex.name);
    if (exercise) {
      await prisma.sectionExercise.create({
        data: {
          sectionId: warmupSection4.id,
          exerciseId: exercise.id,
          order: i + 1,
          sets: ex.sets,
          reps: ex.reps,
          isUnilateral: ex.isUnilateral || false,
        },
      });
    }
  }

  // 24. SECTION 2: SUPERSET 1 (Week 2 - Session 2)
  const superset4_1 = await prisma.workoutSection.create({
    data: {
      workoutId: workout4.id,
      name: "SUPERSET 1",
      type: "SUPERSET",
      order: 2,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset4_1.id,
      exerciseId: exercises.find((e) => e.name === "Goblet Squat")!.id,
      order: 1,
      sets: 3,
      reps: "8",
      weight: 18, // Augmentation de poids
      supersetGroup: "1A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset4_1.id,
      exerciseId: exercises.find((e) => e.name === "1/2 Deadbug")!.id,
      order: 2,
      sets: 3,
      reps: "5 e/s",
      isUnilateral: true,
      supersetGroup: "1B",
    },
  });

  // 25. SECTION 3: SUPERSET 2 (Week 2 - Session 2)
  const superset4_2 = await prisma.workoutSection.create({
    data: {
      workoutId: workout4.id,
      name: "SUPERSET 2",
      type: "SUPERSET",
      order: 3,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset4_2.id,
      exerciseId: exercises.find(
        (e) => e.name === "1/2 Kneeling DB Shoulder Press"
      )!.id,
      order: 1,
      sets: 3,
      reps: "10",
      supersetGroup: "2A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset4_2.id,
      exerciseId: exercises.find(
        (e) => e.name === "Single Arm Cable Pull Down"
      )!.id,
      order: 2,
      sets: 3,
      reps: "10",
      isUnilateral: true,
      supersetGroup: "2B",
    },
  });

  // 26. SECTION 4: SUPERSET 3 (Week 2 - Session 2)
  const superset4_3 = await prisma.workoutSection.create({
    data: {
      workoutId: workout4.id,
      name: "SUPERSET 3",
      type: "SUPERSET",
      order: 4,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset4_3.id,
      exerciseId: exercises.find((e) => e.name === "Hip Thrust March")!.id,
      order: 1,
      sets: 3,
      reps: "10",
      supersetGroup: "3A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset4_3.id,
      exerciseId: exercises.find((e) => e.name === "Band Face Pull")!.id,
      order: 2,
      sets: 3,
      reps: "12",
      supersetGroup: "3B",
    },
  });

  // 27. SECTION 5: CORE CIRCUIT (Week 2 - Session 2)
  const coreCircuit4 = await prisma.workoutSection.create({
    data: {
      workoutId: workout4.id,
      name: "CORE CIRCUIT",
      type: "CIRCUIT",
      order: 5,
      description: "3 à 4 séries sans pause entre exercices",
      isCircuit: true,
      circuitSets: 4,
      restBetweenSets: 120, // repos entre tours de circuit
    },
  });

  const coreExercises4 = [
    {
      name: "Single Arm Farmer Walks",
      reps: "10 steps e/s",
      isUnilateral: true,
    },
    { name: "Plank Shoulder Taps", reps: "8 reps e/s", isUnilateral: true },
    { name: "Supine ISO Hold", duration: 20 },
  ];

  for (let i = 0; i < coreExercises4.length; i++) {
    const ex = coreExercises4[i];
    const exercise = exercises.find((e) => e.name === ex.name);
    if (exercise) {
      await prisma.sectionExercise.create({
        data: {
          sectionId: coreCircuit4.id,
          exerciseId: exercise.id,
          order: i + 1,
          sets: 1, // 1 par tour de circuit
          reps: ex.reps,
          duration: ex.duration,
          isUnilateral: ex.isUnilateral || false,
        },
      });
    }
  }

  console.log(`✅ Created complete workout with ${workout4.id}`);
  console.log(`🔗 Test URL: http://localhost:3000/workout/${workout4.id}`);
  console.log("📊 Workout structure (Week 2 - Session 2):");
  console.log("   - Extended Warm-up: 3 exercises");
  console.log("   - Superset 1: 2 exercises");
  console.log("   - Superset 2: 2 exercises");
  console.log("   - Superset 3: 2 exercises");
  console.log("   - Core Circuit: 3 exercises (4 rounds)");
  console.log("   - Total: 12 exercises, ~45-60min");

  // 28. Créer le workout Semaine 3 - Session 1
  const workout5 = await prisma.workout.create({
    data: {
      phaseId: phase.id,
      name: "Semaine 3 - Session 1",
      description: "Séance complète Force & Puissance",
      week: 3,
      session: 1,
      type: "STRENGTH",
    },
  });

  console.log("🏋️ Creating workout sections for Week 3 - Session 1...");

  // 29. SECTION 1: EXTENDED WARM-UP (Week 3 - Session 1)
  const warmupSection5 = await prisma.workoutSection.create({
    data: {
      workoutId: workout5.id,
      name: "EXTENDED WARM-UP",
      type: "WARMUP",
      order: 1,
      description: "Échauffement dynamique et activation",
    },
  });

  const warmupExercises5 = [
    { name: "Altitude Landings", sets: 3, reps: "5" },
    { name: "Ice Skaters", sets: 3, reps: "5 e/s", isUnilateral: true },
    { name: "Landmine Punch", sets: 3, reps: "5 e/s", isUnilateral: true },
  ];

  for (let i = 0; i < warmupExercises5.length; i++) {
    const ex = warmupExercises5[i];
    const exercise = exercises.find((e) => e.name === ex.name);
    if (exercise) {
      await prisma.sectionExercise.create({
        data: {
          sectionId: warmupSection5.id,
          exerciseId: exercise.id,
          order: i + 1,
          sets: ex.sets,
          reps: ex.reps,
          isUnilateral: ex.isUnilateral || false,
        },
      });
    }
  }

  // 30. SECTION 2: SUPERSET 1 (Week 3 - Session 1)
  const superset5_1 = await prisma.workoutSection.create({
    data: {
      workoutId: workout5.id,
      name: "SUPERSET 1",
      type: "SUPERSET",
      order: 2,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset5_1.id,
      exerciseId: exercises.find((e) => e.name === "KB Sumo Deadlift")!.id,
      order: 1,
      sets: 3,
      reps: "8",
      weight: 20, // Augmentation de poids
      supersetGroup: "1A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset5_1.id,
      exerciseId: exercises.find((e) => e.name === "Plank Shoulder Taps")!.id,
      order: 2,
      sets: 3,
      reps: "6 e/s",
      isUnilateral: true,
      supersetGroup: "1B",
    },
  });

  // 31. SECTION 3: SUPERSET 2 (Week 3 - Session 1)
  const superset5_2 = await prisma.workoutSection.create({
    data: {
      workoutId: workout5.id,
      name: "SUPERSET 2",
      type: "SUPERSET",
      order: 3,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset5_2.id,
      exerciseId: exercises.find((e) => e.name === "Strict Press Ups")!.id,
      order: 1,
      sets: 3,
      reps: "10",
      supersetGroup: "2A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset5_2.id,
      exerciseId: exercises.find((e) => e.name === "TRX Row")!.id,
      order: 2,
      sets: 3,
      reps: "12",
      supersetGroup: "2B",
    },
  });

  // 32. SECTION 4: SUPERSET 3 (Week 3 - Session 1)
  const superset5_3 = await prisma.workoutSection.create({
    data: {
      workoutId: workout5.id,
      name: "SUPERSET 3",
      type: "SUPERSET",
      order: 4,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset5_3.id,
      exerciseId: exercises.find((e) => e.name === "Goblet Split Squat")!.id,
      order: 1,
      sets: 3,
      reps: "12",
      isUnilateral: true,
      supersetGroup: "3A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset5_3.id,
      exerciseId: exercises.find((e) => e.name === "Band Pull Aparts")!.id,
      order: 2,
      sets: 3,
      reps: "10",
      supersetGroup: "3B",
    },
  });

  // 33. SECTION 5: CORE CIRCUIT (Week 3 - Session 1)
  const coreCircuit5 = await prisma.workoutSection.create({
    data: {
      workoutId: workout5.id,
      name: "CORE CIRCUIT",
      type: "CIRCUIT",
      order: 5,
      description: "3 à 4 séries sans pause entre exercices",
      isCircuit: true,
      circuitSets: 4,
      restBetweenSets: 120, // repos entre tours de circuit
    },
  });

  const coreExercises5 = [
    { name: "Palloff Press", reps: "6 e/s", isUnilateral: true },
    { name: "Hand Elevated Plank Hold", duration: 30 },
    { name: "Leg Lowers", reps: "10" },
  ];

  for (let i = 0; i < coreExercises5.length; i++) {
    const ex = coreExercises5[i];
    const exercise = exercises.find((e) => e.name === ex.name);
    if (exercise) {
      await prisma.sectionExercise.create({
        data: {
          sectionId: coreCircuit5.id,
          exerciseId: exercise.id,
          order: i + 1,
          sets: 1, // 1 par tour de circuit
          reps: ex.reps,
          duration: ex.duration,
          isUnilateral: ex.isUnilateral || false,
        },
      });
    }
  }

  console.log(`✅ Created complete workout with ${workout5.id}`);
  console.log(`🔗 Test URL: http://localhost:3000/workout/${workout5.id}`);
  console.log("📊 Workout structure (Week 3 - Session 1):");
  console.log("   - Extended Warm-up: 3 exercises");
  console.log("   - Superset 1: 2 exercises");
  console.log("   - Superset 2: 2 exercises");
  console.log("   - Superset 3: 2 exercises");
  console.log("   - Core Circuit: 3 exercises (4 rounds)");
  console.log("   - Total: 12 exercises, ~45-60min");

  // 34. Créer le workout Semaine 3 - Session 2
  const workout6 = await prisma.workout.create({
    data: {
      phaseId: phase.id,
      name: "Semaine 3 - Session 2",
      description: "Séance complète Force & Puissance",
      week: 3,
      session: 2,
      type: "STRENGTH",
    },
  });

  console.log("🏋️ Creating workout sections for Week 3 - Session 2...");

  // 35. SECTION 1: EXTENDED WARM-UP (Week 3 - Session 2)
  const warmupSection6 = await prisma.workoutSection.create({
    data: {
      workoutId: workout6.id,
      name: "EXTENDED WARM-UP",
      type: "WARMUP",
      order: 1,
      description: "Échauffement dynamique et activation",
    },
  });

  const warmupExercises6 = [
    { name: "Box Jump", sets: 3, reps: "5" },
    { name: "Punch ISO Hold", sets: 3, reps: "5 sec", isUnilateral: true },
    { name: "Low and Fast Pogos", sets: 3, reps: "10" },
  ];

  for (let i = 0; i < warmupExercises6.length; i++) {
    const ex = warmupExercises6[i];
    const exercise = exercises.find((e) => e.name === ex.name);
    if (exercise) {
      await prisma.sectionExercise.create({
        data: {
          sectionId: warmupSection6.id,
          exerciseId: exercise.id,
          order: i + 1,
          sets: ex.sets,
          reps: ex.reps,
          isUnilateral: ex.isUnilateral || false,
        },
      });
    }
  }

  // 36. SECTION 2: SUPERSET 1 (Week 3 - Session 2)
  const superset6_1 = await prisma.workoutSection.create({
    data: {
      workoutId: workout6.id,
      name: "SUPERSET 1",
      type: "SUPERSET",
      order: 2,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset6_1.id,
      exerciseId: exercises.find((e) => e.name === "Goblet Squat")!.id,
      order: 1,
      sets: 3,
      reps: "8",
      weight: 20, // Augmentation de poids
      supersetGroup: "1A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset6_1.id,
      exerciseId: exercises.find((e) => e.name === "1/2 Deadbug")!.id,
      order: 2,
      sets: 3,
      reps: "5 e/s",
      isUnilateral: true,
      supersetGroup: "1B",
    },
  });

  // 37. SECTION 3: SUPERSET 2 (Week 3 - Session 2)
  const superset6_2 = await prisma.workoutSection.create({
    data: {
      workoutId: workout6.id,
      name: "SUPERSET 2",
      type: "SUPERSET",
      order: 3,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset6_2.id,
      exerciseId: exercises.find(
        (e) => e.name === "1/2 Kneeling DB Shoulder Press"
      )!.id,
      order: 1,
      sets: 3,
      reps: "10",
      supersetGroup: "2A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset6_2.id,
      exerciseId: exercises.find(
        (e) => e.name === "Single Arm Cable Pull Down"
      )!.id,
      order: 2,
      sets: 3,
      reps: "10",
      isUnilateral: true,
      supersetGroup: "2B",
    },
  });

  // 38. SECTION 4: SUPERSET 3 (Week 3 - Session 2)
  const superset6_3 = await prisma.workoutSection.create({
    data: {
      workoutId: workout6.id,
      name: "SUPERSET 3",
      type: "SUPERSET",
      order: 4,
      restBetweenSets: 90,
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset6_3.id,
      exerciseId: exercises.find((e) => e.name === "Hip Thrust March")!.id,
      order: 1,
      sets: 3,
      reps: "10",
      supersetGroup: "3A",
    },
  });

  await prisma.sectionExercise.create({
    data: {
      sectionId: superset6_3.id,
      exerciseId: exercises.find((e) => e.name === "Band Face Pull")!.id,
      order: 2,
      sets: 3,
      reps: "12",
      supersetGroup: "3B",
    },
  });

  // 39. SECTION 5: CORE CIRCUIT (Week 3 - Session 2)
  const coreCircuit6 = await prisma.workoutSection.create({
    data: {
      workoutId: workout6.id,
      name: "CORE CIRCUIT",
      type: "CIRCUIT",
      order: 5,
      description: "3 à 4 séries sans pause entre exercices",
      isCircuit: true,
      circuitSets: 4,
      restBetweenSets: 120, // repos entre tours de circuit
    },
  });

  const coreExercises6 = [
    {
      name: "Single Arm Farmer Walks",
      reps: "10 steps e/s",
      isUnilateral: true,
    },
    { name: "Plank Shoulder Taps", reps: "8 reps e/s", isUnilateral: true },
    { name: "Supine ISO Hold", duration: 20 },
  ];

  for (let i = 0; i < coreExercises6.length; i++) {
    const ex = coreExercises6[i];
    const exercise = exercises.find((e) => e.name === ex.name);
    if (exercise) {
      await prisma.sectionExercise.create({
        data: {
          sectionId: coreCircuit6.id,
          exerciseId: exercise.id,
          order: i + 1,
          sets: 1, // 1 par tour de circuit
          reps: ex.reps,
          duration: ex.duration,
          isUnilateral: ex.isUnilateral || false,
        },
      });
    }
  }

  console.log(`✅ Created complete workout with ${workout6.id}`);
  console.log(`🔗 Test URL: http://localhost:3000/workout/${workout6.id}`);
  console.log("📊 Workout structure (Week 3 - Session 2):");
  console.log("   - Extended Warm-up: 3 exercises");
  console.log("   - Superset 1: 2 exercises");
  console.log("   - Superset 2: 2 exercises");
  console.log("   - Superset 3: 2 exercises");
  console.log("   - Core Circuit: 3 exercises (4 rounds)");
  console.log("   - Total: 12 exercises, ~45-60min");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
