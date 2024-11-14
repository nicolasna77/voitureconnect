"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Car as CarModel, User } from "@prisma/client";
import axios from "axios";
import LoaderComponant from "@/components/component/loader";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale/fr";

type DetailProfilProps = {
  params: { uid: string };
};

function DetailProfil({ params }: DetailProfilProps) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<
    User & {
      Car: (CarModel & {
        make: string;
        model: string;
      })[];
    }
  >({
    queryKey: ["user", params.uid],
    queryFn: () => axios.get(`/api/user/${params.uid}`).then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderComponant />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Une erreur est survenue lors du chargement du profil
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Utilisateur non trouvé
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-32 h-32 border-4 border-primary">
              <AvatarImage src={user.picture} alt={`Photo de ${user.name}`} />
              <AvatarFallback>
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">
                Membre depuis{" "}
                {formatDistance(user.createdAt, new Date(), {
                  locale: fr,
                  addSuffix: true,
                })}
              </p>
              <div className="flex space-x-2 mt-4">
                <Button>Suivre</Button>
                <Button variant="outline">Message</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Collection de voitures</CardTitle>
            </CardHeader>
            <CardContent>
              {user.Car.length === 0 ? (
                <p className="text-muted-foreground">
                  Aucune voiture dans la collection
                </p>
              ) : (
                <ul className="space-y-2">
                  {user.Car.map((car) => (
                    <li key={car.id} className="flex items-center space-x-2">
                      <CarIcon size={16} />
                      <span>
                        {car.year} {car.make} {car.model} - {car.color}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DetailProfil;
