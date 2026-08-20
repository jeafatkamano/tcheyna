"""
create_admin.py — Créer le premier compte admin Tcheyna
Usage : python create_admin.py
"""
import os
import sys
from dotenv import load_dotenv

load_dotenv()

from run import app
from app import db
from app.models import User
from werkzeug.security import generate_password_hash

def create_admin():
    with app.app_context():
        email    = input("Email admin : ").strip()
        password = input("Mot de passe : ").strip()
        name     = input("Nom complet : ").strip()

        if User.query.filter_by(email=email).first():
            print("❌ Email déjà utilisé.")
            sys.exit(1)

        admin = User(
            email         = email,
            password_hash = generate_password_hash(password),
            full_name     = name,
            role          = "admin",
            pays          = "Guinée",
            ville         = "Conakry",
            trust_level   = 4,
            phone_verified= True,
            cni_verified  = True,
        )
        db.session.add(admin)
        db.session.commit()
        print(f"✅ Admin créé : {email}")

if __name__ == "__main__":
    create_admin()
