import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoaderComponant from "./loader";

const ListSpecification = ({
  data,
  isPending,
  isError,
}: {
  data: any;
  isPending: boolean;
  isError: any;
}) => {
  return (
    <>
      {isPending ? (
        <div className="text-center w-full py-32">
          <LoaderComponant />
        </div>
      ) : isError ? (
        <div className="text-center w-full py-32">
          Erreur : Une erreur s&apos;est produite
        </div>
      ) : !data || !data.data || data.data.length === 0 ? (
        <div className="text-center w-full py-32">Aucun résultat trouvé</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.data.map((generation: any) => (
            <Link
              href={`/specification/${generation.id_car_generation}`}
              key={generation.id_car_generation}
            >
              <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>
                    {generation.carModel.carMake.name}{" "}
                    {generation.carModel.name}{" "}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{generation.name}</CardDescription>

                  <p>Marque : {generation.carModel.carMake.name}</p>
                  <p>Modèle : {generation.carModel.name}</p>
                  <p>Génération : {generation.name}</p>
                  <p>
                    Période : {generation.year_begin} -{" "}
                    {generation.year_end || "présent"}
                  </p>
                  <p>Type : {generation.carType?.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default ListSpecification;
