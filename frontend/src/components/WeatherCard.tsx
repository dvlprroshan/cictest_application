import {
  IconMapPin,
  IconTemperature,
  IconDroplet,
  IconWind,
  IconCloudRain,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";

interface Weather {
  temperature?: number;
  humidity?: number;
  wind_speed?: number;
  precipitation?: number;
}

interface Location {
  id: number;
  name: string;
  latitude: string | number;
  longitude: string | number;
  latestWeather?: Weather;        // camelCase after normalisation
}

interface Props {
  loc: Location;
  onEdit: (loc: Location) => void;
  onDelete: (id: number) => void;
}

export default function WeatherCard({ loc, onEdit, onDelete }: Props) {
  const w = loc.latestWeather ?? {};           // safe fallback

  /* helper to trim long lat/lon strings */
  const fmt = (v: string | number) =>
    typeof v === "string" ? parseFloat(v).toFixed(2) : v.toFixed(2);

  return (
    <article
      className="
        group relative flex flex-col overflow-hidden rounded-2xl
        border border-slate-200/70 ring-1 ring-slate-200/60
        bg-white/70 backdrop-blur-md transition-all
        hover:-translate-y-1 hover:ring-emerald-500/50
      "
    >
      {/* header */}
      <header className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
        <IconMapPin size={18} stroke={1.8} />
        <h2 className="font-semibold text-sm truncate">{loc.name}</h2>
      </header>

      {/* body */}
      <div
        className="
          flex-1 grid grid-cols-2 gap-x-4
          divide-y divide-slate-100/60 sm:divide-y-0 sm:divide-x
          px-4 py-4 text-slate-700 text-sm
        "
      >
        <div className="flex items-center gap-1 py-1">
          <IconTemperature size={18} />
          <span>{w.temperature ?? "--"}°C</span>
        </div>
        <div className="flex items-center gap-1 py-1">
          <IconWind size={18} />
          <span>{w.wind_speed ?? "--"} km/h</span>
        </div>
        <div className="flex items-center gap-1 py-1">
          <IconDroplet size={18} />
          <span>{w.humidity ?? "--"} %</span>
        </div>
        <div className="flex items-center gap-1 py-1">
          <IconCloudRain size={18} />
          <span>{w.precipitation ?? "--"} mm</span>
        </div>
        <p className="col-span-2 pt-2 text-xs text-slate-500">
          lat&nbsp;{fmt(loc.latitude)}, lng&nbsp;{fmt(loc.longitude)}
        </p>
      </div>

      {/* action buttons */}
      <footer className="flex justify-end gap-2 px-4 pb-4">
        <button
          onClick={() => onEdit(loc)}
          className="
            flex items-center gap-1 px-2 py-1 rounded-md
            border border-blue-500 text-blue-600 text-xs
            hover:bg-blue-600 hover:text-white transition-colors
          "
        >
          <IconPencil size={16} /> Edit
        </button>
        <button
          onClick={() => onDelete(loc.id)}
          className="
            flex items-center gap-1 px-2 py-1 rounded-md
            border border-red-500 text-red-600 text-xs
            hover:bg-red-600 hover:text-white transition-colors
          "
        >
          <IconTrash size={16} /> Delete
        </button>
      </footer>
    </article>
  );
}
