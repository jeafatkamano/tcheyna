import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  User,
  Home,
  ShieldCheck,
  Upload,
  Camera,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Compte", icon: User },
  { id: 2, label: "Annonce", icon: Home },
  { id: 3, label: "Certification", icon: ShieldCheck },
];

const CHECKLIST = [
  { id: "title", label: "Titre de propriété", hint: "Acte de propriété ou compromis" },
  { id: "photos", label: "3 photos minimum", hint: "Salon, chambre, cuisine/salle de bain" },
  { id: "dpe", label: "DPE (diagnostic énergétique)", hint: "Obligatoire depuis 2022" },
  { id: "insurance", label: "Attestation d'assurance PNO", hint: "Propriétaire non-occupant" },
  { id: "identity", label: "Pièce d'identité", hint: "Carte nationale ou passeport" },
];

export function OnboardingOwner() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set(["title", "photos", "identity"]));
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    title: "Beau 3 pièces lumineux — Bastille",
    city: "Paris",
    district: "11e arrondissement",
    address: "42 rue de la Roquette, 75011 Paris",
    type: "Appartement",
    surface: "65",
    rooms: "3",
    floor: "4",
    rent: "1450",
    charges: "80",
    deposit: "1450",
    available: "2026-04-01",
    description:
      "Appartement traversant au 4e étage avec ascenseur, entièrement rénové en 2024. Parquet chêne massif, double vitrage, cuisine équipée ouverte sur séjour.",
  });

  function toggleDoc(id: string) {
    setCheckedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function next() {
    if (step < 3) setStep(step + 1);
    else navigate("/owner/dashboard");
  }
  function back() {
    if (step > 1) setStep(step - 1);
    else navigate("/");
  }

  const certLevel = checkedDocs.size >= CHECKLIST.length ? 2 : checkedDocs.size >= 2 ? 1 : 0;

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
          <p className="text-white/60 text-xs font-medium">Inscription Propriétaire</p>
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
                    s.id < step ? "#10B981" : s.id === step ? "#F97316" : "rgba(255,255,255,0.12)",
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
                  style={{ background: s.id < step ? "#10B981" : "rgba(255,255,255,0.15)" }}
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
                En tant que propriétaire bailleur particulier.
              </p>
            </div>
            {[
              { key: "fullName", label: "Nom complet *", placeholder: "Prénom et Nom", type: "text" },
              { key: "email", label: "Email *", placeholder: "votre@email.com", type: "email" },
              { key: "password", label: "Mot de passe *", placeholder: "8 caractères min.", type: "password" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={(form as any)[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3.5 rounded-xl outline-none"
                  style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 2 — Listing */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 style={{ color: "#1E3A5F", fontWeight: 800, fontSize: "22px" }}>
                Votre annonce
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Décrivez votre bien pour attirer les bons candidats.
              </p>
            </div>

            {/* Photo upload placeholder */}
            <div
              className="rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer"
              style={{
                background: "#F8FAFC",
                border: "2px dashed #CBD5E1",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "#E2EAF4" }}
              >
                <Camera size={24} style={{ color: "#1E3A5F" }} />
              </div>
              <p className="text-sm font-semibold text-gray-600">Ajouter des photos</p>
              <p className="text-xs text-gray-400">3 photos minimum requises (JPG, PNG)</p>
            </div>

            {[
              { key: "title", label: "Titre de l'annonce *", placeholder: "Ex : Beau 3 pièces lumineux…" },
              { key: "address", label: "Adresse complète *", placeholder: "42 rue de la Roquette, 75011 Paris" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={(form as any)[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3.5 rounded-xl outline-none"
                  style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "surface", label: "Surface (m²)", placeholder: "65" },
                { key: "rooms", label: "Nb pièces", placeholder: "3" },
                { key: "floor", label: "Étage", placeholder: "4" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    value={(form as any)[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3.5 rounded-xl outline-none"
                    style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Type de bien
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl outline-none"
                  style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
                >
                  <option>Appartement</option>
                  <option>Studio</option>
                  <option>Maison</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "rent", label: "Loyer (€/mois) *" },
                { key: "charges", label: "Charges (€)" },
                { key: "deposit", label: "Dépôt (€)" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-xs">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    value={(form as any)[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-3 py-3.5 rounded-xl outline-none text-center"
                    style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3.5 rounded-xl outline-none resize-none"
                style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Disponible à partir du
              </label>
              <input
                type="date"
                value={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl outline-none"
                style={{ background: "white", border: "1.5px solid #E2E8F0", fontSize: "15px" }}
              />
            </div>
          </div>
        )}

        {/* Step 3 — Certification */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 style={{ color: "#1E3A5F", fontWeight: 800, fontSize: "22px" }}>
                Certifiez votre annonce
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Les annonces certifiées sont 3× plus visibles et inspirent confiance.
              </p>
            </div>

            {/* Cert level banner */}
            <div
              className="p-4 rounded-xl flex items-center gap-4"
              style={{
                background: certLevel >= 2 ? "#D1FAE5" : certLevel === 1 ? "#FEF3C7" : "#FEE2E2",
                border: `1.5px solid ${certLevel >= 2 ? "#6EE7B7" : certLevel === 1 ? "#FDE68A" : "#FECACA"}`,
              }}
            >
              <ShieldCheck
                size={28}
                style={{ color: certLevel >= 2 ? "#059669" : certLevel === 1 ? "#D97706" : "#DC2626", flexShrink: 0 }}
              />
              <div>
                <p
                  className="font-bold"
                  style={{
                    color: certLevel >= 2 ? "#065F46" : certLevel === 1 ? "#92400E" : "#991B1B",
                    fontSize: "15px",
                  }}
                >
                  {certLevel >= 2
                    ? "Annonce certifiée niveau 2 🏠"
                    : certLevel === 1
                    ? "Annonce certifiée niveau 1"
                    : "Certification insuffisante"}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: certLevel >= 2 ? "#059669" : certLevel === 1 ? "#D97706" : "#DC2626" }}
                >
                  {checkedDocs.size}/{CHECKLIST.length} documents fournis
                </p>
              </div>
            </div>

            {CHECKLIST.map((doc) => {
              const checked = checkedDocs.has(doc.id);
              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer"
                  style={{
                    background: "white",
                    border: `1.5px solid ${checked ? "#10B981" : "#E2E8F0"}`,
                  }}
                  onClick={() => toggleDoc(doc.id)}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: checked ? "#D1FAE5" : "#F8FAFC" }}
                  >
                    {checked ? (
                      <CheckCircle size={20} style={{ color: "#10B981" }} />
                    ) : (
                      <Upload size={20} style={{ color: "#94A3B8" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm"
                      style={{ color: checked ? "#059669" : "#1E293B" }}
                    >
                      {doc.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{doc.hint}</p>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: checked ? "#D1FAE5" : "#F1F5F9",
                      color: checked ? "#059669" : "#94A3B8",
                    }}
                  >
                    {checked ? "✓" : "+"}
                  </span>
                </div>
              );
            })}

            <div
              className="p-4 rounded-xl"
              style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE" }}
            >
              <p className="text-sm font-semibold text-blue-800">
                ℹ️ Niveau 3 — Propriétaire réputé
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Disponible après votre première location réussie. Vos locataires pourront vous laisser des avis.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="sticky bottom-0 px-5 py-5" style={{ background: "#F0F4FA" }}>
        <button
          onClick={next}
          className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-transform active:scale-95"
          style={{ background: "#F97316", fontSize: "16px" }}
        >
          {step === 3 ? "Publier mon annonce" : "Continuer"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
