import Script from "next/script";

const GoogleAdsense = ({ id }: { id: string }) => {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${id}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
};
export default GoogleAdsense;
