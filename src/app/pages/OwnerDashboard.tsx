import { Link } from "react-router";
import {
  CheckCircle,
  Eye,
  MessageSquare,
  Star,
  ChevronRight,
  Users,
  TrendingUp,
  MapPin,
  Square,
  Bed,
} from "lucide-react";
import { CURRENT_OWNER_LISTING, MATCHES, TENANT_PROFILES } from "../data/mockData";
import { BadgeVerification, ScoreCircle } from "../components/BadgeVerification";

export function OwnerDashboard() {
  const listing = CURRENT_OWNER_LISTING;
  const myMatches = MATCHES.filter((m) => m.listing.id === listing.id);
  const connectedMatches = myMatches.filter((m) => m.status === "connected");

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-8" style={{ background: "#1E3A5F" }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            JP
          </div>
          <div>
            <p className="text-white/60 text-sm">Bonjour 👋</p>
            <h1 className="text-white font-bold text-xl">Jean-Pierre M.</h1>
            <BadgeVerification level={3} role="owner" size="sm" />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Candidats", value: myMatches.length, icon: Users, color: "#F97316" },
            { label: "Vues aujourd'hui", value: 24, icon: Eye, color: "#3B82F6" },
            { label: "En discussion", value: connectedMatches.length, icon: MessageSquare, color: "#10B981" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-3 flex flex-col items-center text-center"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <stat.icon size={18} style={{ color: stat.color }} />
              <span className="text-white font-bold text-xl mt-1">{stat.value}</span>
              <span className="text-white/50 text-xs mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-5 -mt-3 relative z-10">
        {/* My listing card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "white", boxShadow: "0 2px 16px rgba(30,58,95,0.1)" }}
        >
          <div className="relative h-40">
            <img
              src={listing.photos[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1"
              style={{ background: "#1E3A5F" }}
            >
              <CheckCircle size={11} />
              Certifié niv. {listing.certificationLevel}
            </div>
            <div
              className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: "#DCFCE7", color: "#15803D" }}
            >
              Actif
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold mb-1" style={{ color: "#1E293B" }}>
              {listing.title}
            </h3>
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
              <MapPin size={12} /> {listing.district}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1"><Square size={12} /> {listing.surfaceM2}m²</div>
              <div className="flex items-center gap-1"><Bed size={12} /> {listing.nbRooms} pièces</div>
              <div className="flex items-center gap-1">
                <Star size={12} style={{ color: "#F59E0B" }} /> {listing.owner.rating} ({listing.owner.reviewCount} avis)
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg" style={{ color: "#1E3A5F" }}>
                {listing.monthlyRent}€ <span className="font-normal text-gray-400 text-xs">/mois</span>
              </span>
              <Link
                to="/owner/listing"
                className="flex items-center gap-1 text-sm font-semibold"
                style={{ color: "#F97316" }}
              >
                Gérer <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Trend */}
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE" }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#DBEAFE" }}
          >
            <TrendingUp size={22} style={{ color: "#1D4ED8" }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "#1E3070" }}>
              Annonce très consultée cette semaine
            </p>
            <p className="text-xs text-blue-600 mt-0.5">
              +42% de vues par rapport à la semaine dernière
            </p>
          </div>
        </div>

        {/* Candidates */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold" style={{ color: "#1E293B", fontSize: "18px" }}>
              Candidats suggérés
            </h2>
            <Link
              to="/owner/matches"
              className="text-sm font-semibold flex items-center gap-1"
              style={{ color: "#F97316" }}
            >
              Tous voir <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {TENANT_PROFILES.map((tenant) => {
              const match = myMatches.find((m) => m.tenant.id === tenant.id);
              return (
                <Link
                  key={tenant.id}
                  to={`/tenant-profile/${tenant.id}`}
                  className="flex items-center gap-4 p-4 rounded-2xl transition-transform active:scale-[0.98]"
                  style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
                >
                  <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={tenant.avatar}
                      alt={tenant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-sm" style={{ color: "#1E293B" }}>
                        {tenant.name}
                      </span>
                      <BadgeVerification level={tenant.verificationLevel} role="tenant" size="sm" />
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{tenant.occupation}</p>
                    <div className="flex items-center gap-3">
                      <ScoreCircle score={tenant.profileScore} size={36} />
                      <div>
                        <p className="text-xs text-gray-400">Budget</p>
                        <p className="text-xs font-semibold" style={{ color: "#1E3A5F" }}>
                          {tenant.budgetRange.min}–{tenant.budgetRange.max}€/mois
                        </p>
                      </div>
                      {match && (
                        <span
                          className="ml-auto text-xs font-semibold px-2 py-1 rounded-full"
                          style={{
                            background:
                              match.status === "connected"
                                ? "#D1FAE5"
                                : match.status === "owner_accepted"
                                ? "#DBEAFE"
                                : "#F1F5F9",
                            color:
                              match.status === "connected"
                                ? "#059669"
                                : match.status === "owner_accepted"
                                ? "#1D4ED8"
                                : "#64748B",
                          }}
                        >
                          {match.status === "connected"
                            ? "✓ Connecté"
                            : match.status === "owner_accepted"
                            ? "Accepté"
                            : "Nouveau"}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={18} style={{ color: "#CBD5E1", flexShrink: 0 }} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
