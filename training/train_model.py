import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# CARGAR DATASET
data = pd.read_csv("training/dataset.csv")

# VARIABLES
X = data.drop("maestria", axis=1)
y = data["maestria"]

# DIVISIÓN
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# MODELO
modelo = RandomForestClassifier(
    n_estimators=300,
    max_depth=15,
    random_state=42
)

# ENTRENAR
modelo.fit(X_train, y_train)

# EVALUAR
predicciones = modelo.predict(X_test)
accuracy = accuracy_score(y_test, predicciones)
print(f"Accuracy: {accuracy * 100:.2f}%")

# GUARDAR MODELO
joblib.dump(modelo, "model/modelo.pkl")
print("Modelo entrenado correctamente")