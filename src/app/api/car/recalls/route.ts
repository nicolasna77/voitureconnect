import { NextRequest, NextResponse } from "next/server";

interface NHTSARecall {
  NHTSACampaignNumber: string;
  Component: string;
  Summary: string;
  Consequence: string;
  Remedy: string;
  ReportReceivedDate: string;
  Manufacturer: string;
  ModelYear: string;
}

interface NHTSAResponse {
  Count: number;
  Message: string;
  results: NHTSARecall[];
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const make = searchParams.get("make");
    const model = searchParams.get("model");

    if (!make || !model) {
      return NextResponse.json(
        { error: "Paramètres make et model requis" },
        { status: 400 }
      );
    }

    const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`;

    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache 24h
    });

    if (!response.ok) {
      return NextResponse.json({ recalls: [], count: 0 });
    }

    const data: NHTSAResponse = await response.json();

    const recalls = (data.results || [])
      .sort(
        (a, b) =>
          new Date(b.ReportReceivedDate).getTime() -
          new Date(a.ReportReceivedDate).getTime()
      )
      .map((r) => ({
        campaignNumber: r.NHTSACampaignNumber,
        component: r.Component,
        summary: r.Summary,
        consequence: r.Consequence,
        remedy: r.Remedy,
        date: r.ReportReceivedDate,
        manufacturer: r.Manufacturer,
        modelYear: r.ModelYear,
      }));

    return NextResponse.json({
      recalls,
      count: data.Count || 0,
    });
  } catch (error) {
    console.error("NHTSA Recalls error:", error);
    return NextResponse.json({ recalls: [], count: 0 });
  }
}
