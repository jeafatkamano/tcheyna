

   Revise content layout

  This is a code bundle for Revise content layout. The original project is available at https://www.figma.com/design/PZlvIuo2BWiDXaAxyxpQzh/Revise-conten# 🏗️ TCHEYNA - Architecture Technique

Architecture complète Supabase/TypeScript pour la plateforme de matching immobilier en Afrique de l'Ouest.

## 📁 Structure du Projet

```
/workspaces/default/code/
├── src/
│   ├── types/
│   │   └── index.ts                    # Types TypeScript (User, Listing, Review, etc.)
│   ├── utils/
│   │   ├── constants.ts                # Constantes (pays, devises, badges)
│   │   ├── translations.ts             # Système bilingue FR/EN
│   │   ├── helpers.ts                  # Fonctions utilitaires
│   │   └── supabase/
│   │       └── info.ts                 # Config Supabase (auto-généré)
│   ├── services/
│   │   └── api.ts                      # Services API (userService, listingService, etc.)
│   ├── hooks/
│   │   ├── useAuth.ts                  # Hook d'authentification
│   │   ├── useLanguage.ts              # Hook de langue
│   │   ├── useListings.ts              # Hook de gestion des annonces
│   │   └── useLocations.ts             # Hook de géolocalisation
│   ├── components/
│   │   ├── TrustBadge.tsx              # Badge de confiance (🥉🥈🥇💎)
│   │   ├── LocationSelect.tsx          # Sélecteur Pays → Ville → Quartier
│   │   ├── AmenitiesDisplay.tsx        # Affichage des équipements
│   │   ├── LanguageSwitcher.tsx        # Switcher FR/EN
│   │   ├── PriceDisplay.tsx            # Formatage des prix
│   │   ├── ListingCard.tsx             # Carte d'annonce
│   │   └── LoadingSpinner.tsx          # Spinner de chargement
│   └── app/
│       ├── App.tsx                     # Application principale
│       └── components/                 # Composants spécifiques
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx               # Serveur API Hono (toutes les routes)
│           └── kv_store.tsx            # Stockage KV (ne pas modifier)
└── ARCHITECTURE.md                     # Ce fichier
```

## 🎯 Modèles de Données

### User

```typescript
{
  id: string;
  email: string;
  phone: string;
  name: string;
  role: 'tenant' | 'landlord';

  // Localisation
  preferred_lang: 'fr' | 'en';
  pays: Country;
  ville: string;
  quartier?: string;

  // Vérification
  trust_level: 'bronze' | 'silver' | 'gold' | 'diamond';
  phone_verified: boolean;
  cni_uploaded: boolean;
  cni_verified: boolean;
  cni_front_url?: string;
  cni_back_url?: string;

  created_at: string;
  updated_at: string;
}
```

### Listing

```typescript
{
  id: string;
  landlord_id: string;

  // Informations bilingues
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;

  // Localisation
  pays: Country;
  ville: string;
  quartier: string;

  // Caractéristiques
  property_type: 'apartment' | 'house' | 'studio' | 'villa' | 'room';
  bedrooms: number;
  bathrooms: number;
  surface_area?: number;

  // Prix
  price: number;
  currency: 'GNF' | 'XOF' | 'GHS' | 'NGN';

  // Équipements (Afrique de l'Ouest)
  has_generator: boolean;
  has_water: boolean;
  has_electricity: boolean;
  is_secured: boolean;
  has_parking: boolean;
  is_furnished: boolean;
  near_mosque: boolean;
  near_church: boolean;
  near_transport: boolean;

  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

### Review, Match, Payment, OTP, TenantPreferences

Voir `src/types/index.ts` pour les détails complets.

## 🔌 API Routes (Serveur Edge Function)

Toutes les routes sont préfixées par `/make-server-acdfdb7c/`

### Users

- `POST /users` - Créer un utilisateur
- `GET /users/:id` - Récupérer un utilisateur
- `PATCH /users/:id` - Mettre à jour un utilisateur

### OTP

- `POST /otp/send` - Envoyer un code OTP
- `POST /otp/verify` - Vérifier un code OTP

### Listings

- `POST /listings` - Créer une annonce
- `GET /listings/search?pays=...&ville=...` - Rechercher des annonces
- `GET /listings/:id` - Récupérer une annonce
- `GET /users/:id/listings` - Annonces d'un propriétaire
- `PATCH /listings/:id` - Mettre à jour une annonce
- `DELETE /listings/:id` - Supprimer (soft delete) une annonce

### Preferences

- `PUT /users/:id/preferences` - Créer/mettre à jour les préférences
- `GET /users/:id/preferences` - Récupérer les préférences

### Reviews

- `POST /reviews` - Créer un avis
- `GET /users/:id/reviews` - Récupérer les avis d'un utilisateur
- `GET /users/:id/rating` - Calculer la note moyenne

### Locations

- `GET /locations/:country/cities` - Villes d'un pays
- `GET /locations/:country/cities/:city/neighborhoods` - Quartiers d'une ville

## 🌍 Pays Supportés

1. **Guinée** (GNF) - Marché primaire
   - Conakry, Kindia, Kankan
2. **Sénégal** (XOF)
   - Dakar, Thiès, Saint-Louis
3. **Côte d'Ivoire** (XOF)
   - Abidjan, Yamoussoukro, Bouaké
4. **Ghana** (GHS)
   - Accra, Kumasi, Tamale
5. **Nigeria** (NGN)
   - Lagos, Abuja, Port Harcourt

## 🎖️ Système de Badges de Confiance

| Niveau         | Emoji      | Conditions               |
| -------------- | ---------- | ------------------------ |
| **Bronze** 🥉  | Par défaut | Aucune vérification      |
| **Argent** 🥈  | Silver     | Téléphone vérifié        |
| **Or** 🥇      | Gold       | Téléphone + CNI vérifiés |
| **Diamant** 💎 | Diamond    | Or + 3 avis positifs     |

La montée en niveau est **automatique** :

- Vérification OTP → Silver
- Upload CNI validé → Gold
- 3ème avis reçu → Diamond

## 🔧 Utilisation

### 1. Services API (Frontend)

```typescript
import {
  userService,
  listingService,
  otpService,
} from "../services/api";

// Créer un utilisateur
const user = await userService.create({
  email: "user@example.com",
  password: "password",
  phone: "+224621234567",
  name: "Mamadou Diallo",
  role: "tenant",
  preferred_lang: "fr",
  pays: "Guinée",
  ville: "Conakry",
});

// Rechercher des annonces
const listings = await listingService.search({
  pays: "Guinée",
  ville: "Conakry",
  min_price: 500000,
  max_price: 2000000,
  has_generator: true,
});
```

### 2. Hooks React

```typescript
import { useAuth } from '../hooks/useAuth';
import { useListings } from '../hooks/useListings';
import { useLanguage } from '../hooks/useLanguage';

function MyComponent() {
  const { user, updateUser } = useAuth();
  const { listings, loading } = useListings({ pays: 'Guinée' });
  const { lang, t } = useLanguage();

  return <div>{t('welcome_to_tcheyna')}</div>;
}
```

### 3. Composants UI

```typescript
import { TrustBadge } from '../components/TrustBadge';
import { LocationSelect } from '../components/LocationSelect';
import { ListingCard } from '../components/ListingCard';

<TrustBadge level="gold" />
<LocationSelect
  selectedCountry={country}
  onCountryChange={setCountry}
  // ...
/>
<ListingCard listing={listing} onClick={() => navigate()} />
```

## 🚀 Prochaines Étapes

### Phase 1 (Complété ✅)

- [x] Types TypeScript
- [x] Constantes et traductions
- [x] Services API
- [x] Routes backend
- [x] Hooks React
- [x] Composants UI de base

### Phase 2 (À faire)

- [ ] Intégrer dans App.tsx
- [ ] Créer les pages (Onboarding, Dashboard, Search, etc.)
- [ ] Implémenter l'upload d'images (Supabase Storage)
- [ ] Implémenter l'OTP SMS (Africa's Talking)
- [ ] Algorithme de matching
- [ ] Paiement mobile money (CinetPay)

### Phase 3 (Futur)

- [ ] Authentification Supabase Auth
- [ ] Notifications push
- [ ] Chat en temps réel
- [ ] Analytics
- [ ] Mode hors ligne (PWA)

## 📝 Notes Importantes

1. **KV Store** : Le fichier `supabase/functions/server/kv_store.tsx` est protégé, ne pas le modifier.

2. **Stockage** : Les données sont stockées dans le KV store avec des clés préfixées :
   - Users : `user_{id}`
   - Listings : `listing_{id}` + `listing_landlord_{landlordId}_{listingId}`
   - Reviews : `review_{id}` + `review_target_{targetId}_{reviewId}`
   - OTP : `otp_{userId}_{timestamp}`
   - Preferences : `preferences_{userId}`

3. **Images** : Pour implémenter l'upload d'images, utiliser Supabase Storage avec des buckets privés préfixés `make-acdfdb7c`.

4. **Authentification** : Pour l'instant, le système stocke l'utilisateur dans `localStorage`. Migrer vers Supabase Auth pour la production.

5. **OTP** : Le code OTP est actuellement retourné dans la réponse (dev only). En production, intégrer Africa's Talking pour l'envoi SMS.

## 🎨 Design System

- **Couleurs principales**
  - Bleu marine : `#1E3A5F`
  - Orange : `#F97316`
- **Police** : Plus Jakarta Sans (à configurer dans `/src/styles/fonts.css`)

- **Mobile-first** : Toujours commencer par le design mobile

---

**Architecture créée le 2026-04-19**  
Prête pour l'intégration dans l'application React Tcheyna 🚀t-layout.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
"# Tcheyna" 
"# Tcheyna" 
"# Tcheyna"  
