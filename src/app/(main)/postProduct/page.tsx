import AdForm from "../../../components/component/ad-form";
import Image from "next/image";
import React from "react";

const PagePostProduct = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6  mx-auto p-4 sm:p-6 md:p-8">
      <div className="bg-background rounded-lg  overflow-hidden">
        <div className="p-6 sm:p-8 ">
          <h1 className="text-2xl font-bold mb-4">{"Aperçu de l'annonce"}</h1>
          <div className="space-y-4">
            <Image
              alt=""
              src="/placeholder.svg"
              width={500}
              height={400}
              sizes="100vw"
            />
            <div>
              <h2 className="text-lg font-medium mb-2">
                {"Titre de l'annonce"}
              </h2>
              <p className="text-muted-foreground">
                Votre annonce aura un titre accrocheur ici.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Description</h2>
              <p className="text-muted-foreground">
                Vous pourrez décrire en détail votre produit ou service ici.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Détails</h2>
              <p className="text-muted-foreground">
                Les informations importantes sur votre offre seront affichées
                ici.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-background rounded-lg shadow-lg">
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold mb-4">Créer une annonce</h1>
          <AdForm />
        </div>
      </div>
    </div>
  );
};
export default PagePostProduct;
