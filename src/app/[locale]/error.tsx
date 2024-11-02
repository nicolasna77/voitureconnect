"use client";

import { useSearchParams } from "next/navigation";

enum Erreur {
  Configuration = "Configuration",
}

const mapErreurs = {
  [Erreur.Configuration]: (
    <p>
      Un problème est survenu lors de l&apos;authentification. Veuillez nous
      contacter si cette erreur persiste. Code d&apos;erreur unique :{" "}
      <code className="rounded-sm bg-slate-100 p-1 text-xs">Configuration</code>
    </p>
  ),
};

export default function PageErreurAuth() {
  const recherche = useSearchParams();
  const erreur = recherche.get("error") as Erreur;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <a
        href="#"
        className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Quelque chose s&apos;est mal passé
        </h5>
        <div className="font-normal text-gray-700 dark:text-gray-400">
          {mapErreurs[erreur] ||
            "Veuillez nous contacter si cette erreur persiste."}
        </div>
      </a>
    </div>
  );
}
