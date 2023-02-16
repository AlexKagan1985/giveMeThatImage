require("dotenv").config();
const express = require('express');
const cors = require('cors');

const { router: indexRouter } = require('./routes/index');
const { mongoose } = require('./db');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', indexRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})