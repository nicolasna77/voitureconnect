"use client";
import { PageHeader } from "@/components/page-header";

import { DeleteAccountForm } from "./delete-account-form";
import { DisplayNameForm } from "./display-name-form";
import { Session } from "next-auth";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function Profile() {
  const session = useCurrentUser();
  return (
    <div className="space-y-2">
      <PageHeader
        title="Profile"
        description="Manage your personal information."
      />
      <DisplayNameForm session={session || ({} as Session)} />

      <DeleteAccountForm session={session || ({} as Session)} />
    </div>
  );
}
