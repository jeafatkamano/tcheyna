/**
 * TenantProfile.tsx — Profil & Passeport locataire Tcheyna AOF
 */
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authAPI, passportAPI, TenantPassport } from "../../api/api";
import { Layout } from "../../components/Layout";
import { BadgeVerification, VerificationSteps, ScoreCircle } from "../../components/BadgeVerification";

export default function TenantProfile() {
  const { user, refreshUser } = useAuth();
  const [passport,  setPassport]  = useState<TenantPassport | null>(null);
  const [otpSent,   setOtpSent]   = useState(false);
  const [otpCode,   setOtpCode]   = useState("");
  const [otpDebug,  setOtpDebug]  = useState("");
  const [loading,   setLoading]   = useState(false);
  const [message,   setMessage]   = useState("");

  useEffect(() => {
    passportAPI.get().then(setPassport).catch(() => null);
  }, []);

  const sendOTP = async () => {
    setLoading(true);
    try {
      const res = await authAPI.sendOTP();
      setOtpSent(true);
      if (res.debug_code) setOtpDebug(`[DEV] Code : ${res.debug_code}`);
      setMessage("Code envoyé par SMS !");
    } catch (e: any) { setMessage(e.message); }
    finally { setLoading(false); }
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      await authAPI.verifyOTP(otpCode);
      await refreshUser();
      setMessage("Téléphone vérifié ! Niveau 2 atteint 🎉");
      setOtpSent(false);
    } catch (e: any) { setMessage(e.message); }
    finally { setLoading(false); }
  };

  const uploadDoc = async (type: "cni_recto" | "cni_verso" | "income", file: File) => {
    setLoading(true);
    try {
      await passportAPI.uploadDoc(type, file);
      const updated = await passportAPI.get();
      setPassport(updated);
      await refreshUser();
      setMessage("Document uploadé !");
    } catch (e: any) { setMessage(e.message); }
    finally { setLoading(false); }
  };

  return (
    <Layout userRole="tenant" onRoleSwitch={() => {}}>
      <div className="px-4 py-5 space-y-5">

        {/* Header profil */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
            style={{ background: "#1E3A5F" }}>
            {user?.full_name?.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="font-bold text-slate-800" style={{ fontSize: 18 }}>{user?.full_name}</h1>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <div className="mt-2">
              <BadgeVerification level={user?.trust_level || 1} role="tenant" />
            </div>
          </div>
        </div>

        {/* Score passeport */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <ScoreCircle score={passport?.score || 0} size={80} />
          <div>
            <p className="font-bold text-slate-800">Score passeport</p>
            <p className="text-slate-500 text-sm mt-0.5">
              {passport?.score || 0}/100 points
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Complétez vos documents pour augmenter votre score
            </p>
          </div>
        </div>

        {/* Étapes vérification */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-slate-800 mb-4">Niveau de confiance</h2>
          <VerificationSteps level={user?.trust_level || 1} role="tenant" />
        </div>

        {/* Message feedback */}
        {message && (
          <div className="px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: "#D1FAE5", color: "#059669" }}>
            {message}
          </div>
        )}
        {otpDebug && (
          <div className="px-4 py-3 rounded-xl text-xs font-mono"
            style={{ background: "#FEF3C7", color: "#D97706" }}>
            {otpDebug}
          </div>
        )}

        {/* Vérification téléphone */}
        {!user?.phone_verified && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-1">📱 Vérifier mon téléphone</h3>
            <p className="text-slate-500 text-sm mb-3">
              Recevez un code SMS pour atteindre le Niveau 2
            </p>
            {!otpSent ? (
              <button onClick={sendOTP} disabled={loading}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: loading ? "#94A3B8" : "#3B82F6" }}>
                {loading ? "Envoi…" : "Envoyer le code SMS"}
              </button>
            ) : (
              <div className="flex gap-2">
                <input value={otpCode} onChange={e => setOtpCode(e.target.value)}
                  placeholder="Code à 6 chiffres"
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none"
                  maxLength={6}
                />
                <button onClick={verifyOTP} disabled={loading}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: loading ? "#94A3B8" : "#10B981" }}>
                  Valider
                </button>
              </div>
            )}
          </div>
        )}

        {/* Upload documents */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3">📄 Documents</h3>
          <div className="space-y-3">
            {([
              { key: "cni_recto", label: "CNI / Passeport (recto)", done: !!passport?.docs_uploaded },
              { key: "cni_verso", label: "CNI (verso)",             done: !!passport?.docs_uploaded },
              { key: "income",    label: "Justificatif de revenus", done: !!passport?.income_verified },
            ] as { key: "cni_recto"|"cni_verso"|"income"; label: string; done: boolean }[]).map(({ key, label, done }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: done ? "#D1FAE5" : "#F1F5F9" }}>
                  {done ? <span style={{ color: "#059669" }}>✓</span>
                         : <span style={{ color: "#94A3B8" }}>📎</span>}
                </div>
                <p className="flex-1 text-sm font-medium text-slate-700">{label}</p>
                {!done && (
                  <label className="cursor-pointer">
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
                      onChange={e => e.target.files?.[0] && uploadDoc(key, e.target.files[0])}
                    />
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ background: "#EFF6FF", color: "#1E3A5F" }}>
                      Uploader
                    </span>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Infos compte */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3">Informations</h3>
          <div className="space-y-2 text-sm">
            {[
              { label: "Pays",       val: user?.pays },
              { label: "Ville",      val: user?.ville },
              { label: "Téléphone",  val: user?.phone || "Non renseigné" },
              { label: "Langue",     val: user?.preferred_lang === "fr" ? "Français" : "English" },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between">
                <span className="text-slate-500">{label}</span>
                <span className="font-medium text-slate-800">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
