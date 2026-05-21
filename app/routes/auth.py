from fastapi import APIRouter, HTTPException

from app.schemas.auth_schema import (
    RegisterRequest,
    LoginRequest
)

from app.services.auth_service import (
    register_user,
    login_user
)

router = APIRouter()


@router.post("/register")
def register(data: RegisterRequest):

    try:

        register_user(
            data.nombre,
            data.correo,
            data.password
        )

        return {
            "message": "Usuario registrado"
        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post("/login")
def login(data: LoginRequest):

    usuario = login_user(
        data.correo,
        data.password
    )

    if not usuario:

        raise HTTPException(
            status_code=401,
            detail="Credenciales incorrectas"
        )

    return {
        "message": "Login exitoso",
        "usuario": usuario
    }