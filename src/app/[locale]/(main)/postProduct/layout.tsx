import { MultiForm } from "@/components/postAD/multi-form";
import { MultiStepContextProvider } from "@/contexts/multistep-form-context";
import { Steps } from "@/components/postAD/steps";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Title from "@/components/title";

export default function PostProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MultiStepContextProvider>
      <div>{children}</div>
    </MultiStepContextProvider>
  );
}
