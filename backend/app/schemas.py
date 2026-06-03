from pydantic import BaseModel, EmailStr, Field

class RegistrationRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    booths: int = Field(..., ge=1, le=10)