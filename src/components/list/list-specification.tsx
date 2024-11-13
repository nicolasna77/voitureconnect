import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoaderComponant from "../component/loader";
import { CalendarIcon } from "@radix-ui/react-icons";
import { CarIcon } from "lucide-react";
import { Badge } from "../ui/badge";

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
              key={generation.id_car_generation}
              href={`/specification/${generation.id_car_generation}`}
              className="block"
            >
              <Card className="mb-4 transition-shadow duration-300 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                      {generation.carModel.carMake.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {generation.carModel.carMake.name}{" "}
                        {generation.carModel.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {generation.name}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {generation.year_begin} -{" "}
                        {generation.year_end || "présent"}
                      </span>
                    </div>
                    {generation.carType && (
                      <div className="flex items-center">
                        <CarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">
                          {generation.carType.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <Badge variant="secondary" className="mr-2">
                      {generation.carModel.carMake.name}
                    </Badge>
                    <Badge variant="outline">{generation.carModel.name}</Badge>
                  </div>
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
