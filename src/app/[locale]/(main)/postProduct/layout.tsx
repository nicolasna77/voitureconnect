import { MultiForm } from "@/components/multi-form";
import { MultiStepContextProvider } from "@/contexts/multistep-form-context";
import { Steps } from "@/components/steps";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Title from "@/components/title";

export default function PostProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MultiStepContextProvider>
      <div className="mx-auto bg-secondary ">
        <div className="flex-1 gap-4 flex flex-col lg:flex-row items-start justify-center min-h-screen w-full mx-auto p-4">
          <Card className="bg-background w-full lg:w-1/3 rounded-lg  border-border border lg:sticky lg:top-20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <Title>Déposer une annonce</Title>
            </CardHeader>
            <CardContent>
              <Steps />
              <MultiForm />
            </CardContent>
          </Card>

          <div>{children}</div>
        </div>
      </div>
    </MultiStepContextProvider>
  );
}
