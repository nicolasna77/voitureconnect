import { RefreshCcw } from "lucide-react";

import { useRouter } from "next/navigation";

import { usePathname } from "next/navigation";

import { useCallback } from "react";
import { Button } from "../ui/button";

const ResetButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleReset = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return (
    <Button variant="outline" size="sm" onClick={handleReset}>
      <RefreshCcw className="h-4 w-4" />
      <span>Réinitialiser</span>
    </Button>
  );
};
export default ResetButton;
