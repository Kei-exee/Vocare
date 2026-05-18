from pydantic import BaseModel


class RegisterRequest(BaseModel):
    nombre: str
    correo: str
    password: str


class LoginRequest(BaseModel):
    correo: str
    password: str