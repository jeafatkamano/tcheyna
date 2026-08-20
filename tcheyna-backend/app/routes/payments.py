"""routes/payments.py — CinetPay Mobile Money"""
import uuid
import requests
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Payment, User

payments_bp = Blueprint("payments", __name__)

CINETPAY_INIT_URL = "https://api-checkout.cinetpay.com/v2/payment"


@payments_bp.route("/initier", methods=["POST"])
@jwt_required()
def initier_paiement():
    user_id = get_jwt_identity()
    user    = User.query.get_or_404(user_id)
    data    = request.get_json()

    required = ["montant", "devise"]
    for f in required:
        if not data.get(f):
            return jsonify({"error": f"Champ requis : {f}"}), 400

    transaction_id = str(uuid.uuid4()).replace("-", "")[:20].upper()

    payment = Payment(
        user_id  = user_id,
        match_id = data.get("match_id"),
        montant  = data["montant"],
        devise   = data["devise"],
        methode  = data.get("methode"),
        cinetpay_transaction_id = transaction_id,
        statut   = "pending",
    )
    db.session.add(payment)
    db.session.commit()

    # Appel CinetPay
    payload = {
        "apikey":         current_app.config["CINETPAY_API_KEY"],
        "site_id":        current_app.config["CINETPAY_SITE_ID"],
        "transaction_id": transaction_id,
        "amount":         data["montant"],
        "currency":       data["devise"],
        "description":    f"Tcheyna - Paiement {user.full_name}",
        "notify_url":     current_app.config["CINETPAY_NOTIFY_URL"],
        "return_url":     current_app.config["CINETPAY_RETURN_URL"],
        "customer_name":  user.full_name,
        "customer_email": user.email,
        "customer_phone_number": user.phone or "",
        "channels":       "ALL",
        "lang":           user.preferred_lang.upper(),
    }

    try:
        resp = requests.post(CINETPAY_INIT_URL, json=payload, timeout=10)
        resp_data = resp.json()

        if resp_data.get("code") == "201":
            token = resp_data["data"]["payment_token"]
            pay_url = resp_data["data"]["payment_url"]
            payment.cinetpay_token = token
            db.session.commit()
            return jsonify({
                "payment_url":      pay_url,
                "transaction_id":   transaction_id,
                "payment_token":    token,
            }), 200
        else:
            return jsonify({"error": "CinetPay error", "details": resp_data}), 400

    except Exception as e:
        current_app.logger.error(f"CinetPay error: {e}")
        return jsonify({"error": "Erreur de connexion CinetPay"}), 500


@payments_bp.route("/callback", methods=["POST"])
def cinetpay_callback():
    """Webhook CinetPay — appelé après le paiement."""
    data = request.get_json() or request.form

    transaction_id = data.get("cpm_trans_id")
    statut_code    = data.get("cpm_result")   # "00" = succès

    payment = Payment.query.filter_by(
        cinetpay_transaction_id=transaction_id
    ).first()

    if payment:
        payment.statut = "success" if statut_code == "00" else "failed"
        db.session.commit()

    return jsonify({"message": "OK"}), 200


@payments_bp.route("/mes-paiements", methods=["GET"])
@jwt_required()
def mes_paiements():
    user_id  = get_jwt_identity()
    payments = Payment.query.filter_by(user_id=user_id).order_by(Payment.created_at.desc()).all()
    return jsonify([p.to_dict() for p in payments]), 200
