import { useState } from "react";
import { Link } from "react-router";
import {
  CheckCircle,
  MessageSquare,
  Clock,
  X,
  ChevronRight,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { MATCHES } from "../data/mockData";
import { BadgeVerification, ScoreCircle } from "../components/BadgeVerification";

const STATUS_CONFIG = {
  suggested: { label: "Suggestion", color: "#94A3B8", bg: "#F1F5F9" },
  tenant_interested: { label: "Intéressé(e)", color: "#D97706", bg: "#FEF3C7" },
  owner_accepted: { label: "Propriétaire OK", color: "#1D4ED8", bg: "#DBEAFE" },
  connected: { label: "Connecté", color: "#059669", bg: "#D1FAE5" },
  rejected: { label: "Refusé", color: "#DC2626", bg: "#FEE2E2" },
} as const;

type FilterType = "all" | "suggested" | "connected" | "pending";

export function MatchingPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = MATCHES.filter((m) => {
    if (filter === "all") return true;
    if (filter === "connected") return m.status === "connected";
    if (filter === "suggested") return m.status === "suggested";
    if (filter === "pending") return ["tenant_interested", "owner_accepted"].includes(m.status);
    return true;
  });

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-5" style={{ background: "#1E3A5F" }}>
        <h1 className="text-white font-bold mb-1" style={{ fontSize: "20px" }}>
          Matching
        </h1>
        <p className="text-white/60 text-sm">Vos mises en relation en cours</p>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: "Total", value: MATCHES.length },
            { label: "En attente", value: MATCHES.filter((m) => ["suggested", "tenant_interested", "owner_accepted"].includes(m.status)).length },
            { label: "Connectés", value: MATCHES.filter((m) => m.status === "connected").length },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <span className="text-white font-bold text-xl block">{s.value}</span>
              <span className="text-white/50 text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-2 px-4 py-3 overflow-x-auto"
        style={{ background: "#1E3A5F", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        {(["all", "pending", "connected", "suggested"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all"
            style={{
              background: filter === f ? "#F97316" : "rgba(255,255,255,0.12)",
              color: filter === f ? "white" : "rgba(255,255,255,0.6)",
            }}
          >
            {f === "all" ? "Tous" : f === "pending" ? "En attente" : f === "connected" ? "Connectés" : "Suggestions"}
          </button>
        ))}
      </div>

      {/* Match cards */}
      <div className="px-4 pt-4 space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">Aucun match dans cette catégorie.</p>
          </div>
        )}

        {filtered.map((match) => {
          const statusCfg = STATUS_CONFIG[match.status];
          return (
            <div
              key={match.id}
              className="rounded-2xl overflow-hidden"
              style={{ background: "white", boxShadow: "0 2px 16px rgba(30,58,95,0.08)" }}
            >
              {/* Listing mini-card */}
              <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-gray-100">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={match.listing.photos[0]}
                    alt={match.listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{ color: "#1E293B" }}>
                    {match.listing.title}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={11} />
                    {match.listing.district} — {match.listing.monthlyRent}€/mois
                  </div>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: statusCfg.bg, color: statusCfg.color }}
                >
                  {statusCfg.label}
                </span>
              </div>

              {/* Tenant mini-card */}
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0">
                  <img
                    src={match.tenant.avatar}
                    alt={match.tenant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: "#1E293B" }}>
                    {match.tenant.name}
                  </p>
                  <p className="text-xs text-gray-400">{match.tenant.occupation}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <ScoreCircle score={match.tenant.profileScore} size={28} />
                    <BadgeVerification level={match.tenant.verificationLevel} role="tenant" size="sm" />
                  </div>
                </div>

                {/* Action */}
                {match.status === "connected" ? (
                  <Link
                    to={`/messages/${match.id}`}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-white text-sm font-semibold flex-shrink-0"
                    style={{ background: "#1E3A5F" }}
                  >
                    <MessageSquare size={15} />
                    {match.unreadCount ? (
                      <span
                        className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                        style={{ background: "#F97316" }}
                      >
                        {match.unreadCount}
                      </span>
                    ) : (
                      "Chat"
                    )}
                  </Link>
                ) : match.status === "owner_accepted" ? (
                  <div className="flex flex-col gap-1.5">
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white text-xs font-semibold"
                      style={{ background: "#10B981" }}
                    >
                      <CheckCircle size={12} />
                      Connecter
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold"
                      style={{ background: "#FEE2E2", color: "#DC2626" }}
                    >
                      <X size={12} />
                      Refuser
                    </button>
                  </div>
                ) : match.status === "tenant_interested" ? (
                  <div className="flex flex-col gap-1.5">
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white text-xs font-semibold"
                      style={{ background: "#F97316" }}
                    >
                      <CheckCircle size={12} />
                      Accepter
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold"
                      style={{ background: "#F1F5F9", color: "#64748B" }}
                    >
                      <X size={12} />
                      Passer
                    </button>
                  </div>
                ) : (
                  <Link
                    to={`/tenant-profile/${match.tenant.id}`}
                    className="flex items-center gap-1 text-sm font-semibold flex-shrink-0"
                    style={{ color: "#1E3A5F" }}
                  >
                    Voir <ChevronRight size={16} />
                  </Link>
                )}
              </div>

              {/* Last message preview */}
              {match.lastMessage && (
                <div
                  className="mx-4 mb-4 px-3 py-2.5 rounded-xl text-xs text-gray-500"
                  style={{ background: "#F8FAFC" }}
                >
                  <p className="truncate">💬 {match.lastMessage}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA if no connected matches */}
      {MATCHES.filter((m) => m.status === "connected").length === 0 && (
        <div className="px-4 mt-6">
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: "#1E3A5F" }}
          >
            <p className="text-white font-bold mb-2">Pas encore de match validé</p>
            <p className="text-white/60 text-sm mb-4">
              Complétez votre dossier pour augmenter vos chances d'être mis en relation.
            </p>
            <Link
              to="/tenant/profile"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: "#F97316" }}
            >
              Compléter mon dossier <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
