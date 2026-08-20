"""routes/admin.py — Dashboard Admin Tcheyna"""
from functools import wraps
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, Listing, Match, TenantPassport

admin_bp = Blueprint("admin", __name__)


def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user    = User.query.get(user_id)
        if not user or user.role != "admin":
            return jsonify({"error": "Accès admin requis"}), 403
        return fn(*args, **kwargs)
    return wrapper


@admin_bp.route("/stats", methods=["GET"])
@admin_required
def stats():
    return jsonify({
        "users":    User.query.count(),
        "listings": Listing.query.count(),
        "matches":  Match.query.count(),
        "pending_cni": User.query.filter_by(cni_uploaded=True, cni_verified=False).count(),
    }), 200


@admin_bp.route("/cni-pending", methods=["GET"])
@admin_required
def cni_pending():
    """Liste des CNI à valider manuellement."""
    users = User.query.filter_by(cni_uploaded=True, cni_verified=False).all()
    result = []
    for u in users:
        p = TenantPassport.query.filter_by(tenant_id=u.id).first()
        result.append({
            "user":     u.to_dict(public=False),
            "passport": p.to_dict() if p else None,
        })
    return jsonify(result), 200


@admin_bp.route("/verify-cni/<string:user_id>", methods=["PUT"])
@admin_required
def verify_cni(user_id):
    user = User.query.get_or_404(user_id)
    user.cni_verified = True
    user.update_trust_level()
    db.session.commit()
    return jsonify({
        "message":     "CNI validée",
        "trust_level": user.trust_level,
        "badge":       user._badge_label(),
    }), 200


@admin_bp.route("/users", methods=["GET"])
@admin_required
def list_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([u.to_dict(public=False) for u in users]), 200
