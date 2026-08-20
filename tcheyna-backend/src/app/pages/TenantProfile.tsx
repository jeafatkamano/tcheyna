import { Link } from "react-router";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Edit3,
  Download,
  MapPin,
  Briefcase,
  Euro,
  Calendar,
  Users,
  ChevronRight,
} from "lucide-react";
import { CURRENT_TENANT } from "../data/mockData";
import { BadgeVerification, ScoreCircle, VerificationSteps } from "../components/BadgeVerification";

function DocStatusIcon({ status }: { status: "verified" | "pending" | "missing" }) {
  if (status === "verified") return <CheckCircle size={18} style={{ color: "#10B981" }} />;
  if (status === "pending") return <Clock size={18} style={{ color: "#F59E0B" }} />;
  return <AlertCircle size={18} style={{ color: "#EF4444" }} />;
}

function DocStatusLabel({ status }: { status: "verified" | "pending" | "missing" }) {
  if (status === "verified")
    return (
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ background: "#D1FAE5", color: "#059669" }}
      >
        Vérifié
      </span>
    );
  if (status === "pending")
    return (
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ background: "#FEF3C7", color: "#D97706" }}
      >
        En attente
      </span>
    );
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: "#FEE2E2", color: "#DC2626" }}
    >
      Manquant
    </span>
  );
}

export function TenantProfile() {
  const tenant = CURRENT_TENANT;

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-8" style={{ background: "#1E3A5F" }}>
        <div className="flex items-start justify-between mb-5">
          <h1 className="text-white font-bold" style={{ fontSize: "20px" }}>
            Mon profil locataire
          </h1>
          <button
            className="p-2 rounded-xl flex items-center gap-1.5 text-sm font-semibold"
            style={{ background: "rgba(249,115,22,0.2)", color: "#F97316" }}
          >
            <Edit3 size={15} />
            Modifier
          </button>
        </div>

        {/* Profile card */}
        <div
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 flex-shrink-0">
            <img src={tenant.avatar} alt={tenant.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-lg">{tenant.name}</h2>
            <p className="text-white/60 text-sm">{tenant.occupation}</p>
            <div className="mt-2">
              <BadgeVerification level={tenant.verificationLevel} role="tenant" size="sm" />
            </div>
          </div>
          <ScoreCircle score={tenant.profileScore} size={64} />
        </div>
      </div>

      <div className="px-4 space-y-5 -mt-4 relative z-10">
        {/* Info cards */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
        >
          <h3 className="font-bold mb-4" style={{ color: "#1E293B" }}>
            Situation
          </h3>
          <div className="space-y-3">
            {[
              { icon: Briefcase, label: "Profession", value: tenant.occupation },
              {
                icon: Euro,
                label: "Revenus mensuels nets",
                value: `${tenant.monthlyIncome.toLocaleString("fr-FR")} €`,
              },
              {
                icon: Users,
                label: "Garant",
                value: tenant.hasGuarantor
                  ? `Oui — ${tenant.guarantorIncome.toLocaleString("fr-FR")} €/mois`
                  : "Non",
              },
              {
                icon: MapPin,
                label: "Ville recherchée",
                value: tenant.preferredCities.join(", "),
              },
              {
                icon: Euro,
                label: "Budget",
                value: `${tenant.budgetRange.min} – ${tenant.budgetRange.max} €/mois`,
              },
              {
                icon: Calendar,
                label: "Disponible à partir du",
                value: new Date(tenant.availabilityDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }),
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#F0F4FA" }}
                >
                  <item.icon size={16} style={{ color: "#1E3A5F" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm font-semibold" style={{ color: "#1E293B" }}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
        >
          <h3 className="font-bold mb-3" style={{ color: "#1E293B" }}>
            Présentation
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">{tenant.bio}</p>
        </div>

        {/* Documents */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: "#1E293B" }}>
              Documents
            </h3>
            <span className="text-xs text-gray-400">
              {tenant.documents.filter((d) => d.status === "verified").length}/
              {tenant.documents.length} vérifiés
            </span>
          </div>
          <div className="space-y-3">
            {tenant.documents.map((doc) => (
              <div
                key={doc.name}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "#F8FAFC" }}
              >
                <DocStatusIcon status={doc.status} />
                <span className="flex-1 text-sm font-medium" style={{ color: "#1E293B" }}>
                  {doc.name}
                </span>
                <div className="flex items-center gap-2">
                  <DocStatusLabel status={doc.status} />
                  {doc.status === "verified" && (
                    <button style={{ color: "#94A3B8" }}>
                      <Download size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            className="w-full mt-4 py-3 rounded-xl text-sm font-semibold border-2 border-dashed transition-colors"
            style={{ borderColor: "#E2E8F0", color: "#94A3B8" }}
          >
            + Ajouter un document
          </button>
        </div>

        {/* Verification path */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
        >
          <h3 className="font-bold mb-4" style={{ color: "#1E293B" }}>
            Parcours de vérification
          </h3>
          <VerificationSteps level={tenant.verificationLevel} role="tenant" />
        </div>

        {/* Action tip */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "#1E3A5F" }}
        >
          <p className="text-white font-semibold text-sm mb-1">
            🎯 Prochaine étape : Niveau {tenant.verificationLevel + 1}
          </p>
          <p className="text-white/60 text-xs leading-relaxed">
            Ajoutez votre avis d'imposition pour atteindre le niveau 4 — "Locataire référencé" — et être mis en avant dans le matching.
          </p>
          <button
            className="mt-3 flex items-center gap-1 text-sm font-semibold"
            style={{ color: "#F97316" }}
          >
            Compléter mon dossier <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
