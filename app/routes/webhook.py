from fastapi import APIRouter
from fastapi import Request

from datetime import datetime

from app.config import (
    PAYSTACK_SECRET_KEY
)

from app.security import (
    verify_paystack_signature
)

from app.sheets import (
    get_pending_registration,
    delete_pending_registration,
    save_completed_registration
)

from app.email_service import (
    send_confirmation_email
)

router = APIRouter()


@router.post("/webhook/paystack")
async def paystack_webhook(
    request: Request
):

    body = await request.body()

    signature = request.headers.get(
        "x-paystack-signature"
    )

    if not verify_paystack_signature(
        body,
        signature,
        PAYSTACK_SECRET_KEY
    ):
        return {
            "status": "invalid signature"
        }

    payload = await request.json()

    if payload["event"] != "charge.success":
        return {
            "status": "ignored"
        }

    payment_data = payload["data"]

    reference = payment_data["reference"]

    pending_data, row_index = (
        get_pending_registration(reference)
    )

    if not pending_data:
        return {
            "status":
            "registration not found"
        }

    save_completed_registration(
        [
            reference,
            pending_data["first_name"],
            pending_data["last_name"],
            pending_data["email"],
            pending_data["phone"],
            pending_data["booths"],
            pending_data["amount"],
            "PAID",
            datetime.now().isoformat()
        ]
    )

    send_confirmation_email(
        email=pending_data["email"],
        first_name=pending_data["first_name"],
        booths=pending_data["booths"],
        amount=int(float(pending_data["amount"]))
    )

    delete_pending_registration(
        row_index
    )

    return {
        "status": "success"
    }