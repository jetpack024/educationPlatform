const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const authRoutes = require('./routes/auth');
const varMiddelware = require('./middelware/variables');
const userMiddeleware = require('./middelware/user');


const MONGODB_URL = 'mongodb://localhost:27017/shop'; 
const app = express(); 

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

const store = new MongoStore({
  collection: 'sessions',
  url: MONGODB_URL,
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs'); 
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.urlencoded({ extended: true })); 

app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store,
}));
app.use(varMiddelware); 
app.use(userMiddeleware);  

app.use('/', homeRoutes); 
app.use('/add', addRoutes); 
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes); 
app.use('/orders', ordersRoutes); 
app.use('/auth', authRoutes); 

const PORT = process.env.PORT || 8080; 

async function start() {
  try {
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
    });

    app.listen(PORT, () => {
      console.log(`Server is runing on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
