import hashlib
import hmac


def verify_paystack_signature(
    payload,
    signature,
    secret_key
):
    computed_hash = hmac.new(
        secret_key.encode(),
        payload,
        hashlib.sha512
    ).hexdigest()

    return hmac.compare_digest(
        computed_hash,
        signature
    )