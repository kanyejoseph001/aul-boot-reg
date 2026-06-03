from fastapi import APIRouter
from fastapi import HTTPException
from html import escape

from uuid import uuid4

from app.schemas import RegistrationRequest

from app.sheets import (
    email_exists,
    phone_exists,
    save_pending_registration
)

from app.paystack import (
    initialize_transaction
)

from app.config import (
    BOOTH_PRICE,
    SERVICE_FEE_RATE,
    FRONTEND_URL
)

router = APIRouter()



@router.post("/register")
def register(data: RegistrationRequest):

    first_name = escape(data.first_name.strip())
    last_name = escape(data.last_name.strip())
    phone = escape(data.phone.strip())
    email = data.email.strip().lower()

    if email_exists(email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    if phone_exists(data.phone):
        raise HTTPException(
            status_code=400,
            detail="Phone already registered"
        )

    subtotal = data.booths * BOOTH_PRICE

    fee = round(
        subtotal * SERVICE_FEE_RATE
    )

    total = subtotal + fee

    booking_reference = str(uuid4())


    save_pending_registration(
    [
        booking_reference,
        first_name,
        last_name,
        email,
        phone,
        data.booths,
        total
    ]
)

    payment = initialize_transaction(
        email=data.email,
        amount=total,
        reference=booking_reference,
        callback_url=f"{FRONTEND_URL}/success"
    )

    return {
        "payment_url":
        payment["data"]["authorization_url"]
    }