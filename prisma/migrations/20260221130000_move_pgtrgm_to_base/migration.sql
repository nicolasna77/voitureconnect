-- Move pg_trgm to the 'base' schema so Prisma can resolve similarity() / word_similarity()
-- (Prisma sets search_path=base from DATABASE_URL ?schema=base)
ALTER EXTENSION pg_trgm SET SCHEMA base;
