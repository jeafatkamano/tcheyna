import { useState } from "react";
import {
  CheckCircle,
  Edit3,
  Eye,
  Calendar,
  MapPin,
  Square,
  Bed,
  Euro,
  ChevronRight,
  Layers,
  Star,
  Camera,
  ShieldCheck,
} from "lucide-react";
import { CURRENT_OWNER_LISTING } from "../data/mockData";
import { BadgeVerification } from "../components/BadgeVerification";

const CHECKLIST_ITEMS = [
  { id: "title", label: "Titre de propriété", done: true },
  { id: "photos", label: "3 photos minimum", done: true },
  { id: "dpe", label: "DPE (diagnostic énergétique)", done: false },
  { id: "insurance", label: "Attestation d'assurance PNO", done: false },
  { id: "identity", label: "Pièce d'identité propriétaire", done: true },
];

export function OwnerListing() {
  const listing = CURRENT_OWNER_LISTING;
  const [photoIdx, setPhotoIdx] = useState(0);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<"active" | "pending" | "rented">(listing.status);

  const doneCount = CHECKLIST_ITEMS.filter((i) => i.done).length;
  const certPct = Math.round((doneCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-5" style={{ background: "#1E3A5F" }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white font-bold" style={{ fontSize: "20px" }}>
            Mon annonce
          </h1>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: "rgba(249,115,22,0.2)", color: "#F97316" }}
          >
            <Edit3 size={15} />
            {editing ? "Enregistrer" : "Modifier"}
          </button>
        </div>

        {/* Status selector */}
        <div className="flex gap-2">
          {(["active", "pending", "rented"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background:
                  status === s
                    ? s === "active"
                      ? "#10B981"
                      : s === "pending"
                      ? "#F59E0B"
                      : "#6B7280"
                    : "rgba(255,255,255,0.08)",
                color: status === s ? "white" : "rgba(255,255,255,0.5)",
              }}
            >
              {s === "active" ? "Actif" : s === "pending" ? "En attente" : "Loué"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-5 pt-4">
        {/* Photos */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
        >
          <div className="relative h-52">
            <img
              src={listing.photos[photoIdx]}
              alt="Photo du bien"
              className="w-full h-full object-cover"
            />
            {/* Photo dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {listing.photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPhotoIdx(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === photoIdx ? "20px" : "6px",
                    height: "6px",
                    background: i === photoIdx ? "white" : "rgba(255,255,255,0.5)",
                  }}
                />
              ))}
            </div>
            {/* Edit photo btn */}
            <button
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-semibold"
              style={{ background: "rgba(0,0,0,0.4)" }}
            >
              <Camera size={13} />
              Gérer les photos
            </button>
          </div>

          <div className="p-4">
            <h2 className="font-bold mb-1" style={{ color: "#1E293B", fontSize: "16px" }}>
              {listing.title}
            </h2>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
              <MapPin size={12} /> {listing.address}
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { icon: Square, value: `${listing.surfaceM2}m²`, label: "Surface" },
                { icon: Bed, value: `${listing.nbRooms}P`, label: "Pièces" },
                { icon: Layers, value: `Ét.${listing.floor}`, label: "Étage" },
                { icon: Euro, value: `${listing.charges}€`, label: "Charges" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-1"
                    style={{ background: "#F0F4FA" }}
                  >
                    <item.icon size={14} style={{ color: "#1E3A5F" }} />
                  </div>
                  <span className="font-bold text-xs" style={{ color: "#1E293B" }}>
                    {item.value}
                  </span>
                  <span className="text-xs text-gray-400">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div>
                <span className="font-bold text-xl" style={{ color: "#1E3A5F" }}>
                  {listing.monthlyRent}€
                </span>
                <span className="text-gray-400 text-xs"> /mois + {listing.charges}€ cc</span>
              </div>
              <div>
                <span className="font-bold" style={{ color: "#1E293B" }}>
                  {listing.deposit}€
                </span>
                <span className="text-gray-400 text-xs"> dépôt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Eye, label: "Vues (7j)", value: "127", color: "#3B82F6" },
            { icon: Star, label: "Favoris", value: "18", color: "#F59E0B" },
            { icon: Calendar, label: "Dispo", value: "1 avr", color: "#10B981" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-4 flex flex-col items-center text-center"
              style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
            >
              <s.icon size={20} style={{ color: s.color }} />
              <span className="font-bold text-lg mt-1" style={{ color: "#1E293B" }}>
                {s.value}
              </span>
              <span className="text-xs text-gray-400">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Certification checklist */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold" style={{ color: "#1E293B" }}>
              Checklist de certification
            </h3>
            <BadgeVerification level={listing.certificationLevel} role="owner" size="sm" />
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-500">Avancement</span>
              <span className="font-bold" style={{ color: "#F97316" }}>
                {doneCount}/{CHECKLIST_ITEMS.length}
              </span>
            </div>
            <div className="h-2 rounded-full" style={{ background: "#E2E8F0" }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${certPct}%`, background: certPct === 100 ? "#10B981" : "#F97316" }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: item.done ? "#D1FAE5" : "#F1F5F9" }}
                >
                  {item.done ? (
                    <CheckCircle size={16} style={{ color: "#10B981" }} />
                  ) : (
                    <ShieldCheck size={16} style={{ color: "#CBD5E1" }} />
                  )}
                </div>
                <span
                  className="flex-1 text-sm"
                  style={{ color: item.done ? "#059669" : "#94A3B8", fontWeight: item.done ? 500 : 400 }}
                >
                  {item.label}
                </span>
                {!item.done && (
                  <button
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "#FFF7ED", color: "#F97316" }}
                  >
                    + Ajouter
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold" style={{ color: "#1E293B" }}>
              Description
            </h3>
            <button style={{ color: "#F97316" }}>
              <Edit3 size={16} />
            </button>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
        </div>

        {/* Features */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
        >
          <h3 className="font-bold mb-3" style={{ color: "#1E293B" }}>
            Équipements
          </h3>
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
            <button
              className="px-3 py-1.5 rounded-full text-xs font-semibold border-dashed border-2"
              style={{ borderColor: "#CBD5E1", color: "#94A3B8" }}
            >
              + Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
