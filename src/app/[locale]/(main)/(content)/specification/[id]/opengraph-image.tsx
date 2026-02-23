import { ImageResponse } from "next/og";
import prisma from "@/prisma";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Fiche technique VoitureConnect";

type Props = { params: Promise<{ id: string }> };

export default async function Image({ params }: Props) {
  const { id } = await params;

  const generation = await prisma.carGenerationFR
    .findUnique({
      where: { id_car_generation: parseInt(id) },
      select: {
        name: true,
        year_begin: true,
        year_end: true,
        carModel: {
          select: {
            name: true,
            carMake: { select: { name: true, logo_url: true } },
          },
        },
      },
    })
    .catch(() => null);

  const makeName = generation?.carModel?.carMake?.name ?? "";
  const modelName = generation?.carModel?.name ?? "";
  const genName = generation?.name ?? "";
  const logoUrl = generation?.carModel?.carMake?.logo_url ?? null;
  const yearBegin = generation?.year_begin ?? "?";
  const yearEnd = generation?.year_end ?? "présent";
  const initial = makeName.charAt(0).toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0f172a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background circles */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 500,
            height: 500,
            borderRadius: 250,
            backgroundColor: "#1e3a5f",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: "#172554",
            opacity: 0.4,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            padding: "56px 64px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          {/* Top: brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: "#3b82f6",
              }}
            />
            <span
              style={{
                color: "#64748b",
                fontSize: 22,
                fontFamily: "sans-serif",
              }}
            >
              VoitureConnect · Fiche technique
            </span>
          </div>

          {/* Center: logo + name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 40,
            }}
          >
            {/* Logo or initial */}
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt=""
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "contain",
                  borderRadius: 24,
                  backgroundColor: "#1e293b",
                  padding: 12,
                }}
              />
            ) : (
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 24,
                  backgroundColor: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 56,
                  fontWeight: 700,
                  fontFamily: "sans-serif",
                }}
              >
                {initial}
              </div>
            )}

            {/* Make / Model / Gen */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 700,
                  color: "#f8fafc",
                  lineHeight: 1.05,
                  fontFamily: "sans-serif",
                }}
              >
                {makeName} {modelName}
              </div>
              <div
                style={{
                  fontSize: 30,
                  color: "#94a3b8",
                  fontFamily: "sans-serif",
                }}
              >
                {genName}
              </div>
              {/* Year badge */}
              <div
                style={{
                  display: "flex",
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    backgroundColor: "#1e3a5f",
                    border: "1px solid #2d5a8e",
                    borderRadius: 8,
                    padding: "6px 16px",
                    color: "#93c5fd",
                    fontSize: 22,
                    fontFamily: "sans-serif",
                    display: "flex",
                  }}
                >
                  {yearBegin} — {yearEnd}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: tagline */}
          <div
            style={{
              color: "#475569",
              fontSize: 20,
              fontFamily: "sans-serif",
            }}
          >
            Caractéristiques · Performances · Analyse IA · voitureconnect.fr
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
