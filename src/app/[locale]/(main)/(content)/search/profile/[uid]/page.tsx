import DetailProfil from "./detail-profil";

const DetailProfilPage = ({ params }: { params: { uid: string } }) => {
  return <DetailProfil params={params} />;
};

export default DetailProfilPage;
