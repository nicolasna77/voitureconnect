export interface VehicleData {
  type?: string;
  make?: string;
  model?: string;
  generation?: string;
  serie?: string;
  trim?: string;
  equipment?: string;
  yearBegin?: string;
  yearEnd?: string;
  specifications?: {
    name: string;
    value: string;
    unit?: string;
  }[];
}

export function formatVehicleContext(vehicle: VehicleData, locale: 'fr' | 'en'): string {
  const labels = locale === 'fr' ? {
    type: 'Type',
    make: 'Marque',
    model: 'Modele',
    generation: 'Generation',
    serie: 'Serie',
    trim: 'Finition',
    equipment: 'Equipement',
    productionYears: 'Annees de production',
    specifications: 'Specifications techniques',
  } : {
    type: 'Type',
    make: 'Make',
    model: 'Model',
    generation: 'Generation',
    serie: 'Series',
    trim: 'Trim',
    equipment: 'Equipment',
    productionYears: 'Production years',
    specifications: 'Technical specifications',
  };

  let context = '';

  if (vehicle.type) context += `${labels.type}: ${vehicle.type}\n`;
  if (vehicle.make) context += `${labels.make}: ${vehicle.make}\n`;
  if (vehicle.model) context += `${labels.model}: ${vehicle.model}\n`;
  if (vehicle.generation) context += `${labels.generation}: ${vehicle.generation}\n`;
  if (vehicle.serie) context += `${labels.serie}: ${vehicle.serie}\n`;
  if (vehicle.trim) context += `${labels.trim}: ${vehicle.trim}\n`;
  if (vehicle.equipment) context += `${labels.equipment}: ${vehicle.equipment}\n`;

  if (vehicle.yearBegin || vehicle.yearEnd) {
    const years = [vehicle.yearBegin, vehicle.yearEnd].filter(Boolean).join(' - ');
    context += `${labels.productionYears}: ${years}\n`;
  }

  if (vehicle.specifications && vehicle.specifications.length > 0) {
    context += `\n${labels.specifications}:\n`;
    for (const spec of vehicle.specifications) {
      const unit = spec.unit && spec.unit !== 'NULL' ? ` ${spec.unit}` : '';
      context += `- ${spec.name}: ${spec.value}${unit}\n`;
    }
  }

  return context;
}

export function formatVehicleContextFromDb(data: {
  carType?: { name: string } | null;
  carMake?: { name: string } | null;
  carModel?: { name: string } | null;
  carGeneration?: { name: string; year_begin?: string | null; year_end?: string | null } | null;
  carSerie?: { name: string } | null;
  carTrim?: { name: string; specifications?: { carSpecification: { name: string }; value: string; unit?: string | null }[] } | null;
  carEquipment?: { name: string } | null;
}, locale: 'fr' | 'en'): string {
  const vehicle: VehicleData = {
    type: data.carType?.name,
    make: data.carMake?.name,
    model: data.carModel?.name,
    generation: data.carGeneration?.name,
    serie: data.carSerie?.name,
    trim: data.carTrim?.name,
    equipment: data.carEquipment?.name,
    yearBegin: data.carGeneration?.year_begin ?? undefined,
    yearEnd: data.carGeneration?.year_end ?? undefined,
    specifications: data.carTrim?.specifications?.map(spec => ({
      name: spec.carSpecification.name,
      value: spec.value,
      unit: spec.unit ?? undefined,
    })),
  };

  return formatVehicleContext(vehicle, locale);
}
