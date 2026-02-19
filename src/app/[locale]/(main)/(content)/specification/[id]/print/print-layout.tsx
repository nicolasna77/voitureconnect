import type { Generation } from "../_components/types";

interface PrintLayoutProps {
  generation: Generation;
}

function PrintSection({
  title,
  specs,
}: {
  title: string;
  specs: { name: string; value: string; unit: string | null }[];
}) {
  if (specs.length === 0) return null;
  return (
    <section className="mb-6 break-inside-avoid">
      <h2
        style={{
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          borderBottom: "2px solid #e2e8f0",
          paddingBottom: "4px",
          marginBottom: "8px",
          color: "#475569",
        }}
      >
        {title}
      </h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
        <tbody>
          {specs.map((spec, i) => (
            <tr
              key={i}
              style={{
                backgroundColor: i % 2 === 0 ? "#f8fafc" : "white",
              }}
            >
              <td
                style={{
                  padding: "4px 8px",
                  color: "#64748b",
                  width: "50%",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {spec.name}
              </td>
              <td
                style={{
                  padding: "4px 8px",
                  fontWeight: 500,
                  color: "#0f172a",
                  width: "50%",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {spec.value}
                {spec.unit && spec.unit !== "NULL" ? ` ${spec.unit}` : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function PrintLayout({ generation }: PrintLayoutProps) {
  const makeName = generation.carModel?.carMake?.name || "";
  const modelName = generation.carModel?.name || "";
  const genName = generation.name || "";
  const yearRange = [generation.year_begin, generation.year_end]
    .filter(Boolean)
    .join(" — ");

  // Collect all specs: common first, then per-trim
  const allSections: { title: string; specs: { name: string; value: string; unit: string | null }[] }[] = [];

  for (const serie of generation.series || []) {
    // Common specs
    const commonSpecs = serie.commonSpecifications || {};
    for (const [category, specs] of Object.entries(commonSpecs)) {
      if (specs.length > 0) {
        allSections.push({ title: category, specs });
      }
    }

    // Per-trim specs (only first trim for conciseness)
    if (serie.trims.length > 0) {
      const firstTrim = serie.trims[0];
      const trimSpecs = firstTrim.specificationsByCategory || {};
      for (const [category, specs] of Object.entries(trimSpecs)) {
        if (specs.length > 0) {
          const existing = allSections.find((s) => s.title === category);
          if (existing) {
            // Merge, avoiding duplicate names
            for (const spec of specs) {
              if (!existing.specs.some((s) => s.name === spec.name)) {
                existing.specs.push(spec);
              }
            }
          } else {
            allSections.push({ title: category, specs });
          }
        }
      }
    }
  }

  return (
    <div
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        maxWidth: "210mm",
        margin: "0 auto",
        padding: "20mm",
        color: "#0f172a",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "3px solid #0f172a",
          paddingBottom: "16px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#64748b",
              marginBottom: "4px",
            }}
          >
            Fiche technique
          </p>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
            {makeName} {modelName}
          </h1>
          <p style={{ fontSize: "14px", color: "#475569", margin: "4px 0 0" }}>
            {genName}
            {yearRange && ` · ${yearRange}`}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: "9px",
              color: "#94a3b8",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            voitureconnect.fr
          </p>
          <p
            style={{
              fontSize: "9px",
              color: "#94a3b8",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>
      </header>

      {/* Specs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0 32px",
        }}
      >
        {allSections.map((section) => (
          <PrintSection
            key={section.title}
            title={section.title}
            specs={section.specs}
          />
        ))}
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #e2e8f0",
          paddingTop: "12px",
          marginTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "8px",
          color: "#94a3b8",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span>VoitureConnect — voitureconnect.fr</span>
        <span>
          Fiche générée le {new Date().toLocaleDateString("fr-FR")}
        </span>
      </footer>
    </div>
  );
}
