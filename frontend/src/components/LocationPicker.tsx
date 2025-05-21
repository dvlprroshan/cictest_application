import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LatLng {
  latitude: number;
  longitude: number;
}
interface Props {
  value?: LatLng;
  onChange: (pos: LatLng) => void;
  height?: string | number;
}

/* ---------- default Leaflet marker icon fix ---------- */
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ---------- Click listener: map clicks → parent onChange ---------- */
function ClickListener({ onChange }: { onChange: Props["onChange"] }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onChange({ latitude: lat, longitude: lng });
    },
  });
  return null;
}

/* ---------- Locate-me button (now **inside** <MapContainer>) ---------- */
function LocateButton({ onChange }: { onChange: Props["onChange"] }) {
  const map = useMap();

  const locate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation isn’t supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        map.setView([latitude, longitude], 13); // pan/zoom
        onChange({ latitude, longitude });      // update parent state
      },
      () => alert("Couldn’t get your location (permission denied?)."),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // absolutely-positioned div inside the map viewport
  return (
    <div
      onClick={locate}
      title="Go to my location"
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1000,
        cursor: "pointer",
        background: "white",
        borderRadius: 4,
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 4px rgba(0,0,0,0.3)",
        userSelect: "none",
      }}
    >
      📍
    </div>
  );
}

/* ---------- Main component ---------- */
export default function LocationPicker({
  value,
  onChange,
  height = 400,
}: Props) {
  const [center, setCenter] = useState<[number, number]>(
    value ? [value.latitude, value.longitude] : [20.5937, 78.9629] // India default
  );

  useEffect(() => {
    if (value) setCenter([value.latitude, value.longitude]);
  }, [value]);

  return (
    <MapContainer
      center={center}
      zoom={value ? 13 : 5}
      style={{ height, width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* interaction layers */}
      <ClickListener onChange={onChange} />
      {value && (
        <Marker
          position={[value.latitude, value.longitude]}
          icon={markerIcon}
        />
      )}
      {/* locate-me control (now has context) */}
      <LocateButton onChange={onChange} />
    </MapContainer>
  );
}
