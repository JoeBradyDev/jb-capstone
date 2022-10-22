import cookie from "cookie";
import { isTokenValid } from "../../utils/isTokenValid.server";
import type { NextApiRequest, NextApiResponse } from "next";
import * as tf from "@tensorflow/tfjs-node";
import { loadData } from "../../utils/loadData.server";
import { prepareScatter } from "../../utils/prepareScatter.server";

function createModel() {
  // This function creates the model
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));
  model.add(tf.layers.dense({ units: 1, useBias: true }));
  return model;
}

function testModel(model: any, inputData: any, normalizationData: any) {
  // This function tests the model
  const { inputMax, inputMin, labelMin, labelMax } = normalizationData;

  const [xs, preds] = tf.tidy(() => {
    const xs = tf.linspace(0, 1, 100);
    const preds = model.predict(xs.reshape([100, 1]));
    const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin);
    const unNormPreds = preds.mul(labelMax.sub(labelMin)).add(labelMin);
    return [unNormXs.dataSync(), unNormPreds.dataSync()];
  });

  const predictedPoints = Array.from(xs).map((val, i) => {
    return { x: val, y: preds[i] };
  });

  return predictedPoints;
}

function prepareDataForTensorFlow(data: any) {
  // This function converts the data to a tensor for TensorFlow.js
  return tf.tidy(() => {
    tf.util.shuffle(data);
    const inputs = data.map(({ miDriven }: any) => miDriven);
    const labels = data.map(({ usdPrice }: any) => usdPrice);
    const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    //Use min-max scaling to normalize the data
    const inputMax = inputTensor.max();
    const inputMin = inputTensor.min();
    const labelMax = labelTensor.max();
    const labelMin = labelTensor.min();

    const normalizedInputs = inputTensor
      .sub(inputMin)
      .div(inputMax.sub(inputMin));
    const normalizedLabels = labelTensor
      .sub(labelMin)
      .div(labelMax.sub(labelMin));

    return {
      inputs: normalizedInputs,
      labels: normalizedLabels,
      inputMax,
      inputMin,
      labelMax,
      labelMin,
    };
  });
}

async function trainModel(model: any, inputs: any, labels: any) {
  // This function trains the model
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ["mse"],
  });

  const batchSize = 32;
  const epochs = 50;

  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
  });
}

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { accessToken } = cookie.parse(req.headers.cookie ?? "");
  if (isTokenValid(accessToken)) {
    // Load the input data
    const data = await loadData();
    const values = prepareScatter(data);
    const model = await createModel();

    // Convert the data to tensors so we can train the model
    const tensorData = prepareDataForTensorFlow(data);
    const { inputs, labels } = tensorData;

    // Train the model
    await trainModel(model, inputs, labels);
    const predictedPoints = testModel(model, inputs, tensorData);

    res.status(200).json({ originalPoints: values, predictedPoints });
  } else {
    res
      .status(401)
      .json({ message: "You are not authorized to access this resource." });
  }
};

export default handler;
