import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle,
  User,
  FileText,
  Home,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { ScoreCircle } from "../components/BadgeVerification";

const STEPS = [
  { id: 1, label: "Compte", icon: User },
  { id: 2, label: "Profil", icon: Home },
  { id: 3, label: "Documents", icon: FileText },
  { id: 4, label: "Score", icon: ShieldCheck },
];

const DOCS = [
  { id: "id", label: "Pièce d'identité", hint: "Carte nationale ou passeport" },
  { id: "salary1", label: "Dernier bulletin de salaire", hint: "Moins de 3 mois" },
  { id: "salary2", label: "Bulletin M-2", hint: "Mois précédent" },
  { id: "salary3", label: "Bulletin M-3", hint: "Il y a 3 mois" },
  { id: "contract", label: "Contrat de travail", hint: "CDI, CDD, freelance…" },
  { id: "tax", label: "Avis d'imposition", hint: "Dernier avis disponible" },
];

export function OnboardingTenant() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPwd, setShowPwd] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<Set<string>>(new Set(["id", "salary1", "salary2"]));
  const [hasGuarantor, setHasGuarantor] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    occupation: "",
    income: "",
    city: "Paris",
    budgetMin: "800",
    budgetMax: "1400",
    availDate: "2026-04-01",
  });

  const score = Math.round((uploadedDocs.size / DOCS.length) * 60 + (hasGuarantor ? 25 : 0) + 13);

  function toggleDoc(id: string) {
    setUploadedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function next() {
    if (step < 4) setStep(step + 1);
    else navigate("/tenant/dashboard");
  }
  function back() {
    if (step > 1) setStep(step - 1);
    else navigate("/");
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F0F4FA" }}>
      {/* Top bar */}
      <div className="px-4 pt-8 pb-4 flex items-center gap-3" style={{ background: "#1E3A5F" }}>
        <button
          onClick={back}
          className="p-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.12)", color: "white" }}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <p className="text-white/60 text-xs font-medium">Inscription Locataire</p>
          <p className="text-white font-bold" style={{ fontSize: "16px" }}>
            {STEPS[step - 1].label}
          </p>
        </div>
        <Link to="/" className="text-white/50 text-sm">
          Annuler
        </Link>
      </div>

      {/* Step indicator */}
      <div className="px-4 pt-4 pb-6" style={{ background: "#1E3A5F" }}>
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    s.id < step
                      ? "#10B981"
                      : s.id === step
                      ? "#F97316"
                      : "rgba(255,255,255,0.12)",
                }}
              >
                {s.id < step ? (
                  <CheckCircle size={16} color="white" />
                ) : (
                  <s.icon size={14} color={s.id === step ? "white" : "rgba(255,255,255,0.4)"} />
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 rounded-full"
                  style={{
                    background: s.id < step ? "#10B981" : "rgba(255,255,255,0.15)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-white/50 text-xs mt-3">
          Étape {step} sur {STEPS.length}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-6 max-w-md mx-auto w-full">
        {/* Step 1 — Account */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 style={{ color: "#1E3A5F", fontWeight: 800, fontSize: "22px" }}>
                Créez votre compte
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Renseignez vos informations de base pour commencer.
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Adresse email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="votre@email.com"
                className="w-full px-4 py-3.5 rounded-xl outline-none"
                style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="8 caractères minimum"
                  className="w-full pr-12 px-4 py-3.5 rounded-xl outline-none"
                  style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nom complet *
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Prénom et Nom"
                className="w-full px-4 py-3.5 rounded-xl outline-none"
                style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Téléphone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+224 6 xx xx xx xx"
                className="w-full px-4 py-3.5 rounded-xl outline-none"
                style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
              />
            </div>
          </div>
        )}

        {/* Step 2 — Profile */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 style={{ color: "#1E3A5F", fontWeight: 800, fontSize: "22px" }}>
                Votre situation
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Ces informations aident les propriétaires à évaluer votre candidature.
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Profession *
              </label>
              <input
                type="text"
                value={form.occupation}
                onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                placeholder="Ex : Ingénieur, Médecin, Étudiant…"
                className="w-full px-4 py-3.5 rounded-xl outline-none"
                style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Revenus mensuels nets (€) *
              </label>
              <input
                type="number"
                value={form.income}
                onChange={(e) => setForm({ ...form, income: e.target.value })}
                placeholder="Ex : 2800"
                className="w-full px-4 py-3.5 rounded-xl outline-none"
                style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Ville recherchée
              </label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl outline-none"
                style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
              >
                <option>Paris</option>
                <option>Lyon</option>
                <option>Bordeaux</option>
                <option>Nantes</option>
                <option>Marseille</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget mensuel (€/mois)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={form.budgetMin}
                  onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
                  placeholder="Min"
                  className="flex-1 px-4 py-3.5 rounded-xl outline-none text-center"
                  style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
                />
                <span className="text-gray-400 font-medium">—</span>
                <input
                  type="number"
                  value={form.budgetMax}
                  onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
                  placeholder="Max"
                  className="flex-1 px-4 py-3.5 rounded-xl outline-none text-center"
                  style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Date d'emménagement souhaitée
              </label>
              <input
                type="date"
                value={form.availDate}
                onChange={(e) => setForm({ ...form, availDate: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl outline-none"
                style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Garant disponible ?
              </label>
              <div className="flex gap-3">
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    onClick={() => setHasGuarantor(val)}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: hasGuarantor === val ? "#1E3A5F" : "white",
                      color: hasGuarantor === val ? "white" : "#64748B",
                      border: `1.5px solid ${hasGuarantor === val ? "#1E3A5F" : "#E2E8F0"}`,
                    }}
                  >
                    {val ? "Oui" : "Non"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Documents */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 style={{ color: "#1E3A5F", fontWeight: 800, fontSize: "22px" }}>
                Vos documents
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Uploadez vos justificatifs pour obtenir votre badge "Dossier prêt".
              </p>
            </div>

            {/* Progress bar */}
            <div
              className="p-4 rounded-xl"
              style={{ background: "white", border: "1.5px solid #E2E8F0" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold" style={{ color: "#1E3A5F" }}>
                  Documents fournis
                </span>
                <span className="text-sm font-bold" style={{ color: "#F97316" }}>
                  {uploadedDocs.size}/{DOCS.length}
                </span>
              </div>
              <div className="h-2 rounded-full" style={{ background: "#E2E8F0" }}>
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${(uploadedDocs.size / DOCS.length) * 100}%`,
                    background: "#F97316",
                  }}
                />
              </div>
            </div>

            {DOCS.map((doc) => {
              const uploaded = uploadedDocs.has(doc.id);
              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer"
                  style={{
                    background: "white",
                    border: `1.5px solid ${uploaded ? "#10B981" : "#E2E8F0"}`,
                  }}
                  onClick={() => toggleDoc(doc.id)}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: uploaded ? "#D1FAE5" : "#F8FAFC" }}
                  >
                    {uploaded ? (
                      <CheckCircle size={20} style={{ color: "#10B981" }} />
                    ) : (
                      <Upload size={20} style={{ color: "#94A3B8" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm"
                      style={{ color: uploaded ? "#059669" : "#1E293B" }}
                    >
                      {doc.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{doc.hint}</p>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: uploaded ? "#D1FAE5" : "#F1F5F9",
                      color: uploaded ? "#059669" : "#94A3B8",
                    }}
                  >
                    {uploaded ? "✓ Déposé" : "Ajouter"}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Step 4 — Score */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 style={{ color: "#1E3A5F", fontWeight: 800, fontSize: "22px" }}>
                Votre score de confiance
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Votre passeport locataire est prêt !
              </p>
            </div>

            <div className="flex flex-col items-center py-6">
              <ScoreCircle score={score} size={120} />
              <p className="font-bold mt-4" style={{ color: "#1E3A5F", fontSize: "18px" }}>
                {score >= 80 ? "Excellent dossier !" : score >= 60 ? "Bon dossier" : "À compléter"}
              </p>
              <p className="text-gray-500 text-sm mt-1 text-center max-w-xs">
                {score >= 80
                  ? "Votre dossier sera mis en avant auprès des propriétaires."
                  : "Complétez vos documents pour améliorer votre score."}
              </p>
            </div>

            {/* Badge level */}
            <div
              className="p-5 rounded-2xl"
              style={{ background: "#1E3A5F" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={24} style={{ color: "#F97316" }} />
                <div>
                  <p className="text-white font-bold">Niveau de vérification</p>
                  <p className="text-white/60 text-sm">Niveau {uploadedDocs.size >= 3 ? 3 : 2} / 4</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: "✅ Email vérifié", done: true },
                  { label: "✅ Profil complété", done: true },
                  { label: `${uploadedDocs.size >= 3 ? "✅" : "⏳"} Dossier prêt (${uploadedDocs.size}/${DOCS.length} docs)`, done: uploadedDocs.size >= 3 },
                  { label: "🔒 Avis de propriétaires (phase 2)", done: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: item.done ? "white" : "rgba(255,255,255,0.4)" }}
                  >
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="p-4 rounded-xl"
              style={{ background: "#FFF7ED", border: "1.5px solid #FED7AA" }}
            >
              <p className="text-sm font-semibold" style={{ color: "#92400E" }}>
                💡 Pour améliorer votre score
              </p>
              <p className="text-xs text-orange-700 mt-1">
                {uploadedDocs.size < DOCS.length
                  ? `Ajoutez encore ${DOCS.length - uploadedDocs.size} document(s) pour atteindre le niveau 3.`
                  : !hasGuarantor
                  ? "Ajoutez un garant pour booster votre score de +25 pts."
                  : "Demandez des avis à vos anciens propriétaires pour le niveau 4."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="sticky bottom-0 px-5 py-5" style={{ background: "#F0F4FA" }}>
        <button
          onClick={next}
          className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-transform active:scale-95"
          style={{ background: "#F97316", fontSize: "16px" }}
        >
          {step === 4 ? "Accéder à mon espace" : "Continuer"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
