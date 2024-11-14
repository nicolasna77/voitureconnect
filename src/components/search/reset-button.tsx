import { RefreshCcw } from "lucide-react";

import { useRouter } from "next/navigation";

import { usePathname } from "next/navigation";

import { useCallback } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";

const ResetButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleReset = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Réinitialiser</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default ResetButton;
