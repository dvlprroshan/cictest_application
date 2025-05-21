import React, { useState, useEffect } from "react";
import LocationPicker from "./LocationPicker";
import {
  IconTypography,
  IconDeviceFloppy,
  IconX,
  IconMapPin,
} from "@tabler/icons-react";

interface Props {
  initialData?: {
    id?: number;
    name: string;
    latitude: number;
    longitude: number;
  };
  onSubmit: (
    data: { name: string; latitude: number; longitude: number },
    id?: number
  ) => void;
  onCancel: () => void;
}

export default function LocationForm({
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] = useState(initialData?.name || "");
  const [latitude, setLatitude] = useState(initialData?.latitude || 0);
  const [longitude, setLongitude] = useState(initialData?.longitude || 0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setLatitude(initialData.latitude);
      setLongitude(initialData.longitude);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      onSubmit({ name, latitude, longitude }, initialData?.id);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white/90 ring-1 ring-slate-200"
      >
        {/* close button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 text-slate-500 hover:text-slate-700"
        >
          <IconX size={20} stroke={1.8} />
        </button>

        <header className="px-6 pb-4 pt-6">
          <h2 className="text-xl font-semibold text-slate-800">
            {initialData?.id ? "Edit Location" : "New Location"}
          </h2>
          {error && (
            <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
          )}
        </header>

        <div className="px-6 space-y-5">
          {/* name field */}
          <div className="relative">
            <IconTypography
              size={18}
              stroke={1.6}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Location name"
              required
              className="block w-full rounded-lg border border-slate-300 bg-transparent py-2 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          {/* lat/lng readout */}
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <IconMapPin size={16} />
            <span>
              lat&nbsp;{latitude}, lng&nbsp;{longitude}
            </span>
          </div>

          {/* map picker */}
          <LocationPicker
            value={{ latitude, longitude }}
            onChange={(pos) => {
              setLatitude(pos.latitude);
              setLongitude(pos.longitude);
            }}
            height={280}
          />
        </div>

        {/* footer */}
        <footer className="mt-6 flex justify-end gap-3 bg-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <IconDeviceFloppy size={16} stroke={1.6} />
            Save
          </button>
        </footer>
      </form>
    </div>
  );
}
