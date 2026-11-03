import { NextRequest, NextResponse } from "next/server";

// Rate limiting in-memory store for check-in endpoint
const checkinRateLimitMap = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local";
    const now = Date.now();
    const lastCheckin = checkinRateLimitMap.get(ip) || 0;

    // Rate limit: Max 20 check-in calls per 5 seconds per volunteer IP to prevent brute-force
    if (now - lastCheckin < 250) {
      return NextResponse.json(
        { error: "Too many rapid scan requests. Please wait a moment." },
        { status: 429 }
      );
    }
    checkinRateLimitMap.set(ip, now);

    const body = await request.json();
    const { token, volunteerId, type } = body;

    if (!token) {
      return NextResponse.json({ error: "Missing scan token or code" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      token,
      verifiedAt: new Date().toISOString(),
      message: "Check-in processed successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process checkin request" },
      { status: 500 }
    );
  }
}
