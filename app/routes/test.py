from fastapi import APIRouter
from sqlalchemy import text

from app.db import engine
from app.schemas.test_schema import TestRequest
from app.services.ia_service import obtener_recomendaciones

router = APIRouter()


@router.post("/guardar-test")
def guardar_test(data: TestRequest):

    with engine.begin() as conn:

        # CREAR RESULTADO TEST
        resultado = conn.execute(text("""

            INSERT INTO resultado_test
            (id_usuario)

            VALUES
            (:id_usuario)

            RETURNING id_resultado

        """), {
            "id_usuario": data.id_usuario
        })

        id_resultado = resultado.fetchone()[0]

        # GUARDAR RESPUESTAS
        respuestas_modelo = []

        for r in data.respuestas:

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
                "id_pregunta": r.id_pregunta,
                "id_respuesta": r.id_respuesta

            })

            respuestas_modelo.append(
                r.id_respuesta
            )

        # IA
        top3 = obtener_recomendaciones(
            respuestas_modelo
        )

        recomendaciones_finales = []

        posicion = 1

        for item in top3:

            # BUSCAR MAESTRIA POR NOMBRE
            maestria = conn.execute(text("""

                SELECT
                    id_maestria,
                    nombre,
                    universidad,
                    modalidad,
                    sede

                FROM maestrias

                WHERE nombre = :nombre

            """), {

                "nombre": item["maestria"]

            }).fetchone()

            # GUARDAR RECOMENDACION
            conn.execute(text("""

                INSERT INTO recomendacion
                (
                    id_resultado,
                    id_maestria,
                    posicion,
                    puntaje
                )

                VALUES
                (
                    :id_resultado,
                    :id_maestria,
                    :posicion,
                    :puntaje
                )

            """), {

                "id_resultado": id_resultado,
                "id_maestria": maestria.id_maestria,
                "posicion": posicion,
                "puntaje": item["probabilidad"]

            })

            recomendaciones_finales.append({

                "posicion": posicion,
                "nombre": maestria.nombre,
                "universidad": maestria.universidad,
                "modalidad": maestria.modalidad,
                "sede": maestria.sede,
                "probabilidad": item["probabilidad"]

            })

            posicion += 1

        return {

            "message": "Test guardado correctamente",
            "id_resultado": id_resultado,
            "top3": recomendaciones_finales

        }