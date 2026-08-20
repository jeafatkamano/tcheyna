import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useGeoLocation } from "../hooks/useGeoLocation";

interface GeoSelectProps {
  onPaysChange?: (pays: string) => void;
  onVilleChange?: (ville: string) => void;
  onQuartierChange?: (quartier: string) => void;
  initialPays?: string;
  initialVille?: string;
  initialQuartier?: string;
}

export function GeoSelect({
  onPaysChange,
  onVilleChange,
  onQuartierChange,
  initialPays,
  initialVille,
  initialQuartier,
}: GeoSelectProps) {
  const { pays: paysList, getVilles, getQuartiers } = useGeoLocation();
  const [selectedPays, setSelectedPays] = useState<string>(initialPays || "");
  const [selectedVille, setSelectedVille] = useState<string>(initialVille || "");
  const [selectedQuartier, setSelectedQuartier] = useState<string>(
    initialQuartier || ""
  );
  const [villes, setVilles] = useState<string[]>([]);
  const [quartiers, setQuartiers] = useState<string[]>([]);
  const [loadingVilles, setLoadingVilles] = useState(false);
  const [loadingQuartiers, setLoadingQuartiers] = useState(false);

  useEffect(() => {
    if (selectedPays) {
      setLoadingVilles(true);
      getVilles(selectedPays).then((data) => {
        setVilles(data);
        setSelectedVille("");
        setSelectedQuartier("");
        setQuartiers([]);
        setLoadingVilles(false);
      });
      onPaysChange?.(selectedPays);
    }
  }, [selectedPays, getVilles, onPaysChange]);

  useEffect(() => {
    if (selectedPays && selectedVille) {
      setLoadingQuartiers(true);
      getQuartiers(selectedPays, selectedVille).then((data) => {
        setQuartiers(data);
        setSelectedQuartier("");
        setLoadingQuartiers(false);
      });
      onVilleChange?.(selectedVille);
    }
  }, [selectedVille, selectedPays, getQuartiers, onVilleChange]);

  const handleQuartierChange = (quartier: string) => {
    setSelectedQuartier(quartier);
    onQuartierChange?.(quartier);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Pays</label>
        <select
          value={selectedPays}
          onChange={(e) => setSelectedPays(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white"
        >
          <option value="">Sélectionner un pays</option>
          {paysList.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {selectedPays && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
          <select
            value={selectedVille}
            onChange={(e) => setSelectedVille(e.target.value)}
            disabled={loadingVilles}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">{loadingVilles ? "Chargement..." : "Sélectionner une ville"}</option>
            {villes.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedVille && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Quartier</label>
          <select
            value={selectedQuartier}
            onChange={(e) => handleQuartierChange(e.target.value)}
            disabled={loadingQuartiers}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 bg-white disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">{loadingQuartiers ? "Chargement..." : "Sélectionner un quartier"}</option>
            {quartiers.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
