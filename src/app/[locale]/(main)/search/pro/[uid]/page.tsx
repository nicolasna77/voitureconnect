import Image from "next/image";
import DetailGarage from "./detail-garage";

const DetailPro = ({ params }: { params: { uid: string } }) => {
  return <DetailGarage params={params} />;
};

export default DetailPro;
