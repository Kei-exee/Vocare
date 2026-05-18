import joblib
import pandas as pd


# CARGAR MODELO ENTRENADO
modelo = joblib.load("model/modelo.pkl")
print("=" * 60)
print("MODELO CARGADO CORRECTAMENTE")
print("=" * 60)

# MOSTRAR INFORMACIÓN DEL MODELO
print("\nCantidad de árboles del Random Forest:")
print(len(modelo.estimators_))

print("\nMaestrías que conoce el modelo:")
print(modelo.classes_)


# DATOS DE PRUEBA
nuevo_usuario = pd.DataFrame([{
    "ia": 25,
    "gestion": 80,
    "investigacion": 55,
    "programacion": 20,
    "matematicas": 95,
    "redes": 15,
    "seguridad": 20,
    "comunicacion": 75,
    "liderazgo": 80,
    "analisis_datos": 90
}])

print("\nPerfil enviado al modelo:")
print(nuevo_usuario)


# PREDICCIÓN
prediccion = modelo.predict(nuevo_usuario)

print("\n" + "=" * 60)
print("MAESTRÍA RECOMENDADA")
print("=" * 60)

print(prediccion[0])


# PROBABILIDADES
print("\n" + "=" * 60)
print("PROBABILIDADES")
print("=" * 60)

probabilidades = modelo.predict_proba(nuevo_usuario)

clases = modelo.classes_

resultados = []

for clase, prob in zip(clases, probabilidades[0]):

    porcentaje = round(prob * 100, 2)

    resultados.append((clase, porcentaje))

# Ordenar de mayor a menor
resultados.sort(key=lambda x: x[1], reverse=True)

for clase, porcentaje in resultados:

    print(f"{clase}: {porcentaje}%")


# TOP 3 RECOMENDACIONES
print("\n" + "=" * 60)
print("TOP 3 RECOMENDACIONES")
print("=" * 60)

for i in range(3):

    print(f"{i+1}. {resultados[i][0]} -> {resultados[i][1]}%")