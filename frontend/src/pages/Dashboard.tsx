import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../utils/api";
import LocationForm from "../components/LocationForm";
import WeatherCard from "../components/WeatherCard";
import {
  IconSearch,
  IconPlus,
  IconLogout,
  IconWind, // new
} from "@tabler/icons-react";

export default function Dashboard() {
  // @ts-ignore
  const { user, logout } = useAuth();

  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/locations");
      setLocations(data.map((loc: any) => ({
    ...loc,
    latestWeather: loc.latest_weather,   // 👈 add this line
  })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = locations.filter((loc) =>
    loc.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------- CRUD helpers ---------- */
  const openNew = () => {
    setEditData(null);
    setShowForm(true);
  };
  const openEdit = (loc: any) => (setEditData({ ...loc }), setShowForm(true));
  const handleSubmit = async (
    data: { name: string; latitude: number; longitude: number },
    id?: number
  ) => {
    try {
      id
        ? await api.put(`/locations/${id}`, data)
        : await api.post("/locations", data);
      fetchLocations();
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this location?")) return;
    try {
      await api.delete(`/locations/${id}`);
      fetchLocations();
    } catch (err) {
      console.error(err);
    }
  };

  const syncWeather = async () => {
    setLoading(true);
    try {
      await api.post("/weather/sync");
      fetchLocations();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* header */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Locations&nbsp;&amp;&nbsp;Weather
        </h1>

        <div className="flex gap-3">
          {/* logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1 rounded-md border border-red-500/70 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100"
          >
            <IconLogout size={16} stroke={1.8} />
            Logout
          </button>

          <button
            onClick={syncWeather}
            className="flex items-center gap-1 rounded-md border border-green-500/70 px-3 py-1 text-sm font-medium text-green-600 hover:bg-green-50 active:bg-green-100"
          >
            <IconWind size={16} stroke={1.8} />
            Sync Weather
          </button>

          {/* new location */}
          <button
            onClick={openNew}
            className="flex items-center gap-1 rounded-md border border-emerald-600/70 bg-emerald-600/10 px-3 py-1 text-sm font-medium text-emerald-700 hover:bg-emerald-600/20 active:bg-emerald-600/25"
          >
            <IconPlus size={16} stroke={1.8} />
            New
          </button>
        </div>
      </header>

      {/* search */}
      <div className="relative mb-6 max-w-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name…"
          className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
        />
        <IconSearch
          size={18}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>

      {/* cards */}
      {loading ? (
        <p>Loading…</p>
      ) : filtered.length ? (
        <section className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
          {filtered.map((loc) => (
            <WeatherCard
              key={loc.id}
              loc={loc}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </section>
      ) : (
        <p className="text-slate-500">No locations match your search.</p>
      )}

      {/* slide-over form */}
      {showForm && (
        <LocationForm
          initialData={editData || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
