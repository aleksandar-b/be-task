import express from 'express';
import './externalService';
import {sessionRead} from "./service/sessionRead";

const app = express();
const port = 3000;

app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const json = await sessionRead(req.params.sessionId);
    return res.status(200).json(json);
  } catch (error: any) {
    console.error('Error happened', error);
    return res.status(error.response.status).json({ message: error.response.data });
  }
});

app.listen(port, () => {
  console.info(`Service is listening at http://localhost:${port}`);
});
