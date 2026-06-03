import resend

from app.config import RESEND_API_KEY

resend.api_key = RESEND_API_KEY


def send_confirmation_email(
    email,
    first_name,
    booths,
    amount
):
    resend.Emails.send(
        {
            "from": "Trade Fair <noreply@yourdomain.com>",
            "to": [email],
            "subject": "Booth Reservation Confirmed",
            "html": f"""
            <h2>Hello {first_name}</h2>

            <p>
                Your payment has been confirmed.
            </p>

            <p>
                Booths: {booths}
            </p>

            <p>
                Amount Paid: ₦{amount:,}
            </p>

            <p>
                Thank you for reserving a booth.
            </p>
            """
        }
    )