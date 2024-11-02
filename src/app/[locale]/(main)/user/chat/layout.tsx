import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function ChatLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[300px_1fr] w-full  relative  rounded-lg overflow-hidden border">
      <div className="bg-muted/20 p-3 border-r">
        <div className="flex items-center justify-between space-x-4">
          <div className="font-medium text-sm">Messenger</div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only">New conversation</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <SettingsIcon className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
        <div className="py-4">
          <form>
            <Input placeholder="Search" className="h-8" />
          </form>
        </div>
        <div className="grid gap-2">
          <Link
            href="#"
            className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 bg-muted"
            prefetch={false}
          >
            <Avatar className="border w-10 h-10">
              <AvatarImage src="/placeholder-user.jpg" alt="Image" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
              <p className="text-sm font-medium leading-none">Sofia Davis</p>
              <p className="text-xs text-muted-foreground">
                hey what&apos;s going on? &middot; 2h
              </p>
            </div>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50"
            prefetch={false}
          >
            <Avatar className="border w-10 h-10">
              <AvatarImage src="/placeholder-user.jpg" alt="Alex's Image" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
              <p className="text-sm font-medium leading-none">Alex Johnson</p>
              <p className="text-xs text-muted-foreground">
                Just finished a great book! 📚 &middot; 45m
              </p>
            </div>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50"
            prefetch={false}
          >
            <Avatar className="border w-10 h-10">
              <AvatarImage src="/placeholder-user.jpg" alt="Maria's Image" />
              <AvatarFallback>MG</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
              <p className="text-sm font-medium leading-none">Maria Gonzalez</p>
              <p className="text-xs text-muted-foreground">
                Excited for the weekend! &middot; 1h
              </p>
            </div>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50"
            prefetch={false}
          >
            <Avatar className="border w-10 h-10">
              <AvatarImage src="/placeholder-user.jpg" alt="Kevin's Image" />
              <AvatarFallback>KB</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
              <p className="text-sm font-medium leading-none">Kevin Brown</p>
              <p className="text-xs text-muted-foreground">
                Who&apos;s up for a movie night? &middot; 3h
              </p>
            </div>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50"
            prefetch={false}
          >
            <Avatar className="border w-10 h-10">
              <AvatarImage src="/placeholder-user.jpg" alt="Lily's Image" />
              <AvatarFallback>LW</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5">
              <p className="text-sm font-medium leading-none">Lily White</p>
              <p className="text-xs text-muted-foreground">
                Morning coffee is the best! ☕ &middot; 30m
              </p>
            </div>
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}
