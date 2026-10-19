import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CalculatorInputSchema, runCalculation } from "@/lib/calculations/calculate";
import type { CalculatorInput } from "@/types/calculator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = CalculatorInputSchema.parse(body) as CalculatorInput;
    return NextResponse.json(await runCalculation(input));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Calculation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
