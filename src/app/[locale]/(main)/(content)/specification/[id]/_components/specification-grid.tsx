import type { Specification } from "./types";

export function SpecificationGrid({
  specifications,
}: {
  specifications: Specification[];
}) {
  if (!specifications?.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
      {specifications.map((spec, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-2.5 border-b border-dashed border-muted last:border-0"
        >
          <span className="text-sm text-muted-foreground truncate mr-4">
            {spec.name}
          </span>
          <span className="text-sm font-semibold tabular-nums whitespace-nowrap">
            {spec.value?.replace(/NULL$/i, "")}
            {spec.unit && spec.unit !== "NULL" && (
              <span className="text-muted-foreground font-normal ml-1">
                {spec.unit}
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
