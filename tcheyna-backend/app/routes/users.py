"""routes/users.py"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from app import db
from app.models import User

users_bp = Blueprint("users", __name__)

@users_bp.route("/<string:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict(public=True)), 200

@users_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user    = User.query.get_or_404(user_id)
    data    = request.get_json()

    for field in ["full_name", "pays", "ville", "quartier", "preferred_lang", "avatar_url"]:
        if field in data:
            setattr(user, field, data[field])

    if data.get("password"):
        user.password_hash = generate_password_hash(data["password"])

    db.session.commit()
    return jsonify({"message": "Profil mis à jour", "user": user.to_dict(public=False)}), 200
