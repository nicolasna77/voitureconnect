import { doLogout } from "@/lib/actions";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

const SignoutButton = () => {
  return (
    <form action={doLogout}>
      <Button variant={"outline"} type="submit">
        <LogOut /> Déconnexion
      </Button>
    </form>
  );
};

export default SignoutButton;
