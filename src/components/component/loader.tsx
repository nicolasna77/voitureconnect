import { LoaderCircle } from "lucide-react";

const LoaderComponant = () => {
  return (
    <div className=" m-auto justify-center flex items-center">
      <LoaderCircle size="2rem" className="animate-spin text-primary" />
    </div>
  );
};
export default LoaderComponant;
