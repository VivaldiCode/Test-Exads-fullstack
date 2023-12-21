const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors')

const usersRoutes = require('./routes/users.routes');
const statusesRoutes = require('./routes/statuses.routes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ limit: '5mb', extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/users', usersRoutes);
app.use('/statuses', statusesRoutes);

module.exports = app;
