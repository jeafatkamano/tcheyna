import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [role, setRole] = useState<"tenant" | "landlord">("tenant");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Email et mot de passe sont obligatoires");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(role === "tenant" ? "/tenant/dashboard" : "/owner/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F0F4FA" }}>
      {/* Header */}
      <div className="px-6 pt-8 pb-4 flex items-center gap-3">
        <Link
          to="/"
          className="p-2 rounded-xl flex items-center justify-center"
          style={{ background: "#E8EEF8", color: "#1E3A5F" }}
        >
          <ArrowLeft size={20} />
        </Link>
        <span className="font-bold text-xl" style={{ color: "#1E3A5F" }}>
          Connexion
        </span>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-8 max-w-md w-full mx-auto">
        <div className="text-center mb-10">
          <span className="font-bold" style={{ color: "#1E3A5F", fontSize: "28px", letterSpacing: "-0.5px" }}>
            tcheyna
          </span>
          <p className="text-gray-500 mt-2 text-sm">Connectez-vous à votre espace</p>
        </div>

        {/* Role selector */}
        <div
          className="flex rounded-xl p-1 mb-8"
          style={{ background: "#E2EAF4" }}
        >
          {(["tenant", "landlord"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: role === r ? "#1E3A5F" : "transparent",
                color: role === r ? "white" : "#64748B",
              }}
            >
              {r === "tenant" ? "Locataire" : "Propriétaire"}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Adresse email
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "#94A3B8" }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl outline-none text-gray-800"
                style={{
                  background: "white",
                  border: "1.5px solid #E2E8F0",
                  fontSize: "15px",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "#94A3B8" }}
              />
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-12 py-3.5 rounded-xl outline-none text-gray-800"
                style={{
                  background: "white",
                  border: "1.5px solid #E2E8F0",
                  fontSize: "15px",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "#94A3B8" }}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <a href="#" className="text-sm font-semibold" style={{ color: "#F97316" }}>
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-transform active:scale-95 mt-4 disabled:opacity-60"
            style={{ background: "#F97316" }}
          >
            {loading ? "Connexion..." : "Se connecter"}
            {!loading && <ChevronRight size={18} />}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Pas encore de compte ?{"   "}
          <Link
            to="/onboarding/tenant"
            className="font-semibold"
            style={{ color: "#1E3A5F" }}
          >
             Créer un compte {" "}


          </Link>
        </p>
      </div>
    </div>
  );
}
