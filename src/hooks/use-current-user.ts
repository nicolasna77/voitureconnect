import { useSession } from "@/lib/auth-client";

export const useCurrentUser = () => {
  const { data: session, isPending } = useSession();
  return { session, isPending };
};
