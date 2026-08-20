import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Square,
  Star,
  CheckCircle,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Calendar,
  Euro,
} from "lucide-react";
import { LISTINGS } from "../data/mockData";
import { BadgeVerification } from "../components/BadgeVerification";

export function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = LISTINGS.find((l) => l.id === id) ?? LISTINGS[0];
  const [photoIdx, setPhotoIdx] = useState(0);
  const [interested, setInterested] = useState(false);
  const [saved, setSaved] = useState(false);

  function prevPhoto() {
    setPhotoIdx((prev) => (prev === 0 ? listing.photos.length - 1 : prev - 1));
  }
  function nextPhoto() {
    setPhotoIdx((prev) => (prev === listing.photos.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="min-h-screen" style={{ background: "#F0F4FA" }}>
      {/* Photo carousel */}
      <div className="relative h-64 sm:h-80">
        <img
          src={listing.photos[photoIdx]}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />

        {/* Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.35)", color: "white" }}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setSaved(!saved)}
              className="p-2 rounded-xl backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.35)" }}
            >
              <Heart size={20} fill={saved ? "#F97316" : "none"} stroke={saved ? "#F97316" : "white"} />
            </button>
            <button
              className="p-2 rounded-xl backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.35)", color: "white" }}
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Photo navigation */}
        {listing.photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.3)", color: "white" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.3)", color: "white" }}
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {listing.photos.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all"
                  style={{
                    width: i === photoIdx ? "20px" : "6px",
                    height: "6px",
                    background: i === photoIdx ? "white" : "rgba(255,255,255,0.5)",
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          {listing.certificationLevel >= 2 && (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1"
              style={{ background: "#1E3A5F" }}
            >
              <CheckCircle size={11} /> Certifié
            </span>
          )}
          {listing.compatibilityScore && (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: "#F97316" }}
            >
              {listing.compatibilityScore}% match
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-5 max-w-lg mx-auto">
        {/* Title block */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <h1 className="font-bold" style={{ color: "#1E293B", fontSize: "18px", lineHeight: 1.35 }}>
              {listing.title}
            </h1>
            <div className="flex-shrink-0 text-right">
              <div className="font-bold" style={{ color: "#1E3A5F", fontSize: "20px" }}>
                {listing.monthlyRent}€
              </div>
              <div className="text-xs text-gray-400">/mois</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
            <MapPin size={14} />
            {listing.address}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Square, value: `${listing.surfaceM2}m²`, label: "Surface" },
              { icon: Bed, value: `${listing.nbRooms}P`, label: "Pièces" },
              { icon: Layers, value: `Ét.${listing.floor}`, label: "Étage" },
              { icon: Euro, value: `${listing.charges}€`, label: "Charges" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
                  style={{ background: "#F0F4FA" }}
                >
                  <item.icon size={16} style={{ color: "#1E3A5F" }} />
                </div>
                <span className="font-bold text-sm" style={{ color: "#1E293B" }}>
                  {item.value}
                </span>
                <span className="text-xs text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
        >
          <h2 className="font-bold mb-3" style={{ color: "#1E293B" }}>
            Description
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
        </div>

        {/* Features */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
        >
          <h2 className="font-bold mb-3" style={{ color: "#1E293B" }}>
            Équipements et services
          </h2>
          <div className="flex flex-wrap gap-2">
            {listing.features.map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: "#EFF6FF", color: "#1E3A5F" }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: "#ECFDF5", border: "1.5px solid #A7F3D0" }}
        >
          <Calendar size={20} style={{ color: "#059669" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "#065F46" }}>
              Disponible à partir du{" "}
              {new Date(listing.availableFrom).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Owner card */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
        >
          <h2 className="font-bold mb-4" style={{ color: "#1E293B" }}>
            Propriétaire
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
              <img
                src={listing.owner.avatar}
                alt={listing.owner.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-bold" style={{ color: "#1E293B" }}>
                {listing.owner.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <BadgeVerification level={listing.owner.verificationLevel} role="owner" size="sm" />
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <Star size={13} style={{ color: "#F59E0B" }} />
                <span className="text-sm font-semibold" style={{ color: "#1E293B" }}>
                  {listing.owner.rating}
                </span>
                <span className="text-xs text-gray-400">
                  ({listing.owner.reviewCount} avis)
                </span>
              </div>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#F0F4FA" }}
            >
              <Shield size={18} style={{ color: "#1E3A5F" }} />
            </div>
          </div>
        </div>

        {/* Deposit info */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "#FFF7ED", border: "1.5px solid #FED7AA" }}
        >
          <p className="text-sm font-semibold" style={{ color: "#92400E" }}>
            💰 Coût d'entrée estimé
          </p>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-orange-700">1er loyer + charges</span>
            <span className="text-xs font-bold text-orange-900">
              {listing.monthlyRent + listing.charges}€
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-orange-700">Dépôt de garantie</span>
            <span className="text-xs font-bold text-orange-900">{listing.deposit}€</span>
          </div>
          <div className="border-t border-orange-200 mt-2 pt-2 flex justify-between">
            <span className="text-xs font-semibold text-orange-800">Total</span>
            <span className="text-sm font-bold text-orange-900">
              {listing.monthlyRent + listing.charges + listing.deposit}€
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="sticky bottom-0 px-4 py-4 border-t border-gray-100" style={{ background: "#F0F4FA" }}>
        {interested ? (
          <div
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-semibold"
            style={{ background: "#10B981" }}
          >
            <CheckCircle size={20} />
            Intérêt envoyé ! Le propriétaire va examiner votre dossier.
          </div>
        ) : (
          <button
            onClick={() => setInterested(true)}
            className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-transform active:scale-95"
            style={{ background: "#F97316", fontSize: "16px" }}
          >
            Je suis intéressé(e)
          </button>
        )}
      </div>
    </div>
  );
}
