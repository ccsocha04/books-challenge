const express = require('express');
const session = require('express-session');
const methodOverride = require("method-override");

const mainRouter = require('./routes/main');
const logMiddleware = require('./middlewares/logMiddleware');
const notFoundMiddleware = require('./middlewares/notFoundMiddleware');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }, 
}));

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use('/', mainRouter);

app.use(logMiddleware);
app.use(notFoundMiddleware);


app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});
