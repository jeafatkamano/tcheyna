/**
 * mockData.ts — Données de test Tcheyna AOF
 * Marché : Guinée, Sénégal, Côte d'Ivoire, Ghana, Nigeria
 * Utilisé uniquement en développement (VITE_USE_MOCK=true)
 */

import type { Listing, User, Match } from "./api/api";

// ─── Images Unsplash (réutilisées de l'ancien mockData) ──────────────────────
export const IMAGES = {
  apartment1: "https://images.unsplash.com/photo-1658288644949-4c09a9b30435?w=800&q=80",
  apartment2: "https://images.unsplash.com/photo-1737305457496-dc7503cdde1e?w=800&q=80",
  apartment3: "https://images.unsplash.com/photo-1757439402190-99b73ac8e807?w=800&q=80",
  apartment4: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80",
  woman1:     "https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?w=400&q=80",
  man1:       "https://images.unsplash.com/photo-1605298046196-e205d0d699d7?w=400&q=80",
};

// ─── Users mock ──────────────────────────────────────────────────────────────

export const MOCK_TENANT: User = {
  id: "t1",
  full_name: "Aminata Diallo",
  email: "aminata@example.com",
  phone: "+224 622 000 001",
  role: "tenant",
  pays: "Guinée",
  ville: "Conakry",
  quartier: "Ratoma",
  trust_level: 3,
  badge: "Identité vérifiée",
  phone_verified: true,
  cni_verified: true,
  avatar_url: IMAGES.woman1,
  preferred_lang: "fr",
  created_at: "2026-01-15T10:00:00Z",
};

export const MOCK_LANDLORD: User = {
  id: "o1",
  full_name: "Mamadou Bah",
  email: "mamadou@example.com",
  phone: "+224 628 000 002",
  role: "landlord",
  pays: "Guinée",
  ville: "Conakry",
  quartier: "Kaloum",
  trust_level: 4,
  badge: "Membre de confiance",
  phone_verified: true,
  cni_verified: true,
  avatar_url: IMAGES.man1,
  preferred_lang: "fr",
  created_at: "2025-11-10T08:00:00Z",
};

// ─── Listings mock AOF ───────────────────────────────────────────────────────

export const MOCK_LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "Bel appartement F3 — Ratoma",
    description:
      "Grand appartement de 3 chambres au 2e étage, entièrement rénové. Groupe électrogène, eau courante 24h/24, gardien. Proche des commodités et du marché de Ratoma.",
    pays: "Guinée",
    ville: "Conakry",
    quartier: "Ratoma",
    type_bien: "appartement",
    prix: 2500000,
    devise: "GNF",
    nb_pieces: 3,
    superficie: 90,
    equipements: {
      generateur: true,
      eau: true,
      wifi: false,
      securite: true,
      parking: true,
      climatisation: false,
    },
    status: "active",
    images: [IMAGES.apartment1, IMAGES.apartment3],
    landlord: MOCK_LANDLORD,
    created_at: "2026-03-10T08:00:00Z",
  },
  {
    id: "l2",
    title: "Studio moderne — Kaloum Centre",
    description:
      "Studio bien agencé au cœur de Kaloum. Climatisation, WiFi inclus, immeuble sécurisé avec digicode. Idéal pour professionnel ou étudiant.",
    pays: "Guinée",
    ville: "Conakry",
    quartier: "Kaloum",
    type_bien: "studio",
    prix: 1200000,
    devise: "GNF",
    nb_pieces: 1,
    superficie: 35,
    equipements: {
      generateur: true,
      eau: true,
      wifi: true,
      securite: true,
      parking: false,
      climatisation: true,
    },
    status: "active",
    images: [IMAGES.apartment2],
    landlord: MOCK_LANDLORD,
    created_at: "2026-03-12T10:00:00Z",
  },
  {
    id: "l3",
    title: "Villa F4 avec jardin — Dixinn",
    description:
      "Belle villa de 4 chambres avec jardin clôturé, 2 parkings, gardien résidentiel. Groupe électrogène 24h/24, connexion WiFi fibre. Quartier calme et résidentiel de Dixinn.",
    pays: "Guinée",
    ville: "Conakry",
    quartier: "Dixinn",
    type_bien: "maison",
    prix: 5000000,
    devise: "GNF",
    nb_pieces: 4,
    superficie: 180,
    equipements: {
      generateur: true,
      eau: true,
      wifi: true,
      securite: true,
      parking: true,
      climatisation: true,
    },
    status: "active",
    images: [IMAGES.apartment4, IMAGES.apartment1],
    landlord: MOCK_LANDLORD,
    created_at: "2026-03-08T09:00:00Z",
  },
  {
    id: "l4",
    title: "Appartement F2 — Plateau Dakar",
    description:
      "T2 lumineux au Plateau, quartier d'affaires de Dakar. Immeuble moderne, ascenseur, gardien. À 5 min à pied de la Place de l'Indépendance.",
    pays: "Sénégal",
    ville: "Dakar",
    quartier: "Plateau",
    type_bien: "appartement",
    prix: 350000,
    devise: "XOF",
    nb_pieces: 2,
    superficie: 55,
    equipements: {
      generateur: false,
      eau: true,
      wifi: true,
      securite: true,
      parking: false,
      climatisation: true,
    },
    status: "active",
    images: [IMAGES.apartment3],
    landlord: {
      ...MOCK_LANDLORD,
      id: "o2",
      full_name: "Ousmane Sow",
      pays: "Sénégal",
      ville: "Dakar",
    },
    created_at: "2026-03-14T11:00:00Z",
  },
];

// ─── Matches mock ────────────────────────────────────────────────────────────

export const MOCK_MATCHES: Match[] = [
  {
    id: "m1",
    tenant: MOCK_TENANT,
    listing: MOCK_LISTINGS[0],
    status: "accepted",
    message: "Bonjour, je suis très intéressée par votre appartement. Mon dossier est complet.",
    created_at: "2026-03-15T09:00:00Z",
  },
  {
    id: "m2",
    tenant: MOCK_TENANT,
    listing: MOCK_LISTINGS[1],
    status: "pending",
    message: "Bonjour, est-ce que le studio est toujours disponible ?",
    created_at: "2026-03-16T14:00:00Z",
  },
];

// ─── Helpers format ──────────────────────────────────────────────────────────

export function formatPrix(prix: number, devise: string): string {
  const symbols: Record<string, string> = {
    GNF: "GNF", XOF: "FCFA", GHS: "GH₵", NGN: "₦",
  };
  const sym = symbols[devise] || devise;
  return `${prix.toLocaleString("fr-FR")} ${sym}`;
}

export function badgeColor(trust_level: number): string {
  const colors: Record<number, string> = {
    1: "#94A3B8",
    2: "#3B82F6",
    3: "#10B981",
    4: "#F97316",
  };
  return colors[trust_level] || "#94A3B8";
}

export function equipementIcons(eq: Listing["equipements"]): string[] {
  const icons = [];
  if (eq.generateur)   icons.push("⚡ Générateur");
  if (eq.eau)          icons.push("🚰 Eau courante");
  if (eq.wifi)         icons.push("📶 WiFi");
  if (eq.securite)     icons.push("🔒 Sécurisé");
  if (eq.parking)      icons.push("🚗 Parking");
  if (eq.climatisation)icons.push("❄️ Climatisation");
  return icons;
}
