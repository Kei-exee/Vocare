from sqlalchemy import text

from app.db import engine
from app.models.security import (
    hash_password,
    verify_password
)

def register_user(nombre, correo, password):

    password_hash = hash_password(password)

    with engine.begin() as conn:

        conn.execute(text("""
            INSERT INTO usuarios
            (
                nombre,
                correo,
                password_hash
            )
            VALUES
            (
                :nombre,
                :correo,
                :password_hash
            )
        """), {
            "nombre": nombre,
            "correo": correo,
            "password_hash": password_hash
        })


def login_user(correo, password):

    with engine.begin() as conn:

        user = conn.execute(text("""
            SELECT *
            FROM usuarios
            WHERE correo = :correo
        """), {
            "correo": correo
        }).fetchone()

        if not user:
            return None

        if not verify_password(password, user.password_hash):
            return None

        return dict(user._mapping)