import { Ad, Address, User } from "@prisma/client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

const UserInfo = ({
  item,
}: {
  item: Ad & {
    User: User;
    address: Address;
  };
}) => {
  console.log(item);
  return (
    <Link href={`/profile/${item.id}`} className="block group">
      <div className="flex items-center space-x-4 p-4 rounded-lg transition-colors duration-200 hover:bg-accent/50">
        <Avatar className="w-10 h-10">
          <AvatarFallback>{item.User.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-md font-medium leading-none truncate group-hover:underline">
            {item.User.name}
          </p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate">
              {item.address?.city}, {item.address?.state}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {item.address?.street}, {item.address?.zip}
          </p>

          <p className="text-sm text-muted-foreground mt-1">Particulier</p>
        </div>
        <Button size="icon" variant="ghost" aria-label="View user profile">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Link>
  );
};

export default UserInfo;
