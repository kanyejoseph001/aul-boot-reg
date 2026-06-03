import requests

from app.config import PAYSTACK_SECRET_KEY

BASE_URL = "https://api.paystack.co"


def initialize_transaction(
    email,
    amount,
    reference,
    callback_url
):
    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "email": email,
        "amount": amount * 100,
        "reference": reference,
        "callback_url": callback_url
    }

    response = requests.post(
        f"{BASE_URL}/transaction/initialize",
        headers=headers,
        json=payload
    )

    return response.json()