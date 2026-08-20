/**
 * TenantDashboard.tsx — Dashboard Locataire Tcheyna AOF
 * Connecté à l'API Flask via matchesAPI + passportAPI
 */
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { matchesAPI, passportAPI, Match, TenantPassport } from "../../api/api";
import { Layout } from "../../components/Layout";
import { BadgeVerification, ScoreCircle } from "../../components/BadgeVerification";
import { formatPrix } from "../../mockData";

export default function TenantDashboard() {
  const { user } = useAuth();
  const [matches,  setMatches]  = useState<Match[]>([]);
  const [passport, setPassport] = useState<TenantPassport | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      matchesAPI.mesCandidatures(),
      passportAPI.get().catch(() => null),
    ]).then(([m, p]) => {
      setMatches(m);
      setPassport(p);
    }).finally(() => setLoading(false));
  }, []);

  const stats = {
    total:    matches.length,
    pending:  matches.filter(m => m.status === "pending").length,
    accepted: matches.filter(m => m.status === "accepted").length,
  };

  return (
    <Layout userRole="tenant" onRoleSwitch={() => {}}>
      <div className="px-4 py-5 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-slate-800" style={{ fontSize: 20 }}>
              Bonjour, {user?.full_name?.split(" ")[0]} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">{user?.ville}, {user?.pays}</p>
          </div>
          <BadgeVerification level={user?.trust_level || 1} role="tenant" size="sm" />
        </div>

        {/* Score passeport */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <ScoreCircle score={passport?.score || 0} size={72} />
          <div className="flex-1">
            <p className="font-semibold text-slate-800">Mon passeport locataire</p>
            <p className="text-slate-500 text-sm mt-0.5">
              {passport?.docs_uploaded
                ? passport.income_verified
                  ? "Dossier complet et vérifié ✓"
                  : "Documents uploadés, en cours de vérification"
                : "Complétez votre dossier pour booster vos chances"}
            </p>
            <Link to="/tenant/profile"
              className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: "#EFF6FF", color: "#1E3A5F" }}>
              {passport?.docs_uploaded ? "Voir mon dossier →" : "Compléter mon dossier →"}
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Candidatures", value: stats.total,    color: "#1E3A5F", bg: "#EFF6FF" },
            { label: "En attente",   value: stats.pending,  color: "#D97706", bg: "#FEF3C7" },
            { label: "Acceptées",    value: stats.accepted, color: "#059669", bg: "#D1FAE5" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="rounded-2xl p-3 text-center" style={{ background: bg }}>
              <p className="font-bold text-2xl" style={{ color }}>{value}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Dernières candidatures */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800">Mes candidatures</h2>
            <Link to="/tenant/matches" className="text-sm font-semibold" style={{ color: "#F97316" }}>
              Voir tout →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-20" />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center">
              <p className="text-2xl mb-2">🏠</p>
              <p className="font-semibold text-slate-700">Aucune candidature</p>
              <p className="text-slate-500 text-sm mt-1">Explorez les annonces et postulez !</p>
              <Link to="/tenant/listings"
                className="inline-block mt-3 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#1E3A5F" }}>
                Voir les annonces
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.slice(0, 3).map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </div>

        {/* CTA Annonces */}
        <Link to="/tenant/listings"
          className="flex items-center justify-between p-4 rounded-2xl text-white"
          style={{ background: "linear-gradient(135deg, #1E3A5F, #2D5A9E)" }}>
          <div>
            <p className="font-bold">Découvrir des logements</p>
            <p className="text-white/70 text-sm mt-0.5">{user?.ville} & alentours</p>
          </div>
          <span className="text-2xl">🔍</span>
        </Link>
      </div>
    </Layout>
  );
}

function MatchCard({ match }: { match: Match }) {
  const statusConfig = {
    pending:   { label: "En attente",  bg: "#FEF3C7", color: "#D97706" },
    accepted:  { label: "Acceptée ✓", bg: "#D1FAE5", color: "#059669" },
    rejected:  { label: "Refusée",    bg: "#FEE2E2", color: "#DC2626" },
    completed: { label: "Terminée",   bg: "#F1F5F9", color: "#64748B" },
  };
  const s = statusConfig[match.status] || statusConfig.pending;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
      <img
        src={match.listing.images[0] || "https://via.placeholder.com/60"}
        alt={match.listing.title}
        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 truncate text-sm">{match.listing.title}</p>
        <p className="text-slate-500 text-xs mt-0.5">{match.listing.quartier}, {match.listing.ville}</p>
        <p className="font-bold text-xs mt-1" style={{ color: "#1E3A5F" }}>
          {formatPrix(match.listing.prix, match.listing.devise)}/mois
        </p>
      </div>
      <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
        style={{ background: s.bg, color: s.color }}>
        {s.label}
      </span>
    </div>
  );
}
