import type { Specification } from "./types";

export function SpecificationGrid({
  specifications,
}: {
  specifications: Specification[];
}) {
  if (!specifications?.length) return null;

  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
      {specifications.map((spec) => (
        <div
          key={spec.name}
          className="flex items-start justify-between gap-4 py-2.5 border-b border-dashed border-muted last:border-0"
        >
          <dt className="text-sm text-muted-foreground shrink-0">
            {spec.name}
          </dt>
          <dd className="text-sm font-semibold tabular-nums text-right">
            {spec.value?.replace(/NULL$/i, "")}
            {spec.unit && spec.unit !== "NULL" && (
              <span className="text-muted-foreground font-normal ml-1">
                {spec.unit}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
