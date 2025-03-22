import { NextApiRequest, NextApiResponse } from 'next';
import joblib from 'joblib';
import path from 'path';
import { readFileSync } from 'fs';
import pandas from 'pandas-js';

const modelPath = path.join(process.cwd(), 'data', 'xgboost_flood_model.pkl');

let model: any;

try {
    const modelBuffer = readFileSync(modelPath);
    model = joblib.load(modelBuffer);
} catch (error) {
    console.error('Error loading the model:', error);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { rainfall, temperature, humidity } = req.body;

            const inputData = new pandas.DataFrame([
                [parseFloat(rainfall), parseFloat(temperature), parseFloat(humidity)]
            ], ['rainfall', 'temperature', 'humidity']);

            const prediction = model.predict(inputData)[0];

            res.status(200).json({ prediction: Boolean(prediction) });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(400).json({ error: 'Prediction failed', details: errorMessage });
        }
    } else {
        res.status(405).json({ message: 'Only POST requests are allowed' });
    }
}
