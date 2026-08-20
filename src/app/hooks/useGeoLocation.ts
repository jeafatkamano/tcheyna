import { useState, useEffect } from "react";

const API_BASE = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/+$/, "");

export interface Pays {
  nom: string;
  devise: { code: string; symbol: string };
}

export interface GeoData {
  pays: Pays[];
  villes: Record<string, string[]>;
  quartiers: Record<string, Record<string, string[]>>;
}

export function useGeoLocation() {
  const [data, setData] = useState<GeoData>({
    pays: [],
    villes: {},
    quartiers: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const paysRes = await fetch(`${API_BASE}/geo/pays`);
        if (!paysRes.ok) throw new Error("Erreur API");

        const paysData = await paysRes.json();
        setData((prev) => ({
          ...prev,
          pays: paysData.pays ?? [],
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchGeoData();
  }, []);

  const getVilles = async (pays: string): Promise<string[]> => {
    try {
      const res = await fetch(`${API_BASE}/geo/villes/${encodeURIComponent(pays)}`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.villes || [];
    } catch {
      return [];
    }
  };

  const getQuartiers = async (
    pays: string,
    ville: string
  ): Promise<string[]> => {
    try {
      const res = await fetch(
        `${API_BASE}/geo/quartiers/${encodeURIComponent(pays)}/${encodeURIComponent(ville)}`
      );
      if (!res.ok) return [];
      const json = await res.json();
      return json.quartiers || [];
    } catch {
      return [];
    }
  };

  return {
    pays: data.pays.map((p) => p.nom),
    getVilles,
    getQuartiers,
    getCurrency: (paysNom: string) =>
      data.pays.find((p) => p.nom === paysNom)?.devise,
    loading,
    error,
  };
}
