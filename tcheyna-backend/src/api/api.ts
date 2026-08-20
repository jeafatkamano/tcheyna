/// <reference types="vite/client" />
/**
 * api.ts — API Layer for Tcheyna
 * Connects the React frontend to the Flask REST backend
 * Base URL: VITE_API_URL in .env
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5173/";

// ─── Helper fetch avec JWT ──────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("access_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  // Token expiré → essayer de refresh
  if (res.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      const newToken = localStorage.getItem("access_token");
      const retryRes = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: { ...headers, Authorization: `Bearer ${newToken}` },
      });
      if (!retryRes.ok) throw new Error(await retryRes.text());
      return retryRes.json();
    } else {
      localStorage.clear();
      window.location.href = "/login";
      throw new Error("Session expirée");
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Erreur API");
  }

  return res.json();
}

async function tryRefreshToken(): Promise<boolean> {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return false;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { Authorization: `Bearer ${refresh}` },
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem("access_token", data.access_token);
    return true;
  } catch {
    return false;
  }
}

// ─── Types alignés avec le backend Flask ───────────────────────────────────

export interface User {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  role: "tenant" | "landlord" | "admin";
  pays: string;
  ville: string;
  quartier?: string;
  trust_level: number;
  badge: string;
  phone_verified: boolean;
  cni_verified: boolean;
  avatar_url?: string;
  preferred_lang: "fr" | "en";
  created_at: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  pays: string;
  ville: string;
  quartier?: string;
  type_bien: string;
  prix: number;
  devise: string;
  nb_pieces: number;
  superficie?: number;
  equipements: {
    generateur: boolean;
    eau: boolean;
    wifi: boolean;
    securite: boolean;
    parking: boolean;
    climatisation: boolean;
  };
  status: "active" | "matched" | "closed" | "pending";
  images: string[];
  landlord: User;
  created_at: string;
}

export interface Match {
  id: string;
  tenant: User;
  listing: Listing;
  status: "pending" | "accepted" | "rejected" | "completed";
  message?: string;
  created_at: string;
}

export interface TenantPassport {
  id: string;
  tenant_id: string;
  docs_uploaded: boolean;
  income_verified: boolean;
  score: number;
  situation_pro?: string;
  created_at: string;
}

export interface Review {
  id: string;
  reviewer: User;
  note: number;
  commentaire?: string;
  type_avis: string;
  created_at: string;
}

export interface GeoData {
  pays: { nom: string; devise: { code: string; symbol: string } }[];
}

// ─── AUTH ───────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (data: {
    email: string;
    password: string;
    full_name: string;
    role: "tenant" | "landlord";
    phone?: string;
    pays?: string;
    ville?: string;
  }) =>
    request<{ user: User; access_token: string; refresh_token: string }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(data) }
    ),

  login: (email: string, password: string) =>
    request<{ user: User; access_token: string; refresh_token: string }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),

  me: () => request<User>("/auth/me"),

  sendOTP: () =>
    request<{ message: string; debug_code?: string }>("/auth/send-otp", {
      method: "POST",
    }),

  verifyOTP: (code: string) =>
    request<{ message: string; trust_level: number; badge: string }>(
      "/auth/verify-otp",
      { method: "POST", body: JSON.stringify({ code }) }
    ),
};

// ─── LISTINGS ───────────────────────────────────────────────────────────────

export interface ListingFilters {
  pays?: string;
  ville?: string;
  quartier?: string;
  type?: string;
  prix_min?: number;
  prix_max?: number;
  has_water?: boolean;
  has_generator?: boolean;
  is_secured?: boolean;
  page?: number;
  per_page?: number;
  lang?: string;
}

export const listingsAPI = {
  getAll: (filters: ListingFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") params.append(k, String(v));
    });
    return request<{
      listings: Listing[];
      total: number;
      pages: number;
      page: number;
    }>(`/listings/?${params}`);
  },

  getOne: (id: string) => request<Listing>(`/listings/${id}`),

  create: (data: Partial<Listing> & { title_fr: string; description_fr: string }) =>
    request<{ listing: Listing }>("/listings/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Listing>) =>
    request<{ listing: Listing }>(`/listings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/listings/${id}`, { method: "DELETE" }),
};

// ─── MATCHES ────────────────────────────────────────────────────────────────

export const matchesAPI = {
  create: (listing_id: string, message?: string) =>
    request<{ match: Match }>("/matches/", {
      method: "POST",
      body: JSON.stringify({ listing_id, message }),
    }),

  mesCandidatures: () => request<Match[]>("/matches/mes-candidatures"),

  mesDemandes: () => request<Match[]>("/matches/mes-demandes"),

  updateStatus: (id: string, statut: "accepted" | "rejected") =>
    request<{ match: Match }>(`/matches/${id}/statut`, {
      method: "PUT",
      body: JSON.stringify({ statut }),
    }),
};

// ─── PASSPORT ───────────────────────────────────────────────────────────────

export const passportAPI = {
  get: () => request<TenantPassport>("/passport/"),

  update: (data: {
    revenu_mensuel?: number;
    devise?: string;
    employeur?: string;
    situation_pro?: string;
  }) =>
    request<{ passport: TenantPassport }>("/passport/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  uploadDoc: (docType: "cni_recto" | "cni_verso" | "passport" | "income", file: File) => {
    const form = new FormData();
    form.append("file", file);
    const token = localStorage.getItem("access_token");
    return fetch(`${BASE_URL}/passport/upload/${docType}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then((r) => r.json());
  },
};

// ─── REVIEWS ────────────────────────────────────────────────────────────────

export const reviewsAPI = {
  getForUser: (userId: string) =>
    request<{ reviews: Review[]; moyenne: number; total: number }>(
      `/reviews/user/${userId}`
    ),

  create: (data: {
    target_id: string;
    note: number;
    commentaire?: string;
    type_avis: string;
    match_id?: string;
  }) =>
    request<{ review: Review }>("/reviews/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ─── GEO ────────────────────────────────────────────────────────────────────

export const geoAPI = {
  getPays: () => request<GeoData>("/geo/pays"),

  getVilles: (pays: string) =>
    request<{ pays: string; villes: string[] }>(`/geo/villes/${encodeURIComponent(pays)}`),

  getQuartiers: (pays: string, ville: string) =>
    request<{ pays: string; ville: string; quartiers: string[] }>(
      `/geo/quartiers/${encodeURIComponent(pays)}/${encodeURIComponent(ville)}`
    ),
};

// ─── PAYMENTS ───────────────────────────────────────────────────────────────

export const paymentsAPI = {
  initier: (data: { montant: number; devise: string; methode?: string; match_id?: string }) =>
    request<{ payment_url: string; transaction_id: string }>("/payments/initier", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  mesPaiements: () => request<{ id: string; montant: number; statut: string }[]>(
    "/payments/mes-paiements"
  ),
};
