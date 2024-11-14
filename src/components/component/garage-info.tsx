import { Garage, Address } from "@prisma/client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

const GarageInfo = ({ garage }: { garage: Garage & { Adresse: Address } }) => {
  return (
    <Link href={`/search/pro/${garage.id}`} className=" group">
      <div className="flex items-center gap-6 p-4 my-4 rounded-lg transition-colors duration-200 hover:bg-accent/50">
        <Avatar className="w-16 h-16 border-2 border-primary/10">
          <AvatarFallback className="text-lg font-medium">
            {garage.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors truncate">
            {garage.name}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate">
              {garage.Adresse.city}, {garage.Adresse.state}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {garage.Adresse.street}, {garage.Adresse.zip}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto flex-shrink-0"
          aria-label="View garage details"
        >
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </Link>
  );
};

export default GarageInfo;
