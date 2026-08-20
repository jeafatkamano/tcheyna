import { useState } from "react";
import { Phone, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const API_BASE = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/+$/, "");

interface PhoneVerificationProps {
  phoneNumber?: string;
  onVerified?: (trustLevel: number) => void;
}

export function PhoneVerification({ phoneNumber, onVerified }: PhoneVerificationProps) {
  const [step, setStep] = useState<"input" | "otp">("input");
  const [phone, setPhone] = useState(phoneNumber || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError("Entrez un numéro de téléphone");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: getHeaders(),
      });

      if (response.ok) {
        setStep("otp");
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de l'envoi du code");
      }
    } catch (err) {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("Entrez le code OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ code: otp }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        onVerified?.(data.trust_level);
      } else {
        const data = await response.json();
        setError(data.error || "Erreur de vérification");
      }
    } catch (err) {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: getHeaders(),
      });

      if (response.ok) {
        setStep("otp");
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors du renvoi");
      }
    } catch (err) {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-xl border border-green-200">
        <CheckCircle size={48} className="text-green-600 mb-3" />
        <h3 className="font-bold text-green-900">Téléphone vérifié !</h3>
        <p className="text-sm text-green-700 mt-1">Votre numéro a été confirmé avec succès.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Phone size={20} className="text-blue-600" />
        <h3 className="font-bold text-slate-800">Vérification téléphone</h3>
      </div>

      {step === "input" ? (
        <>
          <Input
            type="tel"
            placeholder="+224 XXX XX XX XX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            className="text-base"
          />
          <Button
            onClick={handleSendOtp}
            disabled={loading || !phone.trim()}
            className="w-full"
            style={{ background: "#1E3A5F" }}
          >
            {loading ? "Envoi..." : "Envoyer le code OTP"}
          </Button>
        </>
      ) : (
        <>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              Un code a été envoyé à <strong>{phone}</strong>
            </p>
          </div>
          <Input
            type="text"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.slice(0, 6))}
            disabled={loading}
            maxLength={6}
            className="text-center text-2xl tracking-widest"
          />
          <Button
            onClick={handleVerifyOtp}
            disabled={loading || otp.length !== 6}
            className="w-full"
            style={{ background: "#1E3A5F" }}
          >
            {loading ? "Vérification..." : "Vérifier le code"}
          </Button>
          <button
            onClick={handleResendOtp}
            disabled={loading}
            className="w-full py-2 text-sm text-slate-600 hover:text-slate-900 underline"
          >
            Renvoyer le code
          </button>
        </>
      )}

      {error && (
        <div className="flex gap-2 p-3 bg-red-50 rounded-lg">
          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
