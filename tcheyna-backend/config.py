import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    # ─── App ────────────────────────────────────────────────────
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
    DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    # ─── Base de données ────────────────────────────────────────
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:password@localhost:5432/tcheyna"
    )
    # Render fournit des URLs postgres:// → corriger pour SQLAlchemy
    if SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace(
            "postgres://", "postgresql://", 1
        )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ─── JWT ────────────────────────────────────────────────────
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-change-me")
    JWT_ACCESS_TOKEN_EXPIRES  = timedelta(hours=2)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    # ─── CORS ───────────────────────────────────────────────────
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

    # ─── Upload fichiers (CNI / Passeport) ──────────────────────
    UPLOAD_FOLDER   = os.getenv("UPLOAD_FOLDER", "uploads")
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf"}

    # ─── Africa's Talking (OTP SMS) ─────────────────────────────
    AT_API_KEY      = os.getenv("AT_API_KEY", "")
    AT_USERNAME     = os.getenv("AT_USERNAME", "sandbox")
    AT_SENDER_ID    = os.getenv("AT_SENDER_ID", "TCHEYNA")

    # ─── CinetPay (Mobile Money) ────────────────────────────────
    CINETPAY_API_KEY   = os.getenv("CINETPAY_API_KEY", "")
    CINETPAY_SITE_ID   = os.getenv("CINETPAY_SITE_ID", "")
    CINETPAY_NOTIFY_URL = os.getenv("CINETPAY_NOTIFY_URL", "")
    CINETPAY_RETURN_URL = os.getenv("CINETPAY_RETURN_URL", "")

    # ─── Devises par pays ───────────────────────────────────────
    CURRENCIES = {
        "Guinée":        {"code": "GNF", "symbol": "GNF",  "rate": 1},
        "Sénégal":       {"code": "XOF", "symbol": "FCFA", "rate": 1},
        "Côte d'Ivoire": {"code": "XOF", "symbol": "FCFA", "rate": 1},
        "Ghana":         {"code": "GHS", "symbol": "GH₵",  "rate": 1},
        "Nigeria":       {"code": "NGN", "symbol": "₦",    "rate": 1},
    }


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
