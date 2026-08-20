"""
routes/listings.py — Annonces immobilières Tcheyna
GET  /api/listings          → liste avec filtres
GET  /api/listings/<id>     → détail
POST /api/listings          → créer (landlord)
PUT  /api/listings/<id>     → modifier
DELETE /api/listings/<id>   → supprimer
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models import Listing, User

listings_bp = Blueprint("listings", __name__)


# ─── GET /api/listings ────────────────────────────────────────

@listings_bp.route("/", methods=["GET"])
def get_listings():
    lang    = request.args.get("lang", "fr")
    pays    = request.args.get("pays")
    ville   = request.args.get("ville")
    quartier= request.args.get("quartier")
    type_bien = request.args.get("type")
    prix_min  = request.args.get("prix_min", type=int)
    prix_max  = request.args.get("prix_max", type=int)
    has_water = request.args.get("has_water", type=lambda v: v == "true")
    has_generator = request.args.get("has_generator", type=lambda v: v == "true")
    is_secured    = request.args.get("is_secured",    type=lambda v: v == "true")
    page    = request.args.get("page", 1, type=int)
    per_page= request.args.get("per_page", 12, type=int)

    query = Listing.query.filter_by(status="active", is_visible=True)

    if pays:      query = query.filter_by(pays=pays)
    if ville:     query = query.filter_by(ville=ville)
    if quartier:  query = query.filter_by(quartier=quartier)
    if type_bien: query = query.filter_by(type_bien=type_bien)
    if prix_min:  query = query.filter(Listing.prix >= prix_min)
    if prix_max:  query = query.filter(Listing.prix <= prix_max)
    if has_water:     query = query.filter_by(has_water=True)
    if has_generator: query = query.filter_by(has_generator=True)
    if is_secured:    query = query.filter_by(is_secured=True)

    paginated = query.order_by(Listing.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        "listings":  [l.to_dict(lang=lang) for l in paginated.items],
        "total":     paginated.total,
        "pages":     paginated.pages,
        "page":      page,
    }), 200


# ─── GET /api/listings/<id> ───────────────────────────────────

@listings_bp.route("/<string:listing_id>", methods=["GET"])
def get_listing(listing_id):
    lang    = request.args.get("lang", "fr")
    listing = Listing.query.get_or_404(listing_id)
    return jsonify(listing.to_dict(lang=lang)), 200


# ─── POST /api/listings ───────────────────────────────────────

@listings_bp.route("/", methods=["POST"])
@jwt_required()
def create_listing():
    user_id = get_jwt_identity()
    user    = User.query.get_or_404(user_id)

    if user.role != "landlord":
        return jsonify({"error": "Seuls les propriétaires peuvent publier une annonce"}), 403

    data = request.get_json()

    required = ["title_fr", "description_fr", "pays", "ville", "type_bien", "prix", "devise"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"Champ requis : {field}"}), 400

    listing = Listing(
        landlord_id    = user_id,
        title_fr       = data["title_fr"],
        title_en       = data.get("title_en"),
        description_fr = data["description_fr"],
        description_en = data.get("description_en"),
        pays           = data["pays"],
        ville          = data["ville"],
        quartier       = data.get("quartier"),
        adresse        = data.get("adresse"),
        type_bien      = data["type_bien"],
        prix           = data["prix"],
        devise         = data["devise"],
        nb_pieces      = data.get("nb_pieces", 1),
        superficie     = data.get("superficie"),
        has_generator  = data.get("has_generator", False),
        has_water      = data.get("has_water", False),
        has_wifi       = data.get("has_wifi", False),
        is_secured     = data.get("is_secured", False),
        has_parking    = data.get("has_parking", False),
        has_ac         = data.get("has_ac", False),
        images_urls    = ",".join(data.get("images", [])) if data.get("images") else None,
    )

    db.session.add(listing)
    db.session.commit()

    return jsonify({
        "message": "Annonce publiée avec succès",
        "listing": listing.to_dict(),
    }), 201


# ─── PUT /api/listings/<id> ───────────────────────────────────

@listings_bp.route("/<string:listing_id>", methods=["PUT"])
@jwt_required()
def update_listing(listing_id):
    user_id = get_jwt_identity()
    listing = Listing.query.get_or_404(listing_id)

    if listing.landlord_id != user_id:
        return jsonify({"error": "Non autorisé"}), 403

    data = request.get_json()
    fields = [
        "title_fr","title_en","description_fr","description_en",
        "pays","ville","quartier","adresse","type_bien","prix","devise",
        "nb_pieces","superficie","has_generator","has_water","has_wifi",
        "is_secured","has_parking","has_ac","status","is_visible"
    ]
    for field in fields:
        if field in data:
            setattr(listing, field, data[field])

    db.session.commit()
    return jsonify({"message": "Annonce mise à jour", "listing": listing.to_dict()}), 200


# ─── DELETE /api/listings/<id> ────────────────────────────────

@listings_bp.route("/<string:listing_id>", methods=["DELETE"])
@jwt_required()
def delete_listing(listing_id):
    user_id = get_jwt_identity()
    listing = Listing.query.get_or_404(listing_id)

    if listing.landlord_id != user_id:
        return jsonify({"error": "Non autorisé"}), 403

    listing.is_visible = False
    listing.status     = "closed"
    db.session.commit()

    return jsonify({"message": "Annonce supprimée"}), 200
