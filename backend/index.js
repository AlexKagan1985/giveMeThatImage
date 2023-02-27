import "dotenv/config"
import express, { json } from 'express';
import cors from 'cors';

import { router as indexRouter } from './routes/index.js';
import { searchRouter } from './routes/search.js';
import { errorHandler } from "./middlewares/error.js";
import { userRouter } from "./routes/user.js";
const PORT = process.env.PORT || 3001;

const app = express();

app.use(json());
app.use(cors());

app.use('/', indexRouter);
app.use('/', searchRouter);
app.use('/user', userRouter);

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Hello world!")
})
