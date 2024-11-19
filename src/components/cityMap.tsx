"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LoaderComponant from "./component/loader";
import markericon from "../../public/data/leaflet/marker-icon.png";
import markericon2x from "../../public/data/leaflet/marker-icon-2x.png";
import markershadow from "../../public/data/leaflet/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markericon2x.src,
  iconUrl: markericon.src,
  shadowUrl: markershadow.src,
});

interface CityMapProps {
  city: string;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

const CityMap: React.FC<CityMapProps> = ({ city }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            city
          )}`
        );

        const data = await response.json();
        console.log(data);
        if (data && data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des coordonnées:", error);
      }
    };

    fetchCoordinates();
  }, [city]);

  if (!position)
    return (
      <div className="flex justify-center items-center h-full w-full m-auto">
        <LoaderComponant />
      </div>
    );

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "200px", width: "100%", zIndex: 0 }}
    >
      <ChangeView center={position} />
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <Marker position={position} />
      <Circle
        center={position}
        radius={2000}
        pathOptions={{
          color: "gray",
          fillColor: "gray",
          fillOpacity: 0.1,
        }}
      />
    </MapContainer>
  );
};

export default CityMap;
