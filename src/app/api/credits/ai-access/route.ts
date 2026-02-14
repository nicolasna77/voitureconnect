import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/prisma";
import { AI_ANALYSIS_CREDIT_COST } from "@/config/credits";

export interface AIAccessResponse {
  hasAccess: boolean;
  isAuthenticated: boolean;
  creditBalance: number;
  creditCost: number;
  userRole: string | null;
  requiresCredits: boolean;
}

export async function GET(req: NextRequest): Promise<NextResponse<AIAccessResponse | { error: string }>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({
        hasAccess: false,
        isAuthenticated: false,
        creditBalance: 0,
        creditCost: AI_ANALYSIS_CREDIT_COST,
        userRole: null,
        requiresCredits: true,
      });
    }

    const { searchParams } = new URL(req.url);
    const generationId = searchParams.get("generationId");

    if (!generationId) {
      return NextResponse.json(
        { error: "generationId manquant" },
        { status: 400 }
      );
    }

    // Fetch user with role and credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const userRole = user?.role || "USER";

    // ADMIN and PRO users have FREE access to AI features
    if (userRole === "ADMIN" || userRole === "PRO") {
      return NextResponse.json({
        hasAccess: true,
        isAuthenticated: true,
        creditBalance: Infinity,
        creditCost: 0,
        userRole,
        requiresCredits: false,
      });
    }

    // USER role: check if they have already purchased AI access for this generation
    // or if they have enough credits
    const [aiAccess, userCredit] = await Promise.all([
      prisma.specificationAccess.findUnique({
        where: {
          userId_specificationId_specificationType: {
            userId: session.user.id,
            specificationId: parseInt(generationId, 10),
            specificationType: "ai_analysis",
          },
        },
      }),
      prisma.userCredit.findUnique({
        where: { userId: session.user.id },
      }),
    ]);

    const creditBalance = userCredit?.balance || 0;
    const hasAlreadyPurchased = !!aiAccess;

    return NextResponse.json({
      hasAccess: hasAlreadyPurchased,
      isAuthenticated: true,
      creditBalance,
      creditCost: AI_ANALYSIS_CREDIT_COST,
      userRole,
      requiresCredits: true,
    });
  } catch (error) {
    console.error("AI Access check error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la verification" },
      { status: 500 }
    );
  }
}
