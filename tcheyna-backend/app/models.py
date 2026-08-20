"""
models.py — Tous les modèles Tcheyna
Marché : Guinée, Sénégal, Côte d'Ivoire, Ghana, Nigeria
"""
import uuid
from datetime import datetime
from app import db


# ─────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────

def generate_uuid():
    return str(uuid.uuid4())


# ─────────────────────────────────────────────────────────────
# USER — Propriétaire ou Locataire
# ─────────────────────────────────────────────────────────────

class User(db.Model):
    __tablename__ = "users"

    id            = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    email         = db.Column(db.String(120), unique=True, nullable=False, index=True)
    phone         = db.Column(db.String(20),  unique=True, nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)

    # Identité
    full_name     = db.Column(db.String(100), nullable=False)
    role          = db.Column(db.String(20),  nullable=False)  # 'tenant' | 'landlord' | 'admin'
    avatar_url    = db.Column(db.String(300), nullable=True)

    # Localisation
    pays          = db.Column(db.String(50),  nullable=True)
    ville         = db.Column(db.String(50),  nullable=True)
    quartier      = db.Column(db.String(100), nullable=True)

    # Préférences
    preferred_lang = db.Column(db.String(5), default="fr")  # 'fr' | 'en'

    # ─── Système de confiance (Niveaux 1→4) ────────────────────
    trust_level      = db.Column(db.Integer, default=1)
    # Niveau 1 : inscription simple
    # Niveau 2 : téléphone vérifié (OTP)
    # Niveau 3 : CNI/Passeport validé par admin
    # Niveau 4 : 3+ avis positifs reçus

    phone_verified   = db.Column(db.Boolean, default=False)
    cni_uploaded     = db.Column(db.Boolean, default=False)
    cni_verified     = db.Column(db.Boolean, default=False)
    is_active        = db.Column(db.Boolean, default=True)

    # Timestamps
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at    = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    listings      = db.relationship("Listing",       back_populates="landlord",  lazy="dynamic")
    matches       = db.relationship("Match",         back_populates="tenant",    lazy="dynamic")
    passport      = db.relationship("TenantPassport",back_populates="tenant",    uselist=False)
    reviews_given = db.relationship("Review", foreign_keys="Review.reviewer_id", back_populates="reviewer", lazy="dynamic")
    reviews_received = db.relationship("Review", foreign_keys="Review.target_id", back_populates="target",  lazy="dynamic")

    def to_dict(self, public=True):
        data = {
            "id":           self.id,
            "full_name":    self.full_name,
            "role":         self.role,
            "pays":         self.pays,
            "ville":        self.ville,
            "quartier":     self.quartier,
            "trust_level":  self.trust_level,
            "badge":        self._badge_label(),
            "phone_verified": self.phone_verified,
            "cni_verified": self.cni_verified,
            "avatar_url":   self.avatar_url,
            "preferred_lang": self.preferred_lang,
            "created_at":   self.created_at.isoformat(),
        }
        if not public:
            data["email"] = self.email
            data["phone"] = self.phone
        return data

    def _badge_label(self):
        labels = {1: "Nouveau", 2: "Téléphone vérifié",
                  3: "Identité vérifiée", 4: "Membre de confiance"}
        return labels.get(self.trust_level, "Nouveau")

    def update_trust_level(self):
        """Recalcule le trust_level automatiquement."""
        if self.trust_level < 2 and self.phone_verified:
            self.trust_level = 2
        if self.trust_level < 3 and self.cni_verified:
            self.trust_level = 3
        positive = self.reviews_received.filter_by(is_positive=True).count()
        if self.trust_level < 4 and positive >= 3:
            self.trust_level = 4

    def __repr__(self):
        return f"<User {self.full_name} [{self.role}] — Niveau {self.trust_level}>"


# ─────────────────────────────────────────────────────────────
# OTP — Vérification téléphone via Africa's Talking
# ─────────────────────────────────────────────────────────────

class OTPCode(db.Model):
    __tablename__ = "otp_codes"

    id         = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id    = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    code       = db.Column(db.String(6),  nullable=False)
    is_used    = db.Column(db.Boolean, default=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User")


# ─────────────────────────────────────────────────────────────
# LISTING — Annonce immobilière
# ─────────────────────────────────────────────────────────────

class Listing(db.Model):
    __tablename__ = "listings"

    id          = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    landlord_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)

    # Contenu bilingue
    title_fr       = db.Column(db.String(200), nullable=False)
    title_en       = db.Column(db.String(200), nullable=True)
    description_fr = db.Column(db.Text, nullable=False)
    description_en = db.Column(db.Text, nullable=True)

    # Localisation
    pays     = db.Column(db.String(50),  nullable=False)
    ville    = db.Column(db.String(50),  nullable=False)
    quartier = db.Column(db.String(100), nullable=True)
    adresse  = db.Column(db.String(300), nullable=True)

    # Caractéristiques
    type_bien    = db.Column(db.String(30), nullable=False)  # 'appartement' | 'maison' | 'studio' | 'chambre'
    prix         = db.Column(db.Integer,    nullable=False)   # en devise locale
    devise       = db.Column(db.String(10), nullable=False)   # GNF | XOF | GHS | NGN
    nb_pieces    = db.Column(db.Integer, default=1)
    superficie   = db.Column(db.Float,   nullable=True)       # m²

    # Équipements locaux Afrique de l'Ouest
    has_generator = db.Column(db.Boolean, default=False)  # ⚡ Groupe électrogène
    has_water     = db.Column(db.Boolean, default=False)  # 🚰 Eau courante
    has_wifi      = db.Column(db.Boolean, default=False)  # 📶 WiFi
    is_secured    = db.Column(db.Boolean, default=False)  # 🔒 Gardien / clôture
    has_parking   = db.Column(db.Boolean, default=False)  # 🚗 Parking
    has_ac        = db.Column(db.Boolean, default=False)  # ❄️ Climatisation

    # Statut
    status     = db.Column(db.String(20), default="active")  # 'active' | 'matched' | 'closed' | 'pending'
    is_visible = db.Column(db.Boolean, default=True)

    # Images (URLs séparées par virgule — ou utiliser une table séparée)
    images_urls = db.Column(db.Text, nullable=True)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    landlord = db.relationship("User",  back_populates="listings")
    matches  = db.relationship("Match", back_populates="listing",  lazy="dynamic")

    def to_dict(self, lang="fr"):
        return {
            "id":          self.id,
            "title":       self.title_fr if lang == "fr" else (self.title_en or self.title_fr),
            "description": self.description_fr if lang == "fr" else (self.description_en or self.description_fr),
            "pays":        self.pays,
            "ville":       self.ville,
            "quartier":    self.quartier,
            "type_bien":   self.type_bien,
            "prix":        self.prix,
            "devise":      self.devise,
            "nb_pieces":   self.nb_pieces,
            "superficie":  self.superficie,
            "equipements": {
                "generateur": self.has_generator,
                "eau":        self.has_water,
                "wifi":       self.has_wifi,
                "securite":   self.is_secured,
                "parking":    self.has_parking,
                "climatisation": self.has_ac,
            },
            "status":      self.status,
            "images":      self.images_urls.split(",") if self.images_urls else [],
            "landlord":    self.landlord.to_dict() if self.landlord else None,
            "created_at":  self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<Listing {self.title_fr} — {self.ville}>"


# ─────────────────────────────────────────────────────────────
# MATCH — Cœur du système Tcheyna
# ─────────────────────────────────────────────────────────────

class Match(db.Model):
    __tablename__ = "matches"

    id         = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    tenant_id  = db.Column(db.String(36), db.ForeignKey("users.id"),    nullable=False)
    listing_id = db.Column(db.String(36), db.ForeignKey("listings.id"), nullable=False)

    # Statut du match
    status = db.Column(db.String(20), default="pending")
    # 'pending'  → locataire a candidaté
    # 'accepted' → propriétaire a accepté
    # 'rejected' → propriétaire a refusé
    # 'completed'→ location terminée

    message    = db.Column(db.Text, nullable=True)   # Message de candidature
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    tenant  = db.relationship("User",    back_populates="matches")
    listing = db.relationship("Listing", back_populates="matches")

    def to_dict(self):
        return {
            "id":         self.id,
            "tenant":     self.tenant.to_dict()  if self.tenant  else None,
            "listing":    self.listing.to_dict() if self.listing else None,
            "status":     self.status,
            "message":    self.message,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<Match {self.tenant_id} → {self.listing_id} [{self.status}]>"


# ─────────────────────────────────────────────────────────────
# TENANT PASSPORT — Passeport locataire
# ─────────────────────────────────────────────────────────────

class TenantPassport(db.Model):
    __tablename__ = "tenant_passports"

    id        = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    tenant_id = db.Column(db.String(36), db.ForeignKey("users.id"), unique=True, nullable=False)

    # Documents uploadés
    income_doc_url  = db.Column(db.String(300), nullable=True)  # Justificatif de revenus
    cni_recto_url   = db.Column(db.String(300), nullable=True)  # CNI recto
    cni_verso_url   = db.Column(db.String(300), nullable=True)  # CNI verso
    passport_url    = db.Column(db.String(300), nullable=True)  # Passeport (alternatif)

    # Vérifications
    income_verified = db.Column(db.Boolean, default=False)
    docs_uploaded   = db.Column(db.Boolean, default=False)

    # Score passeport (calculé)
    score = db.Column(db.Integer, default=0)  # 0–100

    # Informations financières
    revenu_mensuel  = db.Column(db.Integer, nullable=True)   # En devise locale
    devise          = db.Column(db.String(10), nullable=True)
    employeur       = db.Column(db.String(100), nullable=True)
    situation_pro   = db.Column(db.String(50), nullable=True)  # 'salarié' | 'indépendant' | 'étudiant'

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tenant = db.relationship("User", back_populates="passport")

    def calculate_score(self):
        score = 0
        if self.docs_uploaded:    score += 30
        if self.income_verified:  score += 30
        if self.cni_recto_url:    score += 20
        if self.revenu_mensuel:   score += 20
        self.score = score
        return score

    def to_dict(self):
        return {
            "id":             self.id,
            "tenant_id":      self.tenant_id,
            "docs_uploaded":  self.docs_uploaded,
            "income_verified":self.income_verified,
            "score":          self.score,
            "situation_pro":  self.situation_pro,
            "created_at":     self.created_at.isoformat(),
        }


# ─────────────────────────────────────────────────────────────
# REVIEW — Avis et notation
# ─────────────────────────────────────────────────────────────

class Review(db.Model):
    __tablename__ = "reviews"

    id          = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    reviewer_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    target_id   = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    match_id    = db.Column(db.String(36), db.ForeignKey("matches.id"), nullable=True)

    note        = db.Column(db.Integer, nullable=False)   # 1 à 5
    commentaire = db.Column(db.Text,    nullable=True)
    type_avis   = db.Column(db.String(20), nullable=False)  # 'tenant_to_landlord' | 'landlord_to_tenant'
    is_positive = db.Column(db.Boolean, default=False)      # note >= 4

    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    reviewer = db.relationship("User", foreign_keys=[reviewer_id], back_populates="reviews_given")
    target   = db.relationship("User", foreign_keys=[target_id],   back_populates="reviews_received")

    def to_dict(self):
        return {
            "id":          self.id,
            "reviewer":    self.reviewer.to_dict() if self.reviewer else None,
            "note":        self.note,
            "commentaire": self.commentaire,
            "type_avis":   self.type_avis,
            "created_at":  self.created_at.isoformat(),
        }


# ─────────────────────────────────────────────────────────────
# PAYMENT — Paiements Mobile Money (CinetPay)
# ─────────────────────────────────────────────────────────────

class Payment(db.Model):
    __tablename__ = "payments"

    id              = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id         = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    match_id        = db.Column(db.String(36), db.ForeignKey("matches.id"), nullable=True)

    montant         = db.Column(db.Integer,     nullable=False)
    devise          = db.Column(db.String(10),  nullable=False)   # GNF | XOF | GHS | NGN
    methode         = db.Column(db.String(30),  nullable=True)    # 'orange_money' | 'mtn_momo' | 'wave'

    # CinetPay
    cinetpay_transaction_id = db.Column(db.String(100), nullable=True)
    cinetpay_token          = db.Column(db.String(200), nullable=True)

    statut          = db.Column(db.String(20), default="pending")  # 'pending' | 'success' | 'failed'
    created_at      = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at      = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User")

    def to_dict(self):
        return {
            "id":       self.id,
            "montant":  self.montant,
            "devise":   self.devise,
            "methode":  self.methode,
            "statut":   self.statut,
            "created_at": self.created_at.isoformat(),
        }
