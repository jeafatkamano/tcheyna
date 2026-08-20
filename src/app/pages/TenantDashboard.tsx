import { Link } from "react-router";
import { ArrowRight, MapPin, Bed, Square, Star, CheckCircle, ChevronRight } from "lucide-react";
import { CURRENT_TENANT, LISTINGS } from "../data/mockData";
import { BadgeVerification, ScoreCircle } from "../components/BadgeVerification";

export function TenantDashboard() {
  const tenant = CURRENT_TENANT;

  return (
    <div className="pb-8">
      {/* Hero card */}
      <div className="px-4 py-6" style={{ background: "#1E3A5F" }}>
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/20 flex-shrink-0"
          >
            <img src={tenant.avatar} alt={tenant.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-white/60 text-sm">Bonjour 👋</p>
            <h1 className="text-white font-bold text-xl">{tenant.name}</h1>
            <BadgeVerification level={tenant.verificationLevel} role="tenant" size="sm" />
          </div>
        </div>

        {/* Score + progress */}
        <div
          className="rounded-2xl p-4 flex items-center gap-5"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <ScoreCircle score={tenant.profileScore} size={76} />
          <div className="flex-1">
            <p className="text-white font-bold mb-1">Score de confiance</p>
            <p className="text-white/60 text-xs mb-3">
              Complétez votre dossier pour être prioritaire
            </p>
            <div className="space-y-1.5">
              {tenant.documents.slice(0, 3).map((doc) => (
                <div key={doc.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      background:
                        doc.status === "verified"
                          ? "#10B981"
                          : doc.status === "pending"
                          ? "#F59E0B"
                          : "#EF4444",
                    }}
                  />
                  <span className="text-white/70 text-xs truncate">{doc.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dossier status */}
      <div className="px-4 mt-5">
        <div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "#FFF7ED" }}
            >
              <CheckCircle size={20} style={{ color: "#F97316" }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#1E293B" }}>
                Mon dossier locataire
              </p>
              <p className="text-xs text-gray-400">
                {tenant.documents.filter((d) => d.status === "verified").length}/
                {tenant.documents.length} éléments vérifiés
              </p>
            </div>
          </div>
          <Link
            to="/tenant/profile"
            className="flex items-center gap-1 text-sm font-semibold"
            style={{ color: "#F97316" }}
          >
            Voir
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Compatible listings */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold" style={{ color: "#1E293B", fontSize: "18px" }}>
            Annonces compatibles
          </h2>
          <Link
            to="/tenant/listings"
            className="text-sm font-semibold flex items-center gap-1"
            style={{ color: "#F97316" }}
          >
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {LISTINGS.map((listing) => (
            <Link
              key={listing.id}
              to={`/listing/${listing.id}`}
              className="block rounded-2xl overflow-hidden transition-transform active:scale-[0.98]"
              style={{ background: "white", boxShadow: "0 2px 16px rgba(30,58,95,0.08)" }}
            >
              {/* Photo */}
              <div className="relative h-44">
                <img
                  src={listing.photos[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {listing.compatibilityScore && (
                  <div
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-white text-xs font-bold"
                    style={{ background: "#F97316" }}
                  >
                    {listing.compatibilityScore}% match
                  </div>
                )}
                {listing.certificationLevel >= 2 && (
                  <div
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1"
                    style={{ background: "#1E3A5F" }}
                  >
                    <CheckCircle size={11} />
                    Certifié
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold mb-1" style={{ color: "#1E293B", fontSize: "15px" }}>
                  {listing.title}
                </h3>
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                  <MapPin size={12} />
                  {listing.district}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Square size={12} />
                    {listing.surfaceM2} m²
                  </div>
                  <div className="flex items-center gap-1">
                    <Bed size={12} />
                    {listing.nbRooms} pièces
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={12} style={{ color: "#F59E0B" }} />
                    {listing.owner.rating}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lg" style={{ color: "#1E3A5F" }}>
                      {listing.monthlyRent}€
                    </span>
                    <span className="text-gray-400 text-xs"> /mois</span>
                    <span className="text-gray-400 text-xs"> + {listing.charges}€ charges</span>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: "#EFF6FF", color: "#1E3A5F" }}
                  >
                    Disponible
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
