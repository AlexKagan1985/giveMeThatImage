import "dotenv/config"
import express, { json } from 'express';
import cors from 'cors';

import { router as indexRouter } from './routes/index.js';
import { searchRouter } from './routes/search.js';
import { errorHandler } from "./middlewares/error.js";
import { userRouter } from "./routes/user.js";
import axios from "axios";
import https from "https";
const PORT = process.env.PORT || 3001;

const app = express();

app.use(json());
app.use(cors());

app.use('/', indexRouter);
app.use('/', searchRouter);
app.use('/user', userRouter);

app.get('/artstation_image/:hashid', async (req, res) => {
  const {hashid} = req.params;
  const response = await axios.get(`https://www.artstation.com/projects/${hashid}.json`);
  const resData = response.data;
  res.send(resData);
})

const sslOptions = {
  key: fs.readFileSync("/root/certs/privkey.pem"),
  cert: fs.readFileSync("/root/certs/cert.pem")
};

app.use(errorHandler);
/* app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Hello world!")
}) */

https.createServer(sslOptions, app).listen(PORT);
