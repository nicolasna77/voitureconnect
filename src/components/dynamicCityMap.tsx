import dynamic from "next/dynamic";
import LoaderComponant from "./component/loader";

const DynamicCityMap = dynamic(() => import("./cityMap"), {
  ssr: false,
  loading: () => <LoaderComponant />,
});

export default DynamicCityMap;
