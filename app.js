const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/Cors');
const helmet = require('helmet');
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/errorHandler");

const { PORT = 3000, NODE_ENV, DB_URL } = process.env;
const app = express();

mongoose.connect((NODE_ENV === 'production' ? DB_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb'), {
  useNewUrlParser: true,
});

app.use(requestLogger);
app.use(helmet());
app.use(express.json());
app.use(cors);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('./routes/index'));

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
