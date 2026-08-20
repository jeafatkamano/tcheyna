/**
 * OwnerMatches.tsx — Gestion des candidatures (propriétaire)
 */
import { useEffect, useState } from "react";
import { matchesAPI, Match } from "../../api/api";
import { Layout } from "../../components/Layout";
import { BadgeVerification } from "../../components/BadgeVerification";

export default function OwnerMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting,  setActing]  = useState<string | null>(null);

  useEffect(() => {
    matchesAPI.mesDemandes()
      .then(setMatches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (matchId: string, statut: "accepted" | "rejected") => {
    setActing(matchId);
    try {
      const updated = await matchesAPI.updateStatus(matchId, statut);
      setMatches(prev => prev.map(m => m.id === matchId ? updated.match : m));
    } catch (e: any) { alert(e.message); }
    finally { setActing(null); }
  };

  const pending  = matches.filter(m => m.status === "pending");
  const resolved = matches.filter(m => m.status !== "pending");

  return (
    <Layout userRole="owner" onRoleSwitch={() => {}}>
      <div className="px-4 py-5 space-y-4">
        <h1 className="font-bold text-slate-800" style={{ fontSize: 20 }}>
          Candidatures ({matches.length})
        </h1>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />)}
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-semibold text-slate-700">Aucune candidature reçue</p>
          </div>
        ) : (
          <>
            {/* En attente */}
            {pending.length > 0 && (
              <div>
                <h2 className="font-semibold text-slate-600 text-sm mb-2 uppercase tracking-wide">
                  En attente ({pending.length})
                </h2>
                <div className="space-y-3">
                  {pending.map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      acting={acting === match.id}
                      onAccept={() => handleAction(match.id, "accepted")}
                      onReject={() => handleAction(match.id, "rejected")}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Traités */}
            {resolved.length > 0 && (
              <div>
                <h2 className="font-semibold text-slate-600 text-sm mb-2 uppercase tracking-wide">
                  Traités ({resolved.length})
                </h2>
                <div className="space-y-3">
                  {resolved.map(match => (
                    <MatchCard key={match.id} match={match} acting={false} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

function MatchCard({ match, acting, onAccept, onReject }: {
  match: Match;
  acting: boolean;
  onAccept?: () => void;
  onReject?: () => void;
}) {
  const isPending  = match.status === "pending";
  const isAccepted = match.status === "accepted";

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ background: "#1E3A5F" }}>
          {match.tenant.full_name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-bold text-slate-800">{match.tenant.full_name}</p>
            {!isPending && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: isAccepted ? "#D1FAE5" : "#FEE2E2",
                  color:      isAccepted ? "#059669" : "#DC2626",
                }}>
                {isAccepted ? "✓ Accepté" : "✗ Refusé"}
              </span>
            )}
          </div>
          <p className="text-slate-500 text-xs mt-0.5">{match.tenant.ville}, {match.tenant.pays}</p>
          <BadgeVerification level={match.tenant.trust_level} role="tenant" size="sm" />
        </div>
      </div>

      {/* Annonce concernée */}
      <div className="mt-3 flex items-center gap-2 p-2 rounded-xl"
        style={{ background: "#F8FAFC" }}>
        <span className="text-lg">🏠</span>
        <p className="text-xs text-slate-600 truncate">{match.listing.title}</p>
      </div>

      {/* Message */}
      {match.message && (
        <p className="mt-2 text-xs text-slate-500 italic">"{match.message}"</p>
      )}

      {/* Actions */}
      {isPending && onAccept && onReject && (
        <div className="flex gap-2 mt-3">
          <button onClick={onReject} disabled={acting}
            className="flex-1 py-2 rounded-xl text-sm font-semibold border transition"
            style={{ borderColor: "#DC2626", color: "#DC2626" }}>
            {acting ? "…" : "✗ Refuser"}
          </button>
          <button onClick={onAccept} disabled={acting}
            className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition"
            style={{ background: acting ? "#94A3B8" : "#059669" }}>
            {acting ? "…" : "✓ Accepter"}
          </button>
        </div>
      )}
    </div>
  );
}
