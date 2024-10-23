import { PageHeader } from "@/components/page-header";

import { DeleteAccountForm } from "./delete-account-form";
import { DisplayNameForm } from "./display-name-form";
import { auth } from "@/lib/auth";

export default async function Profile() {
  const session = await auth();
  return (
    <div className="space-y-2">
      <PageHeader
        title="Profile"
        description="Manage your personal information."
      />

      <DisplayNameForm displayName={session?.user?.name ?? ""} />

      <DeleteAccountForm userId={session?.user?.id ?? ""} />
    </div>
  );
}
