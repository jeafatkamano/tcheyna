# 🔍 AUDIT TECHNIQUE COMPLET - TCHEYNA

**Date:** 2026-06-18  
**Scope:** Frontend React/TypeScript (Vite + React Router v7)  
**Status:** ⚠️ CRITIQUE - Bugs bloquants détectés

---

## 🚨 BUGS CRITIQUES (À CORRIGER EN PRIORITÉ)

### 1. **API URL FALLBACK INCORRECTE** ❌
**Fichier:** `src/api/api.ts:8`
```typescript
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5173/";
```
**Problème:** La fallback pointe vers le serveur Vite (5173), pas l'API Flask (5000)
**Impact:** Toutes les requêtes API échouent si `VITE_API_URL` n'est pas défini
**Fix:**
```typescript
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
```

---

### 2. **EMAIL INPUT FOND VERT** 🟢
**Fichier:** `src/app/pages/LoginPage.tsx:82`
```typescript
style={{
  background: "green",  // ← BUG: arrière-plan vert
  border: "1.5px solid #E2E8F0",
}}
```
**Problème:** Erreur de debug laissée en production
**Impact:** UX très mauvaise
**Fix:**
```typescript
style={{
  background: "white",  // ← correct
  border: "1.5px solid #E2E8F0",
}}
```

---

### 3. **APP.TSX SANS AUTHPROVIDER** 🔐
**Fichier:** `src/app/App.tsx`
```typescript
export default function App() {
  return <RouterProvider router={router} />;
}
```
**Problème:** 
- Pas de `<AuthProvider>` wrapper
- Les pages qui appellent `useAuth()` vont crasher avec "useAuth doit être utilisé dans AuthProvider"
- Pas de gestion globale de l'authentification

**Impact:** CRITIQUE - L'app s'effondre dès qu'on accède à une page utilisant `useAuth()`
**Fix:**
```typescript
import { AuthProvider } from "../context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
```

---

### 4. **LOGINPAGE NE FAIT RIEN** 🚫
**Fichier:** `src/app/pages/LoginPage.tsx:12-15`
```typescript
function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  if (role === "tenant") navigate("/tenant/dashboard");
  else navigate("/owner/dashboard");
}
```
**Problème:** 
- Les champs email/password ne sont pas validés
- Pas d'appel API (authAPI.login)
- Pas de sauvegarde des tokens
- Simulation de navigation sans authentification

**Impact:** Impossible de se connecter réellement
**Fix:** Appeler `authAPI.login()` et utiliser `useAuth().login()`

---

### 5. **TYPES INCONSISTENTS - API vs MOCK DATA** 🔀
**Problème:** Deux définitions différentes pour les mêmes entités

#### **User.role:**
- **api.ts:** `"tenant" | "landlord" | "admin"`
- **LoginPage.tsx:** `"tenant" | "owner"` ← pas "owner" en API!

#### **Listing:**
```typescript
// api.ts (Backend)
interface Listing {
  type_bien: string;
  prix: number;
  nb_pieces: number;
  landlord: User;
}

// mockData.ts (Frontend)
interface Listing {
  propertyType: string;
  monthlyRent: number;
  nbRooms: number;
  owner: { id, name, avatar, ... };
}
```

**Impact:** 
- Impossible de mapper les réponses API au frontend
- `TenantDashboard.tsx` utilise mock data incompatible avec l'API

**Fix:** Créer un type unique et des mappers

---

### 6. **ROUTES SANS LAYOUT** 📍
**Fichier:** `src/app/routes.tsx:76-78`
```typescript
{ path: "/listing/:id", Component: ListingDetail },
{ path: "/messages/:matchId", Component: MessagingPage },
{ path: "/tenant-profile/:id", Component: TenantProfileView },
```
**Problème:** Ces routes ne sont pas enveloppées dans TenantShell/OwnerShell
- Pas de bottom nav
- Pas de navigation cohérente
- Pas de Layout.tsx wrapper

**Impact:** Incohérence UX, pas de contexte de navigation

---

### 7. **PAGES MANQUANTES OU ORPHELINES** 🚫
**Fichier:** `src/app/routes.tsx`

Routes définies **MAIS** pages pas importées ou fichiers manquants:
- ✅ `TenantDashboard` → existe
- ✅ `ListingsPage` → existe  
- ❌ `ListingDetail` → **EXISTE PAS** (référencé ligne 76)
- ❌ `MessagingPage.MessagesList` → la structure est douteuse
- ❌ Plusieurs pages en `/app/pages/` ne sont pas utilisées

**Impact:** Routes 404 ou crash si on clique dessus

---

### 8. **STYLES MANQUANT** 🎨
**Fichier:** `src/main.tsx:4`
```typescript
import "./styles/index.css";  // ← fichier n'existe pas?
```
**Impact:** Possibles erreurs de chargement des styles

---

## ⚠️ INCOHÉRENCES ET RISQUES

### 9. **Layout utilise des données en dur** 👤
**Fichier:** `src/app/components/Layout.tsx:101-108`
```typescript
<div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
  {userRole === "tenant" ? "SD" : "JP"}  // ← données en dur!
</div>
<p className="text-white font-semibold">
  {userRole === "tenant" ? "Sophie D." : "Jean-Pierre M."}  // ← pas dynamic
</p>
```
**Fix:** Récupérer les données de `useAuth().user`

---

### 10. **MESSINGPAGE AMBIGUITÉ** 📨
**Fichier:** `src/app/routes.tsx:16`
```typescript
import { MessagingPage, MessagesList } from "./pages/MessagingPage";
```
- La route utilise `MessagingPage` pour `/messages/:matchId`
- Mais la route `/tenant/messages` utilise `MessagesList`
- **Sont-ce les mêmes composants?**

---

## 📋 ORDRE DE CORRECTION RECOMMANDÉ

### **PHASE 1: BLOCKERS** (1-2 heures)
1. ✅ Fixer `api.ts` BASE_URL fallback → `http://localhost:5000/api`
2. ✅ Fixer `LoginPage.tsx` fond vert email input
3. ✅ Ajouter `<AuthProvider>` wrapper dans `App.tsx`
4. ✅ Implémenter `handleLogin` real API call dans LoginPage
5. ✅ Vérifier que tous les fichiers CSS existent

### **PHASE 2: CONSISTENCY** (2-3 heures)
6. ✅ Aligner types API vs Mock Data
   - Créer interface unifiée `User` (role: "tenant" | "landlord")
   - Créer `ListingMapper` pour convertir API → Frontend
7. ✅ Fixer types `role` partout ("landlord" vs "owner")
8. ✅ Implémenter `ListingDetail` qui manque
9. ✅ Clarifier `MessagingPage` vs `MessagesList`

### **PHASE 3: ARCHITECTURE** (3-4 heures)
10. ✅ Ajouter protected routes avec checks auth
11. ✅ Implémenter Layout wrapper correct pour les detail routes
12. ✅ Ajouter Error Boundary global
13. ✅ Remplacer mock data dans pages par appels API
14. ✅ Fixer Layout.tsx pour utiliser `useAuth().user` au lieu de données en dur

### **PHASE 4: POLISH** (1-2 heures)
15. ✅ Ajouter 404 route
16. ✅ Tests d'imports/exports cross-file
17. ✅ Vérifier les exports manquants

---

## 🔗 FICHIERS À CRÉER OU COMPLÉTER

| Fichier | Status | Action |
|---------|--------|--------|
| `src/app/pages/ListingDetail.tsx` | ❌ MANQUANT | Créer |
| `src/styles/index.css` | ⚠️ INCERTAIN | Vérifier/Créer |
| `src/app/pages/ErrorBoundary.tsx` | ❌ MANQUANT | Créer |
| `src/context/ProtectedRoute.tsx` | ❌ MANQUANT | Créer |
| `src/utils/mappers.ts` | ❌ MANQUANT | Créer (API→Frontend) |

---

## 🔐 CHECKLIST DE VÉRIFICATION

- [ ] API URL fallback correct
- [ ] Email input background blanc
- [ ] AuthProvider wrapper dans App.tsx
- [ ] LoginPage fait l'API call
- [ ] Types User.role cohérents
- [ ] Tous les fichiers de routes existent
- [ ] Pas de console.errors au démarrage
- [ ] Layout.tsx utilise useAuth()
- [ ] MessagingPage/MessagesList clarifiés
- [ ] CSS files existent et chargent

---

## 📝 NOTES IMPORTANTES

1. **Backend API URL:** `.env` est correct (`http://localhost:5000/api`)
2. **Dependencies:** react-router v7.13.0 est moderne, bien configuré
3. **Architecture:** Structure logique (pages/, components/, api/, context/)
4. **Type Safety:** TypeScript utilisé, mais types pas alignés

**Verdict:** App est **50% prête** - architecture bonne, mais bugs critiques + type misalignments empêchent le fonctionnement.

