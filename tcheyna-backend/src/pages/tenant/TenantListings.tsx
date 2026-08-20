/**
 * TenantListings.tsx — Recherche annonces Tcheyna AOF
 */
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listingsAPI, matchesAPI, Listing, ListingFilters } from "../../api/api";
import { Layout } from "../../components/Layout";
import { BadgeVerification } from "../../components/BadgeVerification";
import { formatPrix, equipementIcons } from "../../mockData";

const PAYS_VILLES: Record<string, string[]> = {
  "Guinée":        ["Conakry", "Kindia", "Kankan"],
  "Sénégal":       ["Dakar", "Thiès", "Saint-Louis"],
  "Côte d'Ivoire": ["Abidjan", "Yamoussoukro", "Bouaké"],
  "Ghana":         ["Accra", "Kumasi", "Tamale"],
  "Nigeria":       ["Lagos", "Abuja", "Port Harcourt"],
};

export default function TenantListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filters,  setFilters]  = useState<ListingFilters>({
    pays: user?.pays || "",
    ville: user?.ville || "",
    page: 1,
  });
  const [applying, setApplying] = useState<string | null>(null);
  const [applied,  setApplied]  = useState<Set<string>>(new Set());

  const fetchListings = () => {
    setLoading(true);
    listingsAPI.getAll(filters)
      .then(data => setListings(data.listings))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchListings(); }, [filters.pays, filters.ville]);

  const handleCandidate = async (listingId: string) => {
    setApplying(listingId);
    try {
      await matchesAPI.create(listingId, "Bonjour, je suis intéressé(e) par votre annonce.");
      setApplied(prev => new Set(prev).add(listingId));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setApplying(null);
    }
  };

  const setFilter = (k: keyof ListingFilters, v: any) =>
    setFilters(f => ({ ...f, [k]: v }));

  return (
    <Layout userRole="tenant" onRoleSwitch={() => {}}>
      <div className="px-4 py-5 space-y-4">

        {/* Header */}
        <div>
          <h1 className="font-bold text-slate-800" style={{ fontSize: 20 }}>Annonces</h1>
          <p className="text-slate-500 text-sm">{listings.length} logements disponibles</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Pays</label>
              <select value={filters.pays} onChange={e => setFilter("pays", e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none bg-white">
                <option value="">Tous les pays</option>
                {Object.keys(PAYS_VILLES).map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Ville</label>
              <select value={filters.ville} onChange={e => setFilter("ville", e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none bg-white">
                <option value="">Toutes</option>
                {(PAYS_VILLES[filters.pays || ""] || []).map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* Filtres équipements */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "has_generator", label: "⚡ Générateur" },
              { key: "has_water",     label: "🚰 Eau" },
              { key: "is_secured",    label: "🔒 Sécurisé" },
            ].map(({ key, label }) => (
              <button key={key}
                onClick={() => setFilter(key as any, !(filters as any)[key])}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border transition"
                style={{
                  background: (filters as any)[key] ? "#1E3A5F" : "white",
                  color:      (filters as any)[key] ? "white"   : "#64748B",
                  borderColor:(filters as any)[key] ? "#1E3A5F" : "#E2E8F0",
                }}>
                {label}
              </button>
            ))}
          </div>

          <button onClick={fetchListings}
            className="w-full py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#F97316" }}>
            Rechercher
          </button>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-44 bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🏘️</p>
            <p className="font-semibold text-slate-700">Aucune annonce trouvée</p>
            <p className="text-slate-500 text-sm mt-1">Modifiez vos critères de recherche</p>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map(listing => (
              <ListingCard
                key={listing.id}
                listing={listing}
                applied={applied.has(listing.id)}
                applying={applying === listing.id}
                onCandidate={() => handleCandidate(listing.id)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function ListingCard({ listing, applied, applying, onCandidate }: {
  listing: Listing;
  applied: boolean;
  applying: boolean;
  onCandidate: () => void;
}) {
  const icons = equipementIcons(listing.equipements);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="relative">
        <img
          src={listing.images[0] || "https://via.placeholder.com/400x200"}
          alt={listing.title}
          className="w-full h-44 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{ background: "rgba(0,0,0,0.6)", color: "white" }}>
            {listing.type_bien}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <BadgeVerification level={listing.landlord.trust_level} role="owner" size="sm" />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-slate-800">{listing.title}</h3>
        <p className="text-slate-500 text-sm mt-0.5">
          📍 {listing.quartier && `${listing.quartier}, `}{listing.ville}
        </p>

        <p className="font-bold mt-2" style={{ color: "#1E3A5F", fontSize: 18 }}>
          {formatPrix(listing.prix, listing.devise)}
          <span className="text-sm font-normal text-slate-500">/mois</span>
        </p>

        {/* Équipements */}
        {icons.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {icons.slice(0, 4).map(ic => (
              <span key={ic} className="text-xs px-2 py-1 rounded-full"
                style={{ background: "#F1F5F9", color: "#475569" }}>
                {ic}
              </span>
            ))}
          </div>
        )}

        {/* Propriétaire */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
            {listing.landlord.full_name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-700">{listing.landlord.full_name}</p>
            <p className="text-xs text-slate-500">{listing.landlord.badge}</p>
          </div>
          <button
            onClick={onCandidate}
            disabled={applied || applying}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition"
            style={{
              background: applied ? "#10B981" : applying ? "#94A3B8" : "#F97316",
            }}>
            {applied ? "✓ Envoyée" : applying ? "…" : "Candidater"}
          </button>
        </div>
      </div>
    </div>
  );
}
