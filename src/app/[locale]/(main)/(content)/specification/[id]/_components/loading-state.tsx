import LoaderComponent from "@/components/component/loader";

export function LoadingState() {
  return (
    <div
      className="container mx-auto py-16 flex flex-col items-center justify-center gap-4"
      role="status"
      aria-label="Chargement de la fiche technique"
    >
      <LoaderComponent />
      <p className="text-muted-foreground">
        Chargement de la fiche technique…
      </p>
    </div>
  );
}
