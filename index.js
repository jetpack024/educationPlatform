require('dotenv').config()
const express = require('express');
const path = require('path');
// const Handlebars = require('handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
// const exphbs = require('express-handlebars');
// const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const cardRoutes = require('./routes/card');
const userRoutes = require('./routes/user');
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const consultationRoutes = require('./routes/consultation');
const authRoutes = require('./routes/auth');
const varMiddelware = require('./middelware/variables');
const userMiddeleware = require('./middelware/user');
const hbs = require('hbs');
const { dirname } = require('path');

const app = express();

mongoose.connect('mongodb+srv://Tapac:123123123@cluster0.bwbsi.mongodb.net/shop?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});



app.set('view engine', 'hbs');
app.set('views', 'views');
hbs.registerPartials(`${dirname}/views/partials`)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  // store: new MongoStore({
  //   mongooseConnection: mongoose.createConnection("mongodb+srv://Tapac:123123123@cluster0.bwbsi.mongodb.net/shop?retryWrites=true&w=majority", {
  //     useNewUrlParser: true,
  //     useFindAndModify: false,
  //     useCreateIndex: true,
  //   })
  })
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

app.listen(process.env.PORT || 8080)
