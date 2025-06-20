import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const firstWorkout = await prisma.workout.findFirst({
      orderBy: [{ week: "asc" }, { session: "asc" }],
    });

    if (!firstWorkout) {
      return NextResponse.json({ error: "No workout found" }, { status: 404 });
    }

    return NextResponse.json({ id: firstWorkout.id });
  } catch (error) {
    console.error("Error fetching first workout:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
