import os
from app import create_app, db
from app.models import User, Listing, Match, TenantPassport, Review, Payment, OTPCode

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {"db": db, "User": User, "Listing": Listing,
            "Match": Match, "TenantPassport": TenantPassport,
            "Review": Review, "Payment": Payment, "OTPCode": OTPCode}

@app.route("/health")
def health():
    return {"status": "ok", "app": "tcheyna-api", "version": "1.0.0"}, 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5173))
    app.run(host="192.168.142.1", port=port, debug=True)
