-- Enable pg_trgm extension for fuzzy text search (typo tolerance)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Trigram indexes on car make names (brand search)
CREATE INDEX IF NOT EXISTS idx_car_make_name_trgm
  ON "dataCarFR"."car_make" USING gin(name gin_trgm_ops);

-- Trigram indexes on car model names (model search)
CREATE INDEX IF NOT EXISTS idx_car_model_name_trgm
  ON "dataCarFR"."car_model" USING gin(name gin_trgm_ops);

-- Trigram indexes on car generation names
CREATE INDEX IF NOT EXISTS idx_car_generation_name_trgm
  ON "dataCarFR"."car_generation" USING gin(name gin_trgm_ops);
