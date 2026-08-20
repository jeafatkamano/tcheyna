"""routes/reviews.py — Avis & Notation"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from app import db
from app.models import Review, User, Match

reviews_bp = Blueprint("reviews", __name__)


@reviews_bp.route("/user/<string:user_id>", methods=["GET"])
def get_user_reviews(user_id):
    reviews = Review.query.filter_by(target_id=user_id).all()
    avg = db.session.query(func.avg(Review.note)).filter_by(target_id=user_id).scalar()
    return jsonify({
        "reviews":  [r.to_dict() for r in reviews],
        "moyenne":  round(float(avg), 2) if avg else 0,
        "total":    len(reviews),
    }), 200


@reviews_bp.route("/", methods=["POST"])
@jwt_required()
def create_review():
    user_id = get_jwt_identity()
    data    = request.get_json()

    required = ["target_id", "note", "type_avis"]
    for f in required:
        if not data.get(f):
            return jsonify({"error": f"Champ requis : {f}"}), 400

    if not (1 <= int(data["note"]) <= 5):
        return jsonify({"error": "La note doit être entre 1 et 5"}), 400

    if data["type_avis"] not in ["tenant_to_landlord", "landlord_to_tenant"]:
        return jsonify({"error": "type_avis invalide"}), 400

    review = Review(
        reviewer_id = user_id,
        target_id   = data["target_id"],
        match_id    = data.get("match_id"),
        note        = int(data["note"]),
        commentaire = data.get("commentaire"),
        type_avis   = data["type_avis"],
        is_positive = int(data["note"]) >= 4,
    )
    db.session.add(review)

    # Recalculer le trust_level de la cible
    target = User.query.get(data["target_id"])
    if target:
        target.update_trust_level()

    db.session.commit()
    return jsonify({"message": "Avis publié", "review": review.to_dict()}), 201
