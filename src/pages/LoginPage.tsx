/**
 * LoginPage.tsx — Page de connexion Tcheyna AOF
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { setError("Remplissez tous les champs"); return; }
    setLoading(true); setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (e: any) {
      setError(e.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #0F2040 100%)" }}>

      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-white font-bold tracking-tight" style={{ fontSize: 36 }}>
          tcheyna
        </h1>
        <p className="text-white/60 text-sm mt-1">
          Location immobilière de confiance
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl">
        <h2 className="font-bold text-slate-800 mb-5" style={{ fontSize: 20 }}>
          Connexion
        </h2>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg text-sm font-medium"
            style={{ background: "#FEE2E2", color: "#DC2626" }}>
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition"
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-5 w-full py-3 rounded-xl font-semibold text-white transition"
          style={{ background: loading ? "#94A3B8" : "#1E3A5F", fontSize: 15 }}
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <p className="text-center text-sm text-slate-500 mt-4">
          Pas encore de compte ?{" "}
          <Link to="/register" className="font-semibold" style={{ color: "#1E3A5F" }}>
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
