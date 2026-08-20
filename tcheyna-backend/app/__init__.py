from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=app.config["CORS_ORIGINS"])

    # Blueprints
    from app.routes.auth import auth_bp
    from app.routes.users import users_bp
    from app.routes.listings import listings_bp
    from app.routes.matches import matches_bp
    from app.routes.passport import passport_bp
    from app.routes.reviews import reviews_bp
    from app.routes.admin import admin_bp
    from app.routes.geo import geo_bp
    from app.routes.payments import payments_bp

    app.register_blueprint(auth_bp,      url_prefix="/api/auth")
    app.register_blueprint(users_bp,     url_prefix="/api/users")
    app.register_blueprint(listings_bp,  url_prefix="/api/listings")
    app.register_blueprint(matches_bp,   url_prefix="/api/matches")
    app.register_blueprint(passport_bp,  url_prefix="/api/passport")
    app.register_blueprint(reviews_bp,   url_prefix="/api/reviews")
    app.register_blueprint(admin_bp,     url_prefix="/api/admin")
    app.register_blueprint(geo_bp,       url_prefix="/api/geo")
    app.register_blueprint(payments_bp,  url_prefix="/api/payments")

    return app
