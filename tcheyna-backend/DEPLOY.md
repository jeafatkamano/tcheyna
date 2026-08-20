# 🚀 Guide de Déploiement Tcheyna

# Supabase (BDD) + Flask (API) + Render (Hébergement)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ÉTAPE 1 — Préparer le .env local

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Créer le fichier .env dans tcheyna-api/ :

    SECRET_KEY=tcheyna-secret-change-moi-2025
    JWT_SECRET_KEY=tcheyna-jwt-secret-change-moi
    FLASK_DEBUG=false

    # URL Supabase (Settings → Database → Connection string → URI)
    DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

    # CORS : autoriser le frontend (Render Static Site URL)
    CORS_ORIGINS=https://tcheyna.onrender.com

    # Africa's Talking (laisser vide pour l'instant)
    AT_API_KEY=
    AT_USERNAME=sandbox

    # CinetPay (laisser vide pour l'instant)
    CINETPAY_API_KEY=
    CINETPAY_SITE_ID=

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ÉTAPE 2 — Tester en local avant deploy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    cd tcheyna-api

    # Créer l'environnement virtuel
    python -m venv venv
    source venv/bin/activate        # Mac/Linux
    # venv\Scripts\activate         # Windows

    # Installer les dépendances
    pip install -r requirements.txt

    # Initialiser les migrations (première fois seulement)
    flask --app run db init
    flask --app run db migrate -m "init tables"
    flask --app run db upgrade

    # Lancer
    python run.py
    # → API sur http://localhost:5000

    # Tester que ça marche :
    curl http://localhost:5000/api/geo/pays

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ÉTAPE 3 — Pousser sur GitHub

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    cd tcheyna-api

    git init
    git add .
    git commit -m "feat: Tcheyna API v1 - Flask + Supabase"

    # Créer un repo sur github.com → "tcheyna-api"
    git remote add origin https://github.com/TON-USERNAME/tcheyna-api.git
    git push -u origin main

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ÉTAPE 4 — Déployer sur Render

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Aller sur render.com → "New Web Service"
2. Connecter ton repo GitHub "tcheyna-api"
3. Configurer :

    Name         : tcheyna-api
    Region       : Frankfurt (EU)
    Branch       : main
    Runtime      : Python
    Build Command: pip install -r requirements.txt
    Start Command: gunicorn run:app

4. Dans "Environment Variables", ajouter :

    SECRET_KEY       = [valeur forte]
    JWT_SECRET_KEY   = [valeur forte]
    DATABASE_URL     = postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
    CORS_ORIGINS     = <https://tcheyna.onrender.com>
    FLASK_DEBUG      = false

5. Cliquer "Create Web Service" → attendre ~3 min

6. Une fois déployé, lancer les migrations :
   Dans Render → ton service → "Shell" :

    flask --app run db upgrade

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ÉTAPE 5 — Déployer le Frontend sur Render

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Push le frontend sur GitHub aussi :

    cd tcheyna-frontend  (ou ton dossier React)
    git init
    git add .
    git commit -m "feat: Tcheyna frontend React"
    git remote add origin <https://github.com/TON-USERNAME/tcheyna-frontend.git>
    git push -u origin main

2. Render → "New Static Site"
3. Configurer :

    Name          : tcheyna
    Build Command : npm install && npm run build
    Publish Dir   : dist

4. Environment Variables :

    VITE_API_URL = <https://tcheyna-api.onrender.com/api>

5. Deploy → URL finale : <https://tcheyna.onrender.com>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ÉTAPE 6 — Créer le premier admin

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Via Render Shell ou en local :

    python create_admin.py
    # (voir fichier create_admin.py)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## URLS FINALES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    API Backend  : https://tcheyna-api.onrender.com
    Frontend     : https://tcheyna.onrender.com
    Supabase     : https://supabase.com/dashboard/project/[REF]

## ENDPOINTS À TESTER APRÈS DÉPLOIEMENT

    GET  https://tcheyna-api.onrender.com/api/geo/pays
    POST https://tcheyna-api.onrender.com/api/auth/register
    POST https://tcheyna-api.onrender.com/api/auth/login
    GET  https://tcheyna-api.onrender.com/api/listings/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ⚠️  RENDER PLAN GRATUIT — IMPORTANT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Le service gratuit Render se "dort" après 15 min d'inactivité.
Premier appel après veille = 30-50 sec de délai.

Solution gratuite → UptimeRobot :

1. Créer un compte sur uptimerobot.com
2. New Monitor → HTTP(s)
3. URL : <https://tcheyna-api.onrender.com/api/geo/pays>
4. Interval : 5 minutes
→ Garde l'API éveillée 24/7 gratuitement
