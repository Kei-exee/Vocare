import random
import pandas as pd

TOTAL_REGISTROS = 5000
TOTAL_PREGUNTAS = 35

registros = []

for _ in range(TOTAL_REGISTROS):

    perfil = random.choice([
        "ia",
        "datos",
        "seguridad",
        "software",
        "redes",
        "negocios",
        "marketing",
        "finanzas",
        "investigacion",
        "gestion"
    ])

    respuestas = []

    for i in range(TOTAL_PREGUNTAS):

        if perfil == "ia":

            if i in [0,1,2,3,4,5,6]:
                valor = random.randint(4,5)
            else:
                valor = random.randint(2,4)

            maestria = "Inteligencia Artificial"

        elif perfil == "datos":

            if i in [7,8,9,10,11,12,13]:
                valor = random.randint(4,5)
            else:
                valor = random.randint(2,4)

            maestria = "Ciencia de Datos"

        elif perfil == "seguridad":

            if i in [14,15,16,17,18]:
                valor = random.randint(4,5)
            else:
                valor = random.randint(2,4)

            maestria = "Ciberseguridad"

        elif perfil == "software":

            if i in [19,20,21]:
                valor = random.randint(4,5)
            else:
                valor = random.randint(2,4)

            maestria = "Sistemas de Información"

        elif perfil == "redes":

            if i in [22,23,24]:
                valor = random.randint(4,5)
            else:
                valor = random.randint(2,4)

            maestria = "Transformación Digital"

        elif perfil == "negocios":

            if i in [25,26,27]:
                valor = random.randint(4,5)
            else:
                valor = random.randint(2,4)

            maestria = "MBA Ejecutivo"

        elif perfil == "marketing":

            if i in [28,29]:
                valor = random.randint(4,5)
            else:
                valor = random.randint(2,4)

            maestria = "Marketing Digital"

        elif perfil == "finanzas":

            if i in [30,31]:
                valor = random.randint(4,5)
            else:
                valor = random.randint(2,4)

            maestria = "Finanzas Corporativas"

        elif perfil == "investigacion":

            if i in [32,33]:
                valor = random.randint(4,5)
            else:
                valor = random.randint(2,4)

            maestria = "Investigación Científica"

        else:

            if i in [34]:
                valor = random.randint(4,5)
            else:
                valor = random.randint(2,4)

            maestria = "Gerencia de Proyectos"

        respuestas.append(valor)

    respuestas.append(maestria)

    registros.append(respuestas)

# COLUMNAS
columnas = []

for i in range(1, TOTAL_PREGUNTAS + 1):
    columnas.append(f"pregunta_{i}")

columnas.append("maestria")

# DATAFRAME
df = pd.DataFrame(
    registros,
    columns=columnas
)

# GUARDAR
df.to_csv(
    "dataset.csv",
    index=False
)

print("Dataset generado correctamente")
print(df["maestria"].value_counts())