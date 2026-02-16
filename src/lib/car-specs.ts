// Shared types and helpers for car specification processing

export interface CarSpecification {
  name: string;
  id_parent: string | null;
}

export interface SpecificationValue {
  carSpecification: CarSpecification;
  value: string;
  unit: string | null;
}

export interface CarTrim {
  id_car_trim: number;
  name: string;
  specifications: SpecificationValue[];
}

export interface TransformedSpecification {
  name: string;
  value: string;
  unit: string | null;
}

const categoryKeywords: Record<string, string[]> = {
  dimensions: [
    "longueur", "largeur", "hauteur", "empattement", "voie avant", "voie arrière", "voie ar",
    "length", "width", "height", "wheelbase", "track",
  ],
  weights: [
    "poids", "charge utile", "remorque", "coffre", "réservoir", "places", "volume",
    "weight", "payload", "trunk", "cargo", "tank", "seats",
  ],
  engine: [
    "puissance", "couple", "cylindrée", "cylindres", "soupapes", "architecture", "régime", "alimentation",
    "power", "torque", "displacement", "cylinder", "valve", "engine", "rpm",
  ],
  gearbox: [
    "boîte", "rapports", "roues motrices", "transmission",
    "gearbox", "transmission", "drive", "gear",
  ],
  fuel: [
    "carburant", "consommation", "émission", "co2",
    "fuel", "consumption", "emission",
  ],
  performance: [
    "vitesse max", "accélération", "0-100",
    "top speed", "acceleration",
  ],
  suspension: [
    "suspension", "freins", "frein", "direction",
    "brake", "steering",
  ],
  body: [
    "carrosserie", "portes",
    "body", "doors",
  ],
};

export function categorizeSpecifications(
  specifications: SpecificationValue[]
): Record<string, TransformedSpecification[]> {
  return specifications.reduce(
    (acc, spec) => {
      const specName = spec.carSpecification.name.toLowerCase();
      let category = "other";

      for (const [cat, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some((keyword) => specName.includes(keyword))) {
          category = cat;
          break;
        }
      }

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push({
        name: spec.carSpecification.name,
        value: spec.value,
        unit: spec.unit,
      });

      return acc;
    },
    {} as Record<string, TransformedSpecification[]>
  );
}

export function sortTrimsByEngineAndFinition(trims: CarTrim[]): CarTrim[] {
  return [...trims].sort((a, b) => {
    const parseEngine = (name: string) => {
      const displacementMatch = name.match(/(\d+[.,]\d+)/);
      const displacement = displacementMatch
        ? parseFloat(displacementMatch[1].replace(",", "."))
        : 999;

      let engineType = 2; // default: petrol
      if (/\b(hdi|tdi|dci|cdti|jtd|crdi|d\b|diesel|bluehdi|ecoblue|hpi)/i.test(name)) {
        engineType = 1;
      } else if (/\b(e-|electric|ev|electrique|électrique)\b/i.test(name)) {
        engineType = 3;
      } else if (/\b(hybrid|hybride|phev|plug-in)\b/i.test(name)) {
        engineType = 4;
      }

      const powerMatch = name.match(/(\d{2,3})\s*(?:ch|cv|hp|ps|bhp)/i);
      const power = powerMatch ? parseInt(powerMatch[1]) : 0;

      const finition = name
        .replace(/[\d.,]+\s*[a-zA-Zé-]*\s*\d*\s*(?:ch|cv|hp|ps|bhp)?/i, "")
        .trim();

      return { displacement, engineType, power, finition };
    };

    const ea = parseEngine(a.name);
    const eb = parseEngine(b.name);

    if (ea.engineType !== eb.engineType) return ea.engineType - eb.engineType;
    if (ea.displacement !== eb.displacement) return ea.displacement - eb.displacement;
    if (ea.power !== eb.power) return ea.power - eb.power;
    return ea.finition.localeCompare(eb.finition);
  });
}

export function getCommonSpecifications(trims: CarTrim[]): SpecificationValue[] {
  if (!trims?.length) return [];

  const firstTrimSpecs = trims[0].specifications;
  return firstTrimSpecs.filter((spec) =>
    trims.every((trim) =>
      trim.specifications.some(
        (s) =>
          s.carSpecification.name === spec.carSpecification.name &&
          s.value === spec.value &&
          s.unit === spec.unit
      )
    )
  );
}
