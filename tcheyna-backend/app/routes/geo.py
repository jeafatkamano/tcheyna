"""routes/geo.py — Géographie Afrique de l'Ouest"""
from flask import Blueprint, jsonify

geo_bp = Blueprint("geo", __name__)

LOCATIONS = {
    "Guinée": {
        "Conakry": ["Kaloum", "Dixinn", "Ratoma", "Matam", "Matoto"],
        "Kindia":  ["Centre-ville", "Gbèssia", "Kouria"],
        "Kankan":  ["Centre", "Kabada", "Kourousa"],
    },
    "Sénégal": {
        "Dakar":       ["Plateau", "Médina", "Almadies", "Ouakam", "Parcelles Assainies"],
        "Thiès":       ["Centre", "Mbambara", "Randoulène"],
        "Saint-Louis": ["Île", "Sor", "Bango"],
    },
    "Côte d'Ivoire": {
        "Abidjan":       ["Cocody", "Plateau", "Yopougon", "Marcory", "Treichville"],
        "Yamoussoukro":  ["Centre", "Habitat", "Zone industrielle"],
        "Bouaké":        ["Air France", "Commerce", "Koko"],
    },
    "Ghana": {
        "Accra":  ["East Legon", "Cantonments", "Tema", "Osu", "Airport"],
        "Kumasi": ["Adum", "Asokwa", "Bantama"],
        "Tamale": ["Sakasaka", "Kalpohin", "Nyohini"],
    },
    "Nigeria": {
        "Lagos":        ["Victoria Island", "Ikoyi", "Lekki", "Surulere", "Ikeja"],
        "Abuja":        ["Maitama", "Garki", "Wuse", "Asokoro", "Gwarinpa"],
        "Port Harcourt":["GRA", "Diobu", "Rumuola"],
    },
}

CURRENCIES = {
    "Guinée":        {"code": "GNF", "symbol": "GNF"},
    "Sénégal":       {"code": "XOF", "symbol": "FCFA"},
    "Côte d'Ivoire": {"code": "XOF", "symbol": "FCFA"},
    "Ghana":         {"code": "GHS", "symbol": "GH₵"},
    "Nigeria":       {"code": "NGN", "symbol": "₦"},
}


@geo_bp.route("/pays", methods=["GET"])
def get_pays():
    return jsonify({
        "pays": [{"nom": p, "devise": CURRENCIES.get(p, {})} for p in LOCATIONS]
    }), 200


@geo_bp.route("/villes/<string:pays>", methods=["GET"])
def get_villes(pays):
    villes = LOCATIONS.get(pays)
    if not villes:
        return jsonify({"error": "Pays non trouvé"}), 404
    return jsonify({"pays": pays, "villes": list(villes.keys())}), 200


@geo_bp.route("/quartiers/<string:pays>/<string:ville>", methods=["GET"])
def get_quartiers(pays, ville):
    villes = LOCATIONS.get(pays)
    if not villes:
        return jsonify({"error": "Pays non trouvé"}), 404
    quartiers = villes.get(ville)
    if not quartiers:
        return jsonify({"error": "Ville non trouvée"}), 404
    return jsonify({"pays": pays, "ville": ville, "quartiers": quartiers}), 200
