from fastapi import APIRouter
from sqlalchemy import text

from app.db import engine

router = APIRouter(tags=["Preguntas"])


@router.get("/preguntas")
def obtener_preguntas():

    with engine.begin() as conn:

        preguntas = conn.execute(text("""
            SELECT
                id_pregunta,
                pregunta
            FROM preguntas
            ORDER BY id_pregunta
        """))

        respuestas = conn.execute(text("""
            SELECT
                id_respuesta,
                texto,
                valor
            FROM respuestas
            ORDER BY valor
        """))

        preguntas_json = [
            dict(x._mapping)
            for x in preguntas
        ]

        respuestas_json = [
            dict(x._mapping)
            for x in respuestas
        ]

        return {
            "preguntas": preguntas_json,
            "respuestas": respuestas_json
        }