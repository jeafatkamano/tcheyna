import { Link } from "react-router";
import { ShieldCheck, Star, Zap, ArrowRight, CheckCircle, Users, Home } from "lucide-react";
import { IMAGES } from "../data/mockData";

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0F2040" }}>
      {/* Hero */}
      <div
        className="relative min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(160deg, #0F2040 0%, #1E3A5F 60%, #0F2040 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full opacity-10"
          style={{ background: "#F97316" }}
        />
        <div
          className="absolute bottom-[20%] left-[-60px] w-48 h-48 rounded-full opacity-10"
          style={{ background: "#F97316" }}
        />

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-6 pt-10 pb-4">
          <span
            className="text-white font-bold tracking-tight"
            style={{ fontSize: "26px", letterSpacing: "-0.5px" }}
          >
            tcheyna
          </span>
          <Link
            to="/login"
            className="text-white/70 hover:text-white font-medium text-sm transition-colors"
          >
            Se connecter
          </Link>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center py-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)" }}
          >
            <Zap size={14} style={{ color: "#F97316" }} />
            <span className="text-sm font-semibold" style={{ color: "#F97316" }}>
              Matching immobilier de confiance
            </span>
          </div>

          <h1
            className="text-white mb-6"
            style={{ fontSize: "clamp(32px, 8vw, 52px)", fontWeight: 800, lineHeight: 1.15 }}
          >
            Pas une meilleure{" "}
            <span style={{ color: "#F97316" }}>annonce</span>.
            <br />
            Une meilleure{" "}
            <span style={{ color: "#F97316" }}>mise en relation</span>.
          </h1>

          <p
            className="text-white/60 mb-12 max-w-sm"
            style={{ fontSize: "17px", lineHeight: 1.7 }}
          >
            Tcheyna connecte les locataires vérifiés aux propriétaires sérieux.
            Moins de contacts, mais des contacts qui ont du sens.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <Link
              to="/onboarding/tenant"
              className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold text-white transition-transform active:scale-95"
              style={{ background: "#F97316", fontSize: "16px" }}
            >
              <Users size={20} />
              Je cherche un logement
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/onboarding/owner"
              className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold transition-transform active:scale-95"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "white",
                border: "1.5px solid rgba(255,255,255,0.2)",
                fontSize: "16px",
              }}
            >
              <Home size={20} />
              Je mets en location
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div
          className="relative z-10 mx-4 mb-8 rounded-2xl px-6 py-5 grid grid-cols-3 gap-4"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {[
            { value: "98%", label: "Dossiers vérifiés" },
            { value: "3.2j", label: "Délai moyen" },
            { value: "4.9★", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <span className="text-white font-bold text-xl">{stat.value}</span>
              <span className="text-white/50 text-xs mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section className="px-6 py-16" style={{ background: "#F0F4FA" }}>
        <h2
          className="text-center mb-3"
          style={{ color: "#1E3A5F", fontWeight: 800, fontSize: "26px" }}
        >
          Comment ça marche ?
        </h2>
        <p className="text-center text-gray-500 mb-10 text-sm">
          Un système de confiance progressive, pour tout le monde.
        </p>

        <div className="space-y-5 max-w-md mx-auto">
          {[
            {
              step: "01",
              icon: ShieldCheck,
              title: "Vérification progressive",
              desc: "Chaque utilisateur construit son niveau de confiance par étapes. Plus vous êtes vérifié, plus vous avez accès.",
              color: "#1E3A5F",
            },
            {
              step: "02",
              icon: Zap,
              title: "Matching bidirectionnel",
              desc: "Propriétaires et locataires se choisissent mutuellement. Aucune mise en relation sans accord des deux parties.",
              color: "#F97316",
            },
            {
              step: "03",
              icon: Star,
              title: "Mise en relation garantie",
              desc: "Quand le match est validé, une messagerie privée s'ouvre. Passez à la visite directement.",
              color: "#10B981",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-4 p-5 rounded-2xl"
              style={{ background: "white", boxShadow: "0 2px 12px rgba(30,58,95,0.07)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${item.color}12` }}
              >
                <item.icon size={22} style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: item.color }}>
                  ÉTAPE {item.step}
                </p>
                <h3
                  className="font-bold mb-1"
                  style={{ color: "#1E293B", fontSize: "15px", lineHeight: 1.4 }}
                >
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <section className="px-6 py-12" style={{ background: "#1E3A5F" }}>
        <h2
          className="text-white text-center mb-8"
          style={{ fontWeight: 800, fontSize: "22px" }}
        >
          La confiance, au cœur du produit
        </h2>
        <div className="space-y-3 max-w-md mx-auto">
          {[
            "Dossiers locataires vérifiés avant mise en relation",
            "Annonces certifiées par pièces justificatives",
            "Aucun contact fantôme ou annonce obsolète",
            "Avis croisés après chaque location",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle size={18} style={{ color: "#F97316", flexShrink: 0 }} />
              <span className="text-white/80 text-sm">{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/onboarding/tenant"
            className="inline-flex items-center gap-2 py-4 px-8 rounded-2xl font-semibold text-white"
            style={{ background: "#F97316", fontSize: "16px" }}
          >
            Commencer gratuitement
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8 text-center border-t border-white/10"
        style={{ background: "#0F2040" }}
      >
        <span className="text-white font-bold text-xl tracking-tight">tcheyna</span>
        <p className="text-white/30 text-xs mt-2">
          © 2026 Tcheyna — Plateforme de matching immobilier de confiance
        </p>
      </footer>
    </div>
  );
}
