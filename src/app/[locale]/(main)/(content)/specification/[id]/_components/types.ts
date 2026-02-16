export interface Specification {
  name: string;
  value: string;
  unit: string | null;
}

export interface CarTrim {
  id_car_trim: number;
  name: string;
  specificationsByCategory: Record<string, Specification[]>;
}

export interface CarSerie {
  id_car_serie: number;
  name: string;
  trims: CarTrim[];
  commonSpecifications: Record<string, Specification[]>;
}

export interface Generation {
  id_car_generation: number;
  name: string;
  year_begin: string | null;
  year_end: string | null;
  carModel: {
    name: string;
    carMake: {
      name: string;
      logo_url: string | null;
    };
  };
  series: CarSerie[];
}
