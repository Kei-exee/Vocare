from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.schemas.auth_schema import (
    RegisterRequest,
    LoginRequest
)

from app.services.auth_service import (
    register_user,
    login_user
)

router = APIRouter(tags=["Auth"])


@router.post("/register")
def register(data: RegisterRequest):

    try:

        register_user(
            data.nombre,
            data.correo,
            data.password
        )

        return JSONResponse(
            status_code=201,
            content={
                "message": "Usuario registrado correctamente"
            }
        )

    except Exception as e:

        return JSONResponse(
            status_code=400,
            content={
                "error": str(e)
            }
        )


@router.post("/login")
def login(data: LoginRequest):

    user = login_user(
        data.correo,
        data.password
    )

    if not user:

        return JSONResponse(
            status_code=401,
            content={
                "error": "Credenciales incorrectas"
            }
        )

    return {
        "message": "Login exitoso",
        "usuario": user
    }