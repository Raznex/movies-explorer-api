const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('./middlewares/cors');
require('dotenv').config();
const helmet = require('helmet');

const { PORT = 3000, NODE_ENV, DB_URL } = process.env;
const app = express();

mongoose.connect((NODE_ENV === 'production' ? DB_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb'), {
  useNewUrlParser: true,
});

app.use(helmet());
app.use(express.json());
app.use(cors);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('./routes/index'));

app.listen(PORT);
