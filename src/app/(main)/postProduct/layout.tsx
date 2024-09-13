import { MultiForm } from "@/components/multi-form";
import { MultiStepContenxtProvider } from "@/contexts/multistep-form-context";
import { Steps } from "@/components/steps";

export default function PostProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MultiStepContenxtProvider>
      <div className="mx-auto flex  ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full  mx-auto p-4 sm:p-6 md:p-8">
          <div className="bg-background md:col-span-1 rounded-lg shadow-lg">
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl font-bold mb-4">Déposer une annonce</h1>
              <Steps />
              <MultiForm />
            </div>
          </div>
          <div className=" md:col-span-2">{children}</div>
        </div>
      </div>
    </MultiStepContenxtProvider>
  );
}
