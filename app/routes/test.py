from fastapi import APIRouter
from sqlalchemy import text

from app.db import engine
from app.schemas.test_schema import ResolverTestRequest

router = APIRouter(tags=["Test"])


@router.post("/resolver-test")
def resolver_test(data: ResolverTestRequest):

    with engine.begin() as conn:

        resultado = conn.execute(text("""
            INSERT INTO resultado_test (id_usuario)
            VALUES (:id_usuario)
            RETURNING id_resultado
        """), {
            "id_usuario": data.id_usuario
        })

        id_resultado = resultado.fetchone()[0]

        for item in data.respuestas:

            conn.execute(text("""
                INSERT INTO respuesta_usuario
                (
                    id_resultado,
                    id_pregunta,
                    id_respuesta
                )
                VALUES
                (
                    :id_resultado,
                    :id_pregunta,
                    :id_respuesta
                )
            """), {
                "id_resultado": id_resultado,
                "id_pregunta": item.pregunta_id,
                "id_respuesta": item.respuesta_id
            })

        categorias = conn.execute(text("""
            SELECT
                c.id_categoria,
                c.nombre,
                SUM(r.valor * pc.peso) AS puntaje

            FROM respuesta_usuario ru

            JOIN respuestas r
                ON r.id_respuesta = ru.id_respuesta

            JOIN pesos_categoria pc
                ON pc.pregunta_id = ru.id_pregunta

            JOIN categorias c
                ON c.id_categoria = pc.categoria_id

            WHERE ru.id_resultado = :id_resultado

            GROUP BY
                c.id_categoria,
                c.nombre

            ORDER BY puntaje DESC
        """), {
            "id_resultado": id_resultado
        }).fetchall()

        categorias_json = [
            dict(x._mapping)
            for x in categorias
        ]

        return {
            "id_resultado": id_resultado,
            "categorias": categorias_json
        }