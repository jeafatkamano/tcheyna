"""
routes/auth.py — Authentification Tcheyna
Endpoints : /api/auth/register | /login | /refresh | /send-otp | /verify-otp | /me
"""
import random
import string
from datetime import datetime, timedelta

from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash

from app import db
from app.models import User, OTPCode

auth_bp = Blueprint("auth", __name__)


# ─── Helpers ──────────────────────────────────────────────────

def generate_otp(length=6):
    return "".join(random.choices(string.digits, k=length))


def send_sms_otp(phone, code):
    """Envoie l'OTP via Africa's Talking (mock en dev)."""
    from flask import current_app
    try:
        import africastalking
        africastalking.initialize(
            current_app.config["AT_USERNAME"],
            current_app.config["AT_API_KEY"]
        )
        sms = africastalking.SMS
        sms.send(f"[Tcheyna] Votre code de vérification : {code}", [phone],
                 sender_id=current_app.config["AT_SENDER_ID"])
        return True
    except Exception as e:
        current_app.logger.error(f"SMS OTP error: {e}")
        return False


# ─── POST /api/auth/register ──────────────────────────────────

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    required = ["email", "password", "full_name", "role"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"Champ requis : {field}"}), 400

    if data["role"] not in ["tenant", "landlord"]:
        return jsonify({"error": "Rôle invalide. Choisir : tenant | landlord"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email déjà utilisé"}), 409

    if data.get("phone") and User.query.filter_by(phone=data["phone"]).first():
        return jsonify({"error": "Numéro de téléphone déjà utilisé"}), 409

    user = User(
        email         = data["email"].lower().strip(),
        password_hash = generate_password_hash(data["password"]),
        full_name     = data["full_name"].strip(),
        role          = data["role"],
        phone         = data.get("phone"),
        pays          = data.get("pays"),
        ville         = data.get("ville"),
        quartier      = data.get("quartier"),
        preferred_lang= data.get("preferred_lang", "fr"),
    )

    db.session.add(user)
    db.session.commit()

    access_token  = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "message":       "Inscription réussie",
        "user":          user.to_dict(public=False),
        "access_token":  access_token,
        "refresh_token": refresh_token,
    }), 201


# ─── POST /api/auth/login ─────────────────────────────────────

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email et mot de passe requis"}), 400

    user = User.query.filter_by(email=data["email"].lower().strip()).first()

    if not user or not check_password_hash(user.password_hash, data["password"]):
        return jsonify({"error": "Identifiants incorrects"}), 401

    if not user.is_active:
        return jsonify({"error": "Compte désactivé"}), 403

    access_token  = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "message":       "Connexion réussie",
        "user":          user.to_dict(public=False),
        "access_token":  access_token,
        "refresh_token": refresh_token,
    }), 200


# ─── POST /api/auth/refresh ───────────────────────────────────

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id      = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    return jsonify({"access_token": access_token}), 200


# ─── GET /api/auth/me ─────────────────────────────────────────

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user    = User.query.get_or_404(user_id)
    return jsonify(user.to_dict(public=False)), 200


# ─── POST /api/auth/send-otp ─────────────────────────────────

@auth_bp.route("/send-otp", methods=["POST"])
@jwt_required()
def send_otp():
    user_id = get_jwt_identity()
    user    = User.query.get_or_404(user_id)

    if not user.phone:
        return jsonify({"error": "Aucun numéro de téléphone associé au compte"}), 400

    if user.phone_verified:
        return jsonify({"message": "Téléphone déjà vérifié"}), 200

    # Invalider les anciens OTP
    OTPCode.query.filter_by(user_id=user_id, is_used=False).update({"is_used": True})

    code = generate_otp()
    otp  = OTPCode(
        user_id    = user_id,
        code       = code,
        expires_at = datetime.utcnow() + timedelta(minutes=10)
    )
    db.session.add(otp)
    db.session.commit()

    sent = send_sms_otp(user.phone, code)

    # En dev : on retourne le code directement
    response = {"message": "OTP envoyé"}
    from flask import current_app
    if current_app.config.get("DEBUG"):
        response["debug_code"] = code

    return jsonify(response), 200


# ─── POST /api/auth/verify-otp ───────────────────────────────

@auth_bp.route("/verify-otp", methods=["POST"])
@jwt_required()
def verify_otp():
    user_id = get_jwt_identity()
    data    = request.get_json()

    if not data.get("code"):
        return jsonify({"error": "Code OTP requis"}), 400

    otp = OTPCode.query.filter_by(
        user_id=user_id,
        code=data["code"],
        is_used=False
    ).order_by(OTPCode.created_at.desc()).first()

    if not otp:
        return jsonify({"error": "Code invalide"}), 400

    if otp.expires_at < datetime.utcnow():
        return jsonify({"error": "Code expiré. Demandez un nouveau code."}), 400

    otp.is_used = True

    user = User.query.get(user_id)
    user.phone_verified = True
    user.update_trust_level()

    db.session.commit()

    return jsonify({
        "message":     "Téléphone vérifié avec succès",
        "trust_level": user.trust_level,
        "badge":       user._badge_label(),
    }), 200
