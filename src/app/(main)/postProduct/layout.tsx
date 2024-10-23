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
        <div className="flex-1 flex flex-col lg:flex-row items-start justify-center min-h-screen gap-4 w-full mx-auto p-4">
          <Card className="bg-background w-full lg:w-1/3 rounded-lg shadow-lg border-border border lg:sticky lg:top-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <Title>Déposer une annonce</Title>
            </CardHeader>
            <CardContent>
              <Steps />
              <MultiForm />
            </CardContent>
          </Card>
          <div className="bg-background w-full lg:block hidden rounded-lg shadow-lg border-border border">
            {children}
          </div>
        </div>
      </div>
    </MultiStepContextProvider>
  );
}
