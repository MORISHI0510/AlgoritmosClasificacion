export type TrainingData = number[][]; // Matriz de datos
export type Labels = string[]; // Etiquetas correspondientes
export type TestInstance = number[]; // Instancias para clasificar
export type Model = {
  classProbabilities: Record<string, number>;
  featureProbabilities: Record<number, Record<string, Record<number, number>>>;
};

export function trainModel(data: TrainingData, labels: Labels): Model {
  const classProbabilities: Record<string, number> = {};
  const featureProbabilities: Record<number, Record<string, Record<number, number>>> = {};

  // Calcular probabilidad de cada clase
  labels.forEach((label) => {
    classProbabilities[label] = (classProbabilities[label] || 0) + 1;
  });
  Object.keys(classProbabilities).forEach((cls) => {
    classProbabilities[cls] /= labels.length;
  });

  // Calcular probabilidad condicional para cada característica
  data.forEach((row, idx) => {
    row.forEach((value, featureIndex) => {
      if (!featureProbabilities[featureIndex]) {
        featureProbabilities[featureIndex] = {};
      }
      if (!featureProbabilities[featureIndex][labels[idx]]) {
        featureProbabilities[featureIndex][labels[idx]] = {};
      }
      featureProbabilities[featureIndex][labels[idx]][value] =
        (featureProbabilities[featureIndex][labels[idx]][value] || 0) + 1;
    });
  });

  // Normalizar las probabilidades condicionales
  Object.keys(featureProbabilities).forEach((featureIndex) => {
    Object.keys(featureProbabilities[+featureIndex]).forEach((label) => {
      const total = Object.values(featureProbabilities[+featureIndex][label]).reduce(
        (sum, count) => sum + count,
        0
      );
      Object.keys(featureProbabilities[+featureIndex][label]).forEach((value) => {
        featureProbabilities[+featureIndex][label][value] /= total;
      });
    });
  });

  return { classProbabilities, featureProbabilities };
}

export function predict(data: TestInstance[], model: Model): Labels {
  return data.map((instance) => {
    let bestClass: string | null = null;
    let bestProbability = -Infinity;

    Object.keys(model.classProbabilities).forEach((cls) => {
      let probability = model.classProbabilities[cls];
      instance.forEach((value, featureIndex) => {
        probability *= model.featureProbabilities[featureIndex]?.[cls]?.[value] || 1e-10;
      });
      if (probability > bestProbability) {
        bestProbability = probability;
        bestClass = cls;
      }
    });

    return bestClass!;
  });
}