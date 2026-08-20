/**
 * OwnerDashboard.tsx — Dashboard Propriétaire Tcheyna AOF
 */
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { matchesAPI, Match } from "../../api/api";
import { Layout } from "../../components/Layout";
import { BadgeVerification } from "../../components/BadgeVerification";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [matches,  setMatches]  = useState<Match[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    matchesAPI.mesDemandes()
      .then(setMatches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total:    matches.length,
    pending:  matches.filter(m => m.status === "pending").length,
    accepted: matches.filter(m => m.status === "accepted").length,
  };

  return (
    <Layout userRole="owner" onRoleSwitch={() => {}}>
      <div className="px-4 py-5 space-y-5">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-slate-800" style={{ fontSize: 20 }}>
              Bonjour, {user?.full_name?.split(" ")[0]} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Propriétaire · {user?.ville}</p>
          </div>
          <BadgeVerification level={user?.trust_level || 1} role="owner" size="sm" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Demandes",  value: stats.total,    bg: "#EFF6FF", color: "#1E3A5F" },
            { label: "En attente",value: stats.pending,  bg: "#FEF3C7", color: "#D97706" },
            { label: "Acceptées", value: stats.accepted, bg: "#D1FAE5", color: "#059669" },
          ].map(({ label, value, bg, color }) => (
            <div key={label} className="rounded-2xl p-3 text-center" style={{ background: bg }}>
              <p className="font-bold text-2xl" style={{ color }}>{value}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/owner/listing"
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm text-center">
            <span className="text-2xl">🏠</span>
            <p className="font-semibold text-slate-800 text-sm">Mon annonce</p>
            <p className="text-slate-500 text-xs">Gérer ma publication</p>
          </Link>
          <Link to="/owner/matches"
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm text-center">
            <span className="text-2xl">👥</span>
            <p className="font-semibold text-slate-800 text-sm">Candidats</p>
            <p className="text-slate-500 text-xs">{stats.pending} en attente</p>
          </Link>
        </div>

        {/* Dernières demandes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800">Candidatures reçues</h2>
            <Link to="/owner/matches" className="text-sm font-semibold" style={{ color: "#F97316" }}>
              Voir tout →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2].map(i => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />)}
            </div>
          ) : matches.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center">
              <p className="text-2xl mb-2">📭</p>
              <p className="font-semibold text-slate-700">Aucune candidature</p>
              <p className="text-slate-500 text-sm mt-1">Publiez votre annonce pour recevoir des demandes</p>
              <Link to="/owner/listing"
                className="inline-block mt-3 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#1E3A5F" }}>
                Publier une annonce
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.slice(0, 3).map(match => (
                <div key={match.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ background: "#1E3A5F" }}>
                    {match.tenant.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm">{match.tenant.full_name}</p>
                    <p className="text-slate-500 text-xs">{match.tenant.ville}</p>
                    <BadgeVerification level={match.tenant.trust_level} role="tenant" size="sm" />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: match.status === "pending" ? "#FEF3C7" : "#D1FAE5",
                      color:      match.status === "pending" ? "#D97706" : "#059669",
                    }}>
                    {match.status === "pending" ? "En attente" : "Accepté"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
