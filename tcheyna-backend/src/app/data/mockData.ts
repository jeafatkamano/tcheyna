// ─── Mock Data for Tcheyna ───────────────────────────────────────────────────

export const IMAGES = {
  apartment1: "https://images.unsplash.com/photo-1658288644949-4c09a9b30435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tJTIwUGFyaXN8ZW58MXx8fHwxNzcyNzU4NTMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  apartment2: "https://images.unsplash.com/photo-1737305457496-dc7503cdde1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwc3R1ZGlvJTIwYXBhcnRtZW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcyNzU4NTMxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  apartment3: "https://images.unsplash.com/photo-1757439402190-99b73ac8e807?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBhcGFydG1lbnQlMjBraXRjaGVuJTIwbW9kZXJufGVufDF8fHx8MTc3MjY3MTE3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  apartment4: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBiZWRyb29tJTIwZGVzaWdufGVufDF8fHx8MTc3MjY1NTAzNHww&ixlib=rb-4.1.0&q=80&w=1080",
  building: "https://images.unsplash.com/photo-1756674105261-673149ea8bb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIYXVzc21hbm4lMjBidWlsZGluZyUyMGZhY2FkZSUyMFBhcmlzJTIwc3RyZWV0fGVufDF8fHx8MTc3Mjc1ODUzNHww&ixlib=rb-4.1.0&q=80&w=1080",
  woman1: "https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyNjk0ODI3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  man1: "https://images.unsplash.com/photo-1605298046196-e205d0d699d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBzbWlsaW5nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyNjM3NjQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
};

export interface Listing {
  id: string;
  title: string;
  city: string;
  district: string;
  address: string;
  propertyType: string;
  surfaceM2: number;
  nbRooms: number;
  floor: number;
  monthlyRent: number;
  charges: number;
  deposit: number;
  availableFrom: string;
  status: "active" | "pending" | "rented";
  photos: string[];
  certificationLevel: number;
  owner: {
    id: string;
    name: string;
    avatar: string;
    verificationLevel: number;
    rating: number;
    reviewCount: number;
  };
  description: string;
  features: string[];
  compatibilityScore?: number;
}

export interface TenantProfile {
  id: string;
  name: string;
  avatar: string;
  occupation: string;
  monthlyIncome: number;
  hasGuarantor: boolean;
  guarantorIncome: number;
  verificationLevel: number;
  profileScore: number;
  availabilityDate: string;
  preferredCities: string[];
  budgetRange: { min: number; max: number };
  documents: { name: string; status: "verified" | "pending" | "missing" }[];
  bio: string;
}

export interface Match {
  id: string;
  listing: Listing;
  tenant: TenantProfile;
  status: "suggested" | "tenant_interested" | "owner_accepted" | "connected" | "rejected";
  createdAt: string;
  lastMessage?: string;
  unreadCount?: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt?: string;
}

// ─── Listings ─────────────────────────────────────────────────────────────────

export const LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "Beau 3 pièces lumineux — Bastille",
    city: "Paris",
    district: "11e arrondissement",
    address: "42 rue de la Roquette, 75011 Paris",
    propertyType: "Appartement",
    surfaceM2: 65,
    nbRooms: 3,
    floor: 4,
    monthlyRent: 1450,
    charges: 80,
    deposit: 1450,
    availableFrom: "2026-04-01",
    status: "active",
    photos: [IMAGES.apartment1, IMAGES.apartment3, IMAGES.apartment2],
    certificationLevel: 2,
    owner: {
      id: "o1",
      name: "Jean-Pierre M.",
      avatar: IMAGES.man1,
      verificationLevel: 3,
      rating: 4.8,
      reviewCount: 12,
    },
    description:
      "Appartement traversant au 4e étage avec ascenseur, entièrement rénové en 2024. Parquet chêne massif, double vitrage, cuisine équipée ouverte sur séjour. Très proche du métro Bastille (lignes 1, 5, 8).",
    features: ["Ascenseur", "Parquet", "Cuisine équipée", "Digicode", "Cave", "Double vitrage"],
    compatibilityScore: 94,
  },
  {
    id: "l2",
    title: "Studio moderne — République",
    city: "Paris",
    district: "10e arrondissement",
    address: "18 rue Beaurepaire, 75010 Paris",
    propertyType: "Studio",
    surfaceM2: 28,
    nbRooms: 1,
    floor: 2,
    monthlyRent: 880,
    charges: 50,
    deposit: 880,
    availableFrom: "2026-03-15",
    status: "active",
    photos: [IMAGES.apartment2, IMAGES.apartment1],
    certificationLevel: 2,
    owner: {
      id: "o2",
      name: "Marie L.",
      avatar: IMAGES.woman1,
      verificationLevel: 2,
      rating: 4.5,
      reviewCount: 5,
    },
    description:
      "Studio bien agencé au 2e étage sans ascenseur. Cuisine américaine équipée, salle de bain avec douche italienne. Secteur République très dynamique.",
    features: ["Interphone", "Cuisine équipée", "Double vitrage"],
    compatibilityScore: 87,
  },
  {
    id: "l3",
    title: "T2 calme avec balcon — Oberkampf",
    city: "Paris",
    district: "11e arrondissement",
    address: "5 passage Saint-Sébastien, 75011 Paris",
    propertyType: "Appartement",
    surfaceM2: 42,
    nbRooms: 2,
    floor: 3,
    monthlyRent: 1180,
    charges: 60,
    deposit: 1180,
    availableFrom: "2026-05-01",
    status: "active",
    photos: [IMAGES.apartment4, IMAGES.apartment3],
    certificationLevel: 3,
    owner: {
      id: "o3",
      name: "Thomas B.",
      avatar: IMAGES.man1,
      verificationLevel: 3,
      rating: 5.0,
      reviewCount: 8,
    },
    description:
      "Très beau T2 dans une impasse calme, balcon de 4m², parquet ancien, hauteur sous plafond 2,80m. Quartier Oberkampf, métro à 3 minutes.",
    features: ["Balcon", "Parquet", "Digicode", "Cave", "Gardien", "Double vitrage"],
    compatibilityScore: 78,
  },
];

// ─── Tenant Profiles ───────────────────────────────────────────────────────────

export const TENANT_PROFILES: TenantProfile[] = [
  {
    id: "t1",
    name: "Sophie D.",
    avatar: IMAGES.woman1,
    occupation: "Ingénieure logiciel",
    monthlyIncome: 3800,
    hasGuarantor: false,
    guarantorIncome: 0,
    verificationLevel: 3,
    profileScore: 88,
    availabilityDate: "2026-04-01",
    preferredCities: ["Paris"],
    budgetRange: { min: 900, max: 1500 },
    documents: [
      { name: "Pièce d'identité", status: "verified" },
      { name: "3 derniers bulletins de salaire", status: "verified" },
      { name: "Contrat de travail", status: "verified" },
      { name: "Avis d'imposition", status: "pending" },
      { name: "Garant", status: "missing" },
    ],
    bio: "CDI depuis 3 ans, chez une startup tech parisienne. Je cherche un appartement calme et bien situé pour m'y installer durablement. Non-fumeur, pas d'animaux.",
  },
  {
    id: "t2",
    name: "Marc R.",
    avatar: IMAGES.man1,
    occupation: "Consultant",
    monthlyIncome: 4500,
    hasGuarantor: true,
    guarantorIncome: 6000,
    verificationLevel: 4,
    profileScore: 97,
    availabilityDate: "2026-03-20",
    preferredCities: ["Paris"],
    budgetRange: { min: 800, max: 1400 },
    documents: [
      { name: "Pièce d'identité", status: "verified" },
      { name: "3 derniers bulletins de salaire", status: "verified" },
      { name: "Contrat de travail", status: "verified" },
      { name: "Avis d'imposition", status: "verified" },
      { name: "Garant", status: "verified" },
    ],
    bio: "Consultant en stratégie, en CDI depuis 5 ans. Très sérieux, organisé, j'entretiens très bien les logements où je vis. Deux références de propriétaires disponibles.",
  },
];

// ─── Matches ───────────────────────────────────────────────────────────────────

export const MATCHES: Match[] = [
  {
    id: "m1",
    listing: LISTINGS[0],
    tenant: TENANT_PROFILES[0],
    status: "connected",
    createdAt: "2026-03-01",
    lastMessage: "Bonjour, je suis disponible pour une visite samedi matin !",
    unreadCount: 2,
  },
  {
    id: "m2",
    listing: LISTINGS[2],
    tenant: TENANT_PROFILES[1],
    status: "owner_accepted",
    createdAt: "2026-03-03",
    lastMessage: undefined,
    unreadCount: 0,
  },
  {
    id: "m3",
    listing: LISTINGS[1],
    tenant: TENANT_PROFILES[0],
    status: "tenant_interested",
    createdAt: "2026-03-04",
    lastMessage: undefined,
    unreadCount: 0,
  },
];

// ─── Messages ─────────────────────────────────────────────────────────────────

export const MESSAGES: Message[] = [
  {
    id: "msg1",
    matchId: "m1",
    senderId: "t1",
    content: "Bonjour Jean-Pierre, j'ai bien lu votre annonce et votre logement correspond exactement à ce que je cherche.",
    createdAt: "2026-03-05T09:14:00Z",
    readAt: "2026-03-05T10:00:00Z",
  },
  {
    id: "msg2",
    matchId: "m1",
    senderId: "o1",
    content: "Bonjour Sophie ! Merci pour votre intérêt. J'ai bien reçu votre dossier, il est très complet. Seriez-vous disponible pour une visite ?",
    createdAt: "2026-03-05T10:05:00Z",
    readAt: "2026-03-05T11:00:00Z",
  },
  {
    id: "msg3",
    matchId: "m1",
    senderId: "t1",
    content: "Bonjour, je suis disponible pour une visite samedi matin !",
    createdAt: "2026-03-05T11:30:00Z",
  },
];

// ─── Current User ──────────────────────────────────────────────────────────────

export const CURRENT_TENANT: TenantProfile = TENANT_PROFILES[0];
export const CURRENT_OWNER_LISTING: Listing = LISTINGS[0];
