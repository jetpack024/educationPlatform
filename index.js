const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const cardRoutes = require('./routes/card');
const userRoutes = require('./routes/user');
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const consultationRoutes = require('./routes/consultation');
const authRoutes = require('./routes/auth');
const varMiddelware = require('./middelware/variables');
const userMiddeleware = require('./middelware/user');
require('dotenv').config()


const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

// const store = new MongoStore({
//   collection: 'sessions',
//   url: process.env.DB,
// });

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    collection: 'sessions',
    url: process.env.DB,
  }),
}));
app.use(varMiddelware);
app.use(userMiddeleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/consultation', consultationRoutes);
app.use('/card', cardRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);

app.use((req, res, next) => {
  // const whitelist = [
  //   'https://youtube.com',
  // ];
  // const clientAdress = req.get('origin');
  // if (whitelist.includes(clientAdress)) {
  res.header('Access-Control-Allow-Origin', '*');
  // }
  next();
});



async function start() {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useFindAndModify: false,
    });

    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is runing on port ${process.env.PORT || 8080}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
