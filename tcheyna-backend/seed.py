"""
seed.py — Données de test Tcheyna AOF
Usage : python seed.py
Peuple la BDD avec des utilisateurs et annonces de test
"""
from dotenv import load_dotenv
load_dotenv()

from run import app
from app import db
from app.models import User, Listing, TenantPassport
from werkzeug.security import generate_password_hash

IMAGES = [
    "https://images.unsplash.com/photo-1658288644949-4c09a9b30435?w=800&q=80",
    "https://images.unsplash.com/photo-1737305457496-dc7503cdde1e?w=800&q=80",
    "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80",
]

def seed():
    with app.app_context():
        print("🌱 Suppression des données existantes…")
        TenantPassport.query.delete()
        Listing.query.delete()
        User.query.filter(User.role != "admin").delete()
        db.session.commit()

        print("👤 Création des utilisateurs…")

        # Locataire 1 — Guinée
        tenant1 = User(
            email="aminata@tcheyna.test",
            password_hash=generate_password_hash("test1234"),
            full_name="Aminata Diallo",
            role="tenant",
            phone="+224622000001",
            pays="Guinée", ville="Conakry", quartier="Ratoma",
            trust_level=3,
            phone_verified=True,
            cni_verified=True,
            preferred_lang="fr",
        )

        # Locataire 2 — Sénégal
        tenant2 = User(
            email="moussa@tcheyna.test",
            password_hash=generate_password_hash("test1234"),
            full_name="Moussa Ndiaye",
            role="tenant",
            phone="+221771000002",
            pays="Sénégal", ville="Dakar", quartier="Almadies",
            trust_level=2,
            phone_verified=True,
            cni_verified=False,
            preferred_lang="fr",
        )

        # Propriétaire 1 — Guinée
        landlord1 = User(
            email="mamadou@tcheyna.test",
            password_hash=generate_password_hash("test1234"),
            full_name="Mamadou Bah",
            role="landlord",
            phone="+224628000003",
            pays="Guinée", ville="Conakry", quartier="Kaloum",
            trust_level=4,
            phone_verified=True,
            cni_verified=True,
            preferred_lang="fr",
        )

        # Propriétaire 2 — Côte d'Ivoire
        landlord2 = User(
            email="kouassi@tcheyna.test",
            password_hash=generate_password_hash("test1234"),
            full_name="Kouassi Yao",
            role="landlord",
            phone="+2250700000004",
            pays="Côte d'Ivoire", ville="Abidjan", quartier="Cocody",
            trust_level=3,
            phone_verified=True,
            cni_verified=True,
            preferred_lang="fr",
        )

        db.session.add_all([tenant1, tenant2, landlord1, landlord2])
        db.session.flush()  # Pour avoir les IDs

        print("🏠 Création des annonces…")

        listings = [
            Listing(
                landlord_id    = landlord1.id,
                title_fr       = "Bel appartement F3 — Ratoma",
                title_en       = "Beautiful 3-room apartment — Ratoma",
                description_fr = "Grand appartement de 3 chambres au 2e étage, entièrement rénové. Groupe électrogène, eau courante 24h/24, gardien. Proche commodités.",
                description_en = "Large 3-bedroom apartment on 2nd floor, fully renovated. Generator, running water 24/7, security guard.",
                pays="Guinée", ville="Conakry", quartier="Ratoma",
                type_bien="appartement", prix=2500000, devise="GNF",
                nb_pieces=3, superficie=90,
                has_generator=True, has_water=True, is_secured=True, has_parking=True,
                images_urls=",".join(IMAGES[:2]),
                status="active",
            ),
            Listing(
                landlord_id    = landlord1.id,
                title_fr       = "Studio moderne — Kaloum Centre",
                description_fr = "Studio bien agencé au cœur de Kaloum. Climatisation, WiFi inclus, immeuble sécurisé.",
                pays="Guinée", ville="Conakry", quartier="Kaloum",
                type_bien="studio", prix=1200000, devise="GNF",
                nb_pieces=1, superficie=35,
                has_generator=True, has_water=True, has_wifi=True,
                is_secured=True, has_ac=True,
                images_urls=IMAGES[1],
                status="active",
            ),
            Listing(
                landlord_id    = landlord1.id,
                title_fr       = "Villa F4 avec jardin — Dixinn",
                description_fr = "Belle villa de 4 chambres avec jardin clôturé, 2 parkings, gardien résidentiel. WiFi fibre.",
                pays="Guinée", ville="Conakry", quartier="Dixinn",
                type_bien="maison", prix=5000000, devise="GNF",
                nb_pieces=4, superficie=180,
                has_generator=True, has_water=True, has_wifi=True,
                is_secured=True, has_parking=True, has_ac=True,
                images_urls=",".join(IMAGES),
                status="active",
            ),
            Listing(
                landlord_id    = landlord2.id,
                title_fr       = "Appartement F2 — Cocody Abidjan",
                description_fr = "T2 lumineux à Cocody. Immeuble moderne, ascenseur, gardien. Quartier résidentiel calme.",
                pays="Côte d'Ivoire", ville="Abidjan", quartier="Cocody",
                type_bien="appartement", prix=250000, devise="XOF",
                nb_pieces=2, superficie=60,
                has_generator=False, has_water=True, has_wifi=True,
                is_secured=True, has_ac=True,
                images_urls=IMAGES[2],
                status="active",
            ),
        ]

        db.session.add_all(listings)

        print("📄 Création des passeports locataires…")

        passport1 = TenantPassport(
            tenant_id       = tenant1.id,
            income_verified = True,
            docs_uploaded   = True,
            situation_pro   = "salarié",
            revenu_mensuel  = 8000000,
            devise          = "GNF",
            employeur       = "Telecel Guinée",
            score           = 80,
        )

        passport2 = TenantPassport(
            tenant_id       = tenant2.id,
            income_verified = False,
            docs_uploaded   = False,
            situation_pro   = "indépendant",
            score           = 30,
        )

        db.session.add_all([passport1, passport2])
        db.session.commit()

        print("\n✅ Seed terminé ! Comptes de test :")
        print("─────────────────────────────────────")
        print("LOCATAIRES (mot de passe : test1234)")
        print(f"  → {tenant1.email}  ({tenant1.full_name}) — Niveau {tenant1.trust_level}")
        print(f"  → {tenant2.email}   ({tenant2.full_name}) — Niveau {tenant2.trust_level}")
        print("PROPRIÉTAIRES (mot de passe : test1234)")
        print(f"  → {landlord1.email}  ({landlord1.full_name}) — Niveau {landlord1.trust_level}")
        print(f"  → {landlord2.email}  ({landlord2.full_name}) — Niveau {landlord2.trust_level}")
        print("─────────────────────────────────────")

if __name__ == "__main__":
    seed()
