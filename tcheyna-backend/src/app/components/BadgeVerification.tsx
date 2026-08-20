import { CheckCircle, Clock, Star, ShieldCheck } from "lucide-react";

interface BadgeVerificationProps {
  level: number;
  role: "tenant" | "owner";
  size?: "sm" | "md" | "lg";
}

const TENANT_BADGES = [
  { level: 1, label: "Compte créé", icon: CheckCircle, color: "#94A3B8" },
  { level: 2, label: "Profil confirmé", icon: ShieldCheck, color: "#3B82F6" },
  { level: 3, label: "Dossier prêt", icon: CheckCircle, color: "#10B981" },
  { level: 4, label: "Locataire référencé", icon: Star, color: "#F97316" },
];

const OWNER_BADGES = [
  { level: 1, label: "Compte créé", icon: CheckCircle, color: "#94A3B8" },
  { level: 2, label: "Bien certifié", icon: ShieldCheck, color: "#3B82F6" },
  { level: 3, label: "Propriétaire réputé", icon: Star, color: "#F97316" },
];

export function BadgeVerification({ level, role, size = "md" }: BadgeVerificationProps) {
  const badges = role === "tenant" ? TENANT_BADGES : OWNER_BADGES;
  const currentBadge = badges.filter((b) => b.level <= level).pop();

  if (!currentBadge) return null;

  const sizes = {
    sm: { icon: 12, text: "10px", px: "px-2 py-0.5", gap: "gap-1" },
    md: { icon: 14, text: "12px", px: "px-3 py-1", gap: "gap-1.5" },
    lg: { icon: 18, text: "14px", px: "px-4 py-2", gap: "gap-2" },
  };
  const s = sizes[size];

  return (
    <span
      className={`inline-flex items-center ${s.gap} ${s.px} rounded-full font-semibold`}
      style={{
        background: `${currentBadge.color}18`,
        color: currentBadge.color,
        fontSize: s.text,
        border: `1.5px solid ${currentBadge.color}40`,
      }}
    >
      <currentBadge.icon size={s.icon} />
      {currentBadge.label}
    </span>
  );
}

interface VerificationStepsProps {
  level: number;
  role: "tenant" | "owner";
}

export function VerificationSteps({ level, role }: VerificationStepsProps) {
  const badges = role === "tenant" ? TENANT_BADGES : OWNER_BADGES;

  return (
    <div className="space-y-3">
      {badges.map((badge) => {
        const done = badge.level <= level;
        const current = badge.level === level + 1;
        return (
          <div key={badge.level} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: done ? badge.color : current ? `${badge.color}20` : "#F1F5F9",
                border: current ? `2px dashed ${badge.color}` : "none",
              }}
            >
              {done ? (
                <CheckCircle size={16} color="#fff" />
              ) : current ? (
                <Clock size={16} style={{ color: badge.color }} />
              ) : (
                <span style={{ color: "#CBD5E1", fontSize: "12px", fontWeight: 600 }}>
                  {badge.level}
                </span>
              )}
            </div>
            <div className="flex-1">
              <p
                className="font-semibold"
                style={{
                  color: done ? "#1E293B" : current ? "#334155" : "#94A3B8",
                  fontSize: "14px",
                }}
              >
                {badge.label}
              </p>
            </div>
            {done && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "#D1FAE5", color: "#059669" }}
              >
                ✓ Validé
              </span>
            )}
            {current && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "#FEF3C7", color: "#D97706" }}
              >
                En cours
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface ScoreCircleProps {
  score: number;
  size?: number;
}

export function ScoreCircle({ score, size = 80 }: ScoreCircleProps) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-bold" style={{ color, fontSize: size * 0.22 }}>
          {score}
        </span>
        <span style={{ color: "#94A3B8", fontSize: size * 0.13 }}>/ 100</span>
      </div>
    </div>
  );
}
