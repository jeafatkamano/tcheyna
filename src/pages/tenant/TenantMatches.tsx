/**
 * TenantMatches.tsx — Candidatures du locataire
 */
import { useEffect, useState } from "react";
import { matchesAPI, Match } from "../../api/api";
import { Layout } from "../../components/Layout";
import { formatPrix } from "../../mockData";

export default function TenantMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    matchesAPI.mesCandidatures()
      .then(setMatches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
    pending:   { label: "En attente",   bg: "#FEF3C7", color: "#D97706" },
    accepted:  { label: "Acceptée ✓",  bg: "#D1FAE5", color: "#059669" },
    rejected:  { label: "Refusée",     bg: "#FEE2E2", color: "#DC2626" },
    completed: { label: "Terminée",    bg: "#F1F5F9", color: "#64748B" },
  };

  return (
    <Layout userRole="tenant" onRoleSwitch={() => {}}>
      <div className="px-4 py-5 space-y-4">
        <h1 className="font-bold text-slate-800" style={{ fontSize: 20 }}>
          Mes candidatures ({matches.length})
        </h1>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-semibold text-slate-700">Aucune candidature</p>
            <p className="text-slate-500 text-sm mt-1">Explorez les annonces pour postuler</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map(match => {
              const s = statusConfig[match.status] || statusConfig.pending;
              return (
                <div key={match.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-3">
                  <img
                    src={match.listing.images[0] || "https://via.placeholder.com/56"}
                    alt={match.listing.title}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-800 text-sm truncate">{match.listing.title}</p>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">{match.listing.ville}</p>
                    <p className="font-bold text-xs mt-1" style={{ color: "#1E3A5F" }}>
                      {formatPrix(match.listing.prix, match.listing.devise)}/mois
                    </p>
                    {match.message && (
                      <p className="text-slate-400 text-xs mt-1 truncate italic">"{match.message}"</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
