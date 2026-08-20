import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Briefcase,
  Euro,
  Calendar,
  Users,
  ShieldCheck,
  X,
  MessageSquare,
} from "lucide-react";
import { TENANT_PROFILES } from "../data/mockData";
import { BadgeVerification, ScoreCircle, VerificationSteps } from "../components/BadgeVerification";

export function TenantProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tenant = TENANT_PROFILES.find((t) => t.id === id) ?? TENANT_PROFILES[0];

  return (
    <div className="min-h-screen" style={{ background: "#F0F4FA" }}>
      {/* Header */}
      <div className="px-4 pt-8 pb-8" style={{ background: "#1E3A5F" }}>
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.12)", color: "white" }}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-white font-bold" style={{ fontSize: "18px" }}>
            Profil locataire
          </h1>
        </div>

        {/* Profile header */}
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
              <BadgeVerification level={tenant.verificationLevel} role="tenant" />
            </div>
          </div>
          <ScoreCircle score={tenant.profileScore} size={68} />
        </div>
      </div>

      <div className="px-4 space-y-4 -mt-3 relative z-10 pb-32">
        {/* Key infos */}
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

        {/* Documents (summary — no raw docs shown) */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: "#1E293B" }}>
              Justificatifs
            </h3>
            <div
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "#D1FAE5", color: "#059669" }}
            >
              <ShieldCheck size={12} />
              Vérifiés par Tcheyna
            </div>
          </div>
          <div className="space-y-2.5">
            {tenant.documents.map((doc) => (
              <div key={doc.name} className="flex items-center gap-3">
                {doc.status === "verified" ? (
                  <CheckCircle size={16} style={{ color: "#10B981" }} />
                ) : doc.status === "pending" ? (
                  <Clock size={16} style={{ color: "#F59E0B" }} />
                ) : (
                  <AlertCircle size={16} style={{ color: "#94A3B8" }} />
                )}
                <span
                  className="text-sm flex-1"
                  style={{ color: doc.status === "missing" ? "#94A3B8" : "#1E293B" }}
                >
                  {doc.name}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background:
                      doc.status === "verified"
                        ? "#D1FAE5"
                        : doc.status === "pending"
                        ? "#FEF3C7"
                        : "#F1F5F9",
                    color:
                      doc.status === "verified"
                        ? "#059669"
                        : doc.status === "pending"
                        ? "#D97706"
                        : "#94A3B8",
                  }}
                >
                  {doc.status === "verified"
                    ? "✓ Vérifié"
                    : doc.status === "pending"
                    ? "⏳ En attente"
                    : "—"}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Les documents originaux sont protégés et ne sont jamais partagés directement.
          </p>
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
      </div>

      {/* CTA sticky */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 py-4 border-t border-gray-100"
        style={{ background: "#F0F4FA" }}
      >
        <div className="flex gap-3 max-w-lg mx-auto">
          <button
            className="flex-1 py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2"
            style={{ background: "#1E3A5F" }}
          >
            <MessageSquare size={18} />
            Contacter
          </button>
          <button
            className="flex-1 py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2"
            style={{ background: "#F97316" }}
          >
            <CheckCircle size={18} />
            Accepter
          </button>
          <button
            className="w-14 py-4 rounded-2xl flex items-center justify-center"
            style={{ background: "#FEE2E2", color: "#DC2626" }}
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
