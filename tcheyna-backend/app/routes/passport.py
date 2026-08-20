"""routes/passport.py — Passeport locataire"""
import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app import db
from app.models import TenantPassport, User

passport_bp = Blueprint("passport", __name__)

ALLOWED = {"png", "jpg", "jpeg", "pdf"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED


@passport_bp.route("/", methods=["GET"])
@jwt_required()
def get_passport():
    user_id  = get_jwt_identity()
    passport = TenantPassport.query.filter_by(tenant_id=user_id).first()
    if not passport:
        return jsonify({"message": "Aucun passeport créé"}), 404
    return jsonify(passport.to_dict()), 200


@passport_bp.route("/", methods=["POST"])
@jwt_required()
def create_or_update_passport():
    user_id = get_jwt_identity()
    user    = User.query.get_or_404(user_id)

    if user.role != "tenant":
        return jsonify({"error": "Réservé aux locataires"}), 403

    passport = TenantPassport.query.filter_by(tenant_id=user_id).first()
    if not passport:
        passport = TenantPassport(tenant_id=user_id)
        db.session.add(passport)

    data = request.get_json() or {}
    for field in ["revenu_mensuel", "devise", "employeur", "situation_pro"]:
        if field in data:
            setattr(passport, field, data[field])

    passport.calculate_score()
    db.session.commit()

    return jsonify({"message": "Passeport mis à jour", "passport": passport.to_dict()}), 200


@passport_bp.route("/upload/<string:doc_type>", methods=["POST"])
@jwt_required()
def upload_document(doc_type):
    """doc_type : cni_recto | cni_verso | passport | income"""
    user_id = get_jwt_identity()

    if doc_type not in ["cni_recto", "cni_verso", "passport", "income"]:
        return jsonify({"error": "Type de document invalide"}), 400

    if "file" not in request.files:
        return jsonify({"error": "Aucun fichier fourni"}), 400

    file = request.files["file"]
    if not allowed_file(file.filename):
        return jsonify({"error": "Format non autorisé (jpg, png, pdf)"}), 400

    filename = secure_filename(f"{user_id}_{doc_type}_{file.filename}")
    upload_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
    os.makedirs(current_app.config["UPLOAD_FOLDER"], exist_ok=True)
    file.save(upload_path)

    passport = TenantPassport.query.filter_by(tenant_id=user_id).first()
    if not passport:
        passport = TenantPassport(tenant_id=user_id)
        db.session.add(passport)

    url = f"/uploads/{filename}"
    if doc_type == "cni_recto":  passport.cni_recto_url  = url
    if doc_type == "cni_verso":  passport.cni_verso_url  = url
    if doc_type == "passport":   passport.passport_url   = url
    if doc_type == "income":     passport.income_doc_url = url

    passport.docs_uploaded = bool(passport.cni_recto_url or passport.passport_url)
    passport.calculate_score()

    # Mise à jour du user
    user = User.query.get(user_id)
    user.cni_uploaded = passport.docs_uploaded
    user.update_trust_level()

    db.session.commit()
    return jsonify({"message": "Document uploadé", "url": url}), 200
