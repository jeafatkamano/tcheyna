/**
 * OwnerListing.tsx — Publication et gestion d'annonce propriétaire
 */
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listingsAPI, Listing } from "../../api/api";
import { Layout } from "../../components/Layout";
import { formatPrix } from "../../mockData";

const PAYS_VILLES: Record<string, string[]> = {
  "Guinée":        ["Conakry", "Kindia", "Kankan"],
  "Sénégal":       ["Dakar", "Thiès", "Saint-Louis"],
  "Côte d'Ivoire": ["Abidjan", "Yamoussoukro", "Bouaké"],
  "Ghana":         ["Accra", "Kumasi", "Tamale"],
  "Nigeria":       ["Lagos", "Abuja", "Port Harcourt"],
};

const DEVISES: Record<string, string> = {
  "Guinée": "GNF", "Sénégal": "XOF", "Côte d'Ivoire": "XOF",
  "Ghana": "GHS", "Nigeria": "NGN",
};

export default function OwnerListing() {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [message,    setMessage]    = useState("");

  const [form, setForm] = useState({
    title_fr: "", description_fr: "",
    pays: user?.pays || "Guinée", ville: user?.ville || "",
    quartier: "", type_bien: "appartement",
    prix: "", nb_pieces: "1",
    has_generator: false, has_water: false,
    has_wifi: false, is_secured: false,
    has_parking: false, has_ac: false,
  });

  useEffect(() => {
    listingsAPI.getAll({ pays: user?.pays })
      .then(d => setMyListings(d.listings.filter(l => l.landlord.id === user?.id)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title_fr || !form.description_fr || !form.prix) {
      setMessage("Remplissez tous les champs obligatoires"); return;
    }
    setSaving(true);
    try {
      await listingsAPI.create({
        ...form,
        prix: parseInt(form.prix),
        nb_pieces: parseInt(form.nb_pieces),
        devise: DEVISES[form.pays] || "GNF",
      } as any);
      setMessage("Annonce publiée avec succès !");
      setShowForm(false);
      // Recharger
      const d = await listingsAPI.getAll({ pays: user?.pays });
      setMyListings(d.listings.filter(l => l.landlord.id === user?.id));
    } catch (e: any) { setMessage(e.message); }
    finally { setSaving(false); }
  };

  return (
    <Layout userRole="owner" onRoleSwitch={() => {}}>
      <div className="px-4 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-slate-800" style={{ fontSize: 20 }}>Mes annonces</h1>
          <button onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#F97316" }}>
            {showForm ? "Annuler" : "+ Publier"}
          </button>
        </div>

        {message && (
          <div className="px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: "#D1FAE5", color: "#059669" }}>
            {message}
          </div>
        )}

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-800">Nouvelle annonce</h2>

            {[
              { label: "Titre *",       key: "title_fr",       type: "text",   placeholder: "Ex: Bel appartement F3 — Ratoma" },
              { label: "Prix (mensuel)", key: "prix",          type: "number", placeholder: "2500000" },
              { label: "Nbre de pièces",key: "nb_pieces",      type: "number", placeholder: "3" },
              { label: "Quartier",      key: "quartier",       type: "text",   placeholder: "Ratoma" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                <input type={type} value={(form as any)[key]}
                  onChange={e => set(key, e.target.value)} placeholder={placeholder}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
              <textarea value={form.description_fr} onChange={e => set("description_fr", e.target.value)}
                rows={3} placeholder="Décrivez votre bien..."
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Pays</label>
                <select value={form.pays} onChange={e => set("pays", e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-2 py-2 text-sm outline-none bg-white">
                  {Object.keys(PAYS_VILLES).map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Ville</label>
                <select value={form.ville} onChange={e => set("ville", e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-2 py-2 text-sm outline-none bg-white">
                  {(PAYS_VILLES[form.pays] || []).map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>

            {/* Équipements */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Équipements</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "has_generator", label: "⚡ Générateur" },
                  { key: "has_water",     label: "🚰 Eau courante" },
                  { key: "has_wifi",      label: "📶 WiFi" },
                  { key: "is_secured",    label: "🔒 Sécurisé" },
                  { key: "has_parking",   label: "🚗 Parking" },
                  { key: "has_ac",        label: "❄️ Climatisation" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={(form as any)[key]}
                      onChange={e => set(key, e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={handleSubmit} disabled={saving}
              className="w-full py-3 rounded-xl font-semibold text-white"
              style={{ background: saving ? "#94A3B8" : "#1E3A5F" }}>
              {saving ? "Publication…" : "Publier l'annonce"}
            </button>
          </div>
        )}

        {/* Mes annonces existantes */}
        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />)}
          </div>
        ) : myListings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-3xl mb-2">🏠</p>
            <p className="font-semibold text-slate-700">Aucune annonce publiée</p>
            <p className="text-slate-500 text-sm mt-1">Cliquez sur "+ Publier" pour commencer</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                {listing.images[0] && (
                  <img src={listing.images[0]} alt={listing.title}
                    className="w-full h-36 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <p className="font-bold text-slate-800">{listing.title}</p>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full"
                      style={{
                        background: listing.status === "active" ? "#D1FAE5" : "#FEE2E2",
                        color:      listing.status === "active" ? "#059669" : "#DC2626",
                      }}>
                      {listing.status === "active" ? "Active" : listing.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mt-0.5">{listing.quartier}, {listing.ville}</p>
                  <p className="font-bold mt-1" style={{ color: "#1E3A5F" }}>
                    {formatPrix(listing.prix, listing.devise)}/mois
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
