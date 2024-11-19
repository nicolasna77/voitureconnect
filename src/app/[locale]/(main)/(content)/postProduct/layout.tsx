import { MultiStepContextProvider } from "@/contexts/multistep-form-context";

export default function PostProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MultiStepContextProvider>
      <div className="flex justify-center items-center min-h-[calc(100vh-100px-100px)] w-full p-4">
        <div className="w-full max-w-5xl">{children}</div>
      </div>
    </MultiStepContextProvider>
  );
}
