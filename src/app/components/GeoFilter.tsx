import { useState, useEffect } from "react";
import { useGeoLocation } from "../hooks/useGeoLocation";

interface GeoFilterProps {
  onPaysChange?: (pays: string) => void;
  onVilleChange?: (ville: string) => void;
  initialPays?: string;
  initialVille?: string;
}

export function GeoFilter({
  onPaysChange,
  onVilleChange,
  initialPays,
  initialVille,
}: GeoFilterProps) {
  const { pays: paysList, getVilles } = useGeoLocation();
  const [selectedPays, setSelectedPays] = useState<string>(initialPays || "");
  const [selectedVille, setSelectedVille] = useState<string>(initialVille || "");
  const [villes, setVilles] = useState<string[]>([]);
  const [loadingVilles, setLoadingVilles] = useState(false);

  useEffect(() => {
    if (selectedPays) {
      setLoadingVilles(true);
      getVilles(selectedPays).then((data) => {
        setVilles(data);
        setSelectedVille("");
        setLoadingVilles(false);
      });
      onPaysChange?.(selectedPays);
    }
  }, [selectedPays, getVilles, onPaysChange]);

  const handleVilleChange = (ville: string) => {
    setSelectedVille(ville);
    onVilleChange?.(ville);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">Pays</label>
        <select
          value={selectedPays}
          onChange={(e) => setSelectedPays(e.target.value)}
          className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none bg-white"
        >
          <option value="">Tous les pays</option>
          {paysList.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">Ville</label>
        <select
          value={selectedVille}
          onChange={(e) => handleVilleChange(e.target.value)}
          disabled={loadingVilles}
          className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
        >
          <option value="">{loadingVilles ? "Chargement..." : "Toutes"}</option>
          {villes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
