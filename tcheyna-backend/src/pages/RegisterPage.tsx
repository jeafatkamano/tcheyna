/**
 * RegisterPage.tsx — Inscription Tcheyna AOF
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";

const PAYS = ["Guinée", "Sénégal", "Côte d'Ivoire", "Ghana", "Nigeria"];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "", email: "", phone: "",
    password: "", role: "tenant" as "tenant" | "landlord",
    pays: "Guinée", ville: "",
  });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.full_name || !form.email || !form.password) {
      setError("Nom, email et mot de passe sont requis"); return;
    }
    setLoading(true); setError("");
    try {
      await register(form);
      navigate("/");
    } catch (e: any) {
      setError(e.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #0F2040 100%)" }}>

      <div className="mb-6 text-center">
        <h1 className="text-white font-bold tracking-tight" style={{ fontSize: 32 }}>tcheyna</h1>
        <p className="text-white/60 text-sm mt-1">Location immobilière de confiance</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl">
        <h2 className="font-bold text-slate-800 mb-5" style={{ fontSize: 20 }}>Créer un compte</h2>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg text-sm font-medium"
            style={{ background: "#FEE2E2", color: "#DC2626" }}>{error}</div>
        )}

        {/* Rôle */}
        <div className="flex gap-2 mb-4">
          {(["tenant", "landlord"] as const).map(r => (
            <button key={r} onClick={() => set("role", r)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition"
              style={{
                borderColor: form.role === r ? "#1E3A5F" : "#E2E8F0",
                background:  form.role === r ? "#1E3A5F" : "white",
                color:       form.role === r ? "white"   : "#64748B",
              }}>
              {r === "tenant" ? "🏠 Locataire" : "🔑 Propriétaire"}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {[
            { label: "Nom complet", key: "full_name", type: "text",     placeholder: "Aminata Diallo" },
            { label: "Email",       key: "email",     type: "email",    placeholder: "vous@exemple.com" },
            { label: "Téléphone",   key: "phone",     type: "tel",      placeholder: "+224 622 000 000" },
            { label: "Mot de passe",key: "password",  type: "password", placeholder: "••••••••" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input type={type} value={(form as any)[key]}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition"
              />
            </div>
          ))}

          {/* Pays */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pays</label>
            <select value={form.pays} onChange={e => set("pays", e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition bg-white">
              {PAYS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* Ville */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
            <input type="text" value={form.ville} onChange={e => set("ville", e.target.value)}
              placeholder="Conakry"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading}
          className="mt-5 w-full py-3 rounded-xl font-semibold text-white transition"
          style={{ background: loading ? "#94A3B8" : "#F97316", fontSize: 15 }}>
          {loading ? "Création…" : "Créer mon compte"}
        </button>

        <p className="text-center text-sm text-slate-500 mt-4">
          Déjà un compte ?{" "}
          <Link to="/login" className="font-semibold" style={{ color: "#1E3A5F" }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
