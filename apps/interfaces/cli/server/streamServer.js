import express from 'express';

const app = express();
app.use(express.json());

import { sampleDataStream } from './openaiResponse.js';


app.use(express.json());

app.post('/', (req, res) => {
  let currentDataIndex = 0;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  function writeData() {
    if (currentDataIndex >= sampleDataStream.length) {
      res.end();
      return;
    }
    res.write(`data: ${JSON.stringify(sampleDataStream[currentDataIndex])}\n
`);
    currentDataIndex++;
    setTimeout(writeData, 20); // delay before sending the next chunk
  }
  writeData();
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});