"""routes/matches.py — Système de matching Tcheyna"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Match, Listing, User

matches_bp = Blueprint("matches", __name__)


@matches_bp.route("/", methods=["POST"])
@jwt_required()
def create_match():
    user_id = get_jwt_identity()
    user    = User.query.get_or_404(user_id)

    if user.role != "tenant":
        return jsonify({"error": "Seuls les locataires peuvent candidater"}), 403

    data = request.get_json()
    listing_id = data.get("listing_id")
    if not listing_id:
        return jsonify({"error": "listing_id requis"}), 400

    listing = Listing.query.get_or_404(listing_id)
    if listing.status != "active":
        return jsonify({"error": "Cette annonce n'est plus disponible"}), 400

    existing = Match.query.filter_by(tenant_id=user_id, listing_id=listing_id).first()
    if existing:
        return jsonify({"error": "Vous avez déjà candidaté pour cette annonce"}), 409

    match = Match(
        tenant_id  = user_id,
        listing_id = listing_id,
        message    = data.get("message", ""),
    )
    db.session.add(match)
    db.session.commit()

    return jsonify({"message": "Candidature envoyée", "match": match.to_dict()}), 201


@matches_bp.route("/mes-candidatures", methods=["GET"])
@jwt_required()
def mes_candidatures():
    user_id = get_jwt_identity()
    matches = Match.query.filter_by(tenant_id=user_id).order_by(Match.created_at.desc()).all()
    return jsonify([m.to_dict() for m in matches]), 200


@matches_bp.route("/mes-demandes", methods=["GET"])
@jwt_required()
def mes_demandes():
    """Pour le propriétaire : voir les candidatures reçues."""
    user_id  = get_jwt_identity()
    user     = User.query.get_or_404(user_id)
    if user.role != "landlord":
        return jsonify({"error": "Réservé aux propriétaires"}), 403

    listing_ids = [l.id for l in user.listings.all()]
    matches = Match.query.filter(
        Match.listing_id.in_(listing_ids)
    ).order_by(Match.created_at.desc()).all()

    return jsonify([m.to_dict() for m in matches]), 200


@matches_bp.route("/<string:match_id>/statut", methods=["PUT"])
@jwt_required()
def update_match_status(match_id):
    user_id = get_jwt_identity()
    match   = Match.query.get_or_404(match_id)
    user    = User.query.get_or_404(user_id)

    if user.role != "landlord" or match.listing.landlord_id != user_id:
        return jsonify({"error": "Non autorisé"}), 403

    data   = request.get_json()
    statut = data.get("statut")
    if statut not in ["accepted", "rejected"]:
        return jsonify({"error": "Statut invalide : accepted | rejected"}), 400

    match.status = statut
    if statut == "accepted":
        match.listing.status = "matched"

    db.session.commit()
    return jsonify({"message": f"Match {statut}", "match": match.to_dict()}), 200
