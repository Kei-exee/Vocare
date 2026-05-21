import joblib
import numpy as np

# CARGAR MODELO
modelo = joblib.load("model/modelo.pkl")

def obtener_recomendaciones(respuestas):

    X = np.array([respuestas])

    # PROBABILIDADES
    probabilidades = modelo.predict_proba(X)[0]

    # NOMBRES DE CLASES
    clases = modelo.classes_

    # TOP 3
    indices = np.argsort(probabilidades)[::-1][:3]

    resultados = []

    for i in indices:

        resultados.append({
            "maestria": clases[i],
            "probabilidad": round(
                float(probabilidades[i]) * 100,
                2
            )
        })

    return resultados