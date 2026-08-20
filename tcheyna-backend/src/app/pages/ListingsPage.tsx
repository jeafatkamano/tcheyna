import { useState } from "react";
import { Link } from "react-router";
import { MapPin, Bed, Square, Star, CheckCircle, Search, SlidersHorizontal, X } from "lucide-react";
import { LISTINGS } from "../data/mockData";

export function ListingsPage() {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [maxBudget, setMaxBudget] = useState(2000);
  const [minSurface, setMinSurface] = useState(0);
  const [certOnly, setCertOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"match" | "price" | "surface">("match");

  const filtered = LISTINGS.filter((l) => {
    if (certOnly && l.certificationLevel < 2) return false;
    if (l.monthlyRent > maxBudget) return false;
    if (l.surfaceM2 < minSurface) return false;
    if (
      search &&
      !l.title.toLowerCase().includes(search.toLowerCase()) &&
      !l.district.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "match") return (b.compatibilityScore ?? 0) - (a.compatibilityScore ?? 0);
    if (sortBy === "price") return a.monthlyRent - b.monthlyRent;
    return b.surfaceM2 - a.surfaceM2;
  });

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="px-4 pt-6 pb-4" style={{ background: "#1E3A5F" }}>
        <h1 className="text-white font-bold mb-4" style={{ fontSize: "20px" }}>
          Annonces compatibles
        </h1>
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "#94A3B8" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par quartier, titre…"
            className="w-full pl-10 pr-12 py-3 rounded-xl outline-none"
            style={{ background: "white", fontSize: "14px" }}
          />
          <button
            onClick={() => setFilterOpen(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg"
            style={{ background: "#F0F4FA", color: "#1E3A5F" }}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Sort tabs */}
      <div
        className="flex gap-2 px-4 py-3 overflow-x-auto"
        style={{ background: "#1E3A5F", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        {(["match", "price", "surface"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all"
            style={{
              background: sortBy === s ? "#F97316" : "rgba(255,255,255,0.12)",
              color: sortBy === s ? "white" : "rgba(255,255,255,0.6)",
            }}
          >
            {s === "match" ? "Meilleur match" : s === "price" ? "Prix croissant" : "Plus grand"}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="px-4 py-3">
        <p className="text-gray-500 text-sm">
          <span className="font-bold" style={{ color: "#1E3A5F" }}>
            {filtered.length}
          </span>{" "}
          annonce{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Listings */}
      <div className="px-4 space-y-4">
        {filtered.map((listing) => (
          <Link
            key={listing.id}
            to={`/listing/${listing.id}`}
            className="block rounded-2xl overflow-hidden transition-transform active:scale-[0.98]"
            style={{ background: "white", boxShadow: "0 2px 16px rgba(30,58,95,0.08)" }}
          >
            <div className="relative h-44">
              <img src={listing.photos[0]} alt={listing.title} className="w-full h-full object-cover" />
              {listing.compatibilityScore && (
                <div
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-white text-xs font-bold"
                  style={{ background: "#F97316" }}
                >
                  {listing.compatibilityScore}% match
                </div>
              )}
              {listing.certificationLevel >= 2 && (
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1"
                  style={{ background: "#1E3A5F" }}
                >
                  <CheckCircle size={11} />
                  Certifié
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-1" style={{ color: "#1E293B", fontSize: "15px" }}>
                {listing.title}
              </h3>
              <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                <MapPin size={12} />
                {listing.district}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Square size={12} />
                  {listing.surfaceM2} m²
                </div>
                <div className="flex items-center gap-1">
                  <Bed size={12} />
                  {listing.nbRooms} pièces
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} style={{ color: "#F59E0B" }} />
                  {listing.owner.rating} ({listing.owner.reviewCount} avis)
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-lg" style={{ color: "#1E3A5F" }}>
                    {listing.monthlyRent}€
                  </span>
                  <span className="text-gray-400 text-xs"> /mois + {listing.charges}€ cc</span>
                </div>
                <span
                  className="text-xs px-3 py-1.5 rounded-full font-semibold"
                  style={{
                    background:
                      listing.status === "active" ? "#DCFCE7" : "#FEF3C7",
                    color:
                      listing.status === "active" ? "#15803D" : "#92400E",
                  }}
                >
                  {listing.status === "active"
                    ? "Disponible"
                    : listing.status === "pending"
                    ? "En attente"
                    : "Loué"}
                </span>
              </div>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">Aucune annonce ne correspond à vos critères.</p>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setFilterOpen(false)}
          />
          <div
            className="relative w-full rounded-t-3xl p-6 space-y-5"
            style={{ background: "white", maxHeight: "80vh", overflowY: "auto" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg" style={{ color: "#1E3A5F" }}>
                Filtres
              </h3>
              <button onClick={() => setFilterOpen(false)} style={{ color: "#64748B" }}>
                <X size={22} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget maximum : <span style={{ color: "#F97316" }}>{maxBudget}€/mois</span>
              </label>
              <input
                type="range"
                min={500}
                max={3000}
                step={50}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>500€</span>
                <span>3 000€</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Surface minimum : <span style={{ color: "#F97316" }}>{minSurface} m²</span>
              </label>
              <input
                type="range"
                min={0}
                max={200}
                step={5}
                value={minSurface}
                onChange={(e) => setMinSurface(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-sm" style={{ color: "#1E293B" }}>
                  Annonces certifiées uniquement
                </p>
                <p className="text-xs text-gray-400">Biens vérifiés par Tcheyna</p>
              </div>
              <button
                onClick={() => setCertOnly(!certOnly)}
                className="relative w-12 h-6 rounded-full transition-colors"
                style={{ background: certOnly ? "#F97316" : "#CBD5E1" }}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform"
                  style={{ transform: certOnly ? "translateX(26px)" : "translateX(4px)" }}
                />
              </button>
            </div>

            <button
              onClick={() => setFilterOpen(false)}
              className="w-full py-4 rounded-2xl font-semibold text-white"
              style={{ background: "#F97316" }}
            >
              Appliquer les filtres
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
