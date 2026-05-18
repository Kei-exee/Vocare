import random
import pandas as pd

TOTAL_REGISTROS = 5000
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

    # GENERAR PERFILES MÁS COHERENTES
    if perfil == "ia":

        ia = random.randint(85,100)
        programacion = random.randint(80,100)
        matematicas = random.randint(75,100)
        analisis_datos = random.randint(80,100)

        gestion = random.randint(20,60)
        investigacion = random.randint(50,80)
        redes = random.randint(20,60)
        seguridad = random.randint(30,70)
        comunicacion = random.randint(30,70)
        liderazgo = random.randint(30,70)

        maestria = "Inteligencia Artificial"

    elif perfil == "datos":

        ia = random.randint(60,90)
        programacion = random.randint(70,95)
        matematicas = random.randint(80,100)
        analisis_datos = random.randint(85,100)

        gestion = random.randint(30,70)
        investigacion = random.randint(50,80)
        redes = random.randint(20,50)
        seguridad = random.randint(20,50)
        comunicacion = random.randint(30,70)
        liderazgo = random.randint(30,60)

        maestria = "Data Science"

    elif perfil == "seguridad":

        seguridad = random.randint(85,100)
        redes = random.randint(75,100)

        ia = random.randint(30,70)
        programacion = random.randint(50,85)
        matematicas = random.randint(40,80)
        analisis_datos = random.randint(40,70)
        gestion = random.randint(30,60)
        investigacion = random.randint(30,60)
        comunicacion = random.randint(30,60)
        liderazgo = random.randint(30,60)

        maestria = "Ciberseguridad"

    elif perfil == "software":

        programacion = random.randint(85,100)

        ia = random.randint(50,80)
        matematicas = random.randint(60,90)
        analisis_datos = random.randint(50,80)
        seguridad = random.randint(30,70)
        redes = random.randint(30,70)
        gestion = random.randint(30,60)
        investigacion = random.randint(30,70)
        comunicacion = random.randint(40,70)
        liderazgo = random.randint(40,70)

        maestria = "Desarrollo Software"

    elif perfil == "redes":

        redes = random.randint(85,100)

        seguridad = random.randint(60,90)
        programacion = random.randint(40,80)
        ia = random.randint(20,60)
        matematicas = random.randint(40,80)
        analisis_datos = random.randint(30,70)
        gestion = random.randint(30,60)
        investigacion = random.randint(30,60)
        comunicacion = random.randint(30,70)
        liderazgo = random.randint(30,70)

        maestria = "Redes y Telecomunicaciones"

    elif perfil == "negocios":

        gestion = random.randint(85,100)
        liderazgo = random.randint(85,100)
        comunicacion = random.randint(75,100)

        ia = random.randint(10,50)
        programacion = random.randint(10,50)
        matematicas = random.randint(40,80)
        analisis_datos = random.randint(40,80)
        seguridad = random.randint(10,40)
        redes = random.randint(10,40)
        investigacion = random.randint(30,60)

        maestria = "MBA"

    elif perfil == "marketing":

        comunicacion = random.randint(85,100)
        liderazgo = random.randint(70,90)
        gestion = random.randint(70,90)

        analisis_datos = random.randint(50,80)
        ia = random.randint(20,60)
        programacion = random.randint(20,60)
        matematicas = random.randint(30,70)
        seguridad = random.randint(10,40)
        redes = random.randint(10,40)
        investigacion = random.randint(30,70)

        maestria = "Marketing Digital"

    elif perfil == "finanzas":

        matematicas = random.randint(85,100)
        analisis_datos = random.randint(75,95)
        gestion = random.randint(60,90)

        ia = random.randint(20,60)
        programacion = random.randint(20,60)
        seguridad = random.randint(10,40)
        redes = random.randint(10,40)
        investigacion = random.randint(40,70)
        comunicacion = random.randint(50,80)
        liderazgo = random.randint(50,80)

        maestria = "Finanzas"

    elif perfil == "investigacion":

        investigacion = random.randint(90,100)
        matematicas = random.randint(70,95)

        ia = random.randint(40,80)
        programacion = random.randint(40,80)
        analisis_datos = random.randint(60,90)
        gestion = random.randint(40,70)
        seguridad = random.randint(20,50)
        redes = random.randint(20,50)
        comunicacion = random.randint(50,80)
        liderazgo = random.randint(40,70)

        maestria = "Investigacion Tecnologica"

    else:

        gestion = random.randint(80,100)
        liderazgo = random.randint(75,95)

        ia = random.randint(20,60)
        programacion = random.randint(30,70)
        matematicas = random.randint(40,80)
        analisis_datos = random.randint(50,80)
        seguridad = random.randint(20,50)
        redes = random.randint(20,50)
        investigacion = random.randint(40,70)
        comunicacion = random.randint(60,90)

        maestria = "Gestion de Proyectos"

    registros.append([
        ia,
        gestion,
        investigacion,
        programacion,
        matematicas,
        redes,
        seguridad,
        comunicacion,
        liderazgo,
        analisis_datos,
        maestria
    ])

columnas = [
    "ia",
    "gestion",
    "investigacion",
    "programacion",
    "matematicas",
    "redes",
    "seguridad",
    "comunicacion",
    "liderazgo",
    "analisis_datos",
    "maestria"
]

df = pd.DataFrame(registros, columns=columnas)

df.to_csv("training/dataset.csv", index=False)

print("Dataset generado correctamente")
print(df["maestria"].value_counts())