import { useState } from "react";
import { trainModel, predict, TrainingData, Labels, TestInstance } from "./algorithm";

function App() {
  const [trainingData, setTrainingData] = useState<TrainingData>([]);
  const [labels, setLabels] = useState<Labels>([]);
  const [testData, setTestData] = useState<TestInstance[]>([]);
  const [model, setModel] = useState<any>(null);
  const [predictions, setPredictions] = useState<Labels>([]);
  const handleTrain = () => {
    if (!trainingData.length || !labels.length) {
      alert("Por favor ingresa datos de entrenamiento y etiquetas.");
      return;
    }
    try {
      const trainedModel = trainModel(trainingData, labels);
      setModel(trainedModel);
      alert("Modelo entrenado correctamente.");
    } catch (error) {
      alert("Hubo un error durante el entrenamiento.");
    }
  };

  const handlePredict = () => {
    if (!model) {
      alert("Primero entrena el modelo.");
      return;
    }
    try {
      const result = predict(testData, model);
      setPredictions(result);
    } catch (error) {
      alert("Hubo un error durante la predicción.");
    }
  };

  return (
    <div>
      <h1>Clasificación Estadística</h1>

      {/* Formulario para Entrenamiento */}
      <h2>Entrenamiento</h2>
      <textarea
        placeholder="Datos de entrenamiento (ej. [[1,0],[0,1]])"
        onChange={(e) => setTrainingData(JSON.parse(e.target.value))}
      ></textarea>
      <textarea
        placeholder="Etiquetas (ej. ['Clase1', 'Clase2'])"
        onChange={(e) => setLabels(JSON.parse(e.target.value))}
      ></textarea>
      <button onClick={handleTrain}>Entrenar Modelo</button>

      {/* Formulario para Predicción */}
      <h2>Predicción</h2>
      <textarea
        placeholder="Datos de prueba (ej. [[1,0],[0,1]])"
        onChange={(e) => setTestData(JSON.parse(e.target.value))}
      ></textarea>
      <button onClick={handlePredict}>Predecir</button>

      {/* Resultados */}
      <h2>Resultados</h2>
      <pre>{JSON.stringify(predictions, null, 2)}</pre>
    </div>
  );
}

export default App;