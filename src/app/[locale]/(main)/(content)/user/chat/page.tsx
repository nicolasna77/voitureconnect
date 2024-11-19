import React from "react";
import { Button } from "../../../../../../components/ui/button";
import {
  PhoneIcon,
  PlusIcon,
  SendIcon,
  SettingsIcon,
  VideoIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
const ChatPage = () => {
  return (
    <div>
      <div className="p-3 flex border-b items-center">
        <div className="flex items-center gap-2">
          <Avatar className="border w-10 h-10">
            <AvatarImage src="/placeholder-user.jpg" alt="Image" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <p className="text-sm font-medium leading-none">Sofia Davis</p>
            <p className="text-xs text-muted-foreground">Active 2h ago</p>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Button variant="ghost" size="icon">
            <PhoneIcon className="h-4 w-4" />
            <span className="sr-only">Call</span>
          </Button>
          <Button variant="ghost" size="icon">
            <VideoIcon className="h-4 w-4" />
            <span className="sr-only">Video call</span>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 p-3">
        <div className="flex w-max max-w-[65%] flex-col gap-2 rounded-full px-4 py-2 text-sm ml-auto bg-primary text-primary-foreground">
          Hey hope you&apos;re doing well! We should catch up sometime soon. 🙏
        </div>
        <div className="flex w-max max-w-[65%] flex-col gap-2 rounded-full px-4 py-2 text-sm bg-muted">
          Sure! I&apos;m free this weekend if you want to grab a coffee.
        </div>
        <div className="flex w-max max-w-[65%] flex-col gap-2 rounded-xl overflow-hidden text-sm ml-auto">
          <Image
            src="/placeholder.svg"
            alt="photo"
            width={200}
            height={150}
            className="object-cover"
            style={{ aspectRatio: "200/150", objectFit: "cover" }}
          />
        </div>
        <div className="flex w-max max-w-[65%] flex-col gap-2 rounded-full px-4 py-2 text-sm ml-auto bg-primary text-primary-foreground">
          Sounds good! Let&apos;s meet at the Starbucks on 5th Ave.
        </div>
        <div className="flex w-max max-w-[65%] flex-col gap-2 rounded-full px-4 py-2 text-sm bg-muted">
          I&apos;ll message you on Saturday.
        </div>
      </div>
      <div className="border-t  ">
        <form className="flex w-full items-center space-x-2 p-3">
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit" size="icon">
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
};
export default ChatPage;
