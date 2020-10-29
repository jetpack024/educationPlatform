const express = require('express'); //подключаем express
const path = require('path'); // подключаем path
const Handlebars = require('handlebars'); // поключаем hbs
const mongoose = require('mongoose'); // поключаем mongus
const session = require('express-session'); //подключаем session
const MongoStore = require('connect-mongodb-session')(session); // Создаем связь между mongoDB и session
const exphbs = require('express-handlebars'); // ???
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access'); // ???
const cardRoutes = require('./routes/card'); // подключаем роут корзины
const ordersRoutes = require('./routes/orders'); // подключаем роут заказов
const homeRoutes = require('./routes/home'); // подключаем роут главной страницы
const addRoutes = require('./routes/add'); // подключаем роут добавления нового курса
const coursesRoutes = require('./routes/courses'); // подключаем роут курсов
const authRoutes = require('./routes/auth'); // подключаем роут аутентификации
const User = require('./models/user'); // подключаем модель Юзера
const varMiddelware = require('./middelware/variables'); // подключаем middleware аутентификации сессии
const userMiddeleware = require('./middelware/user'); // поключаем middleware юзера до ауентификации ???

const MONGODB_URL = 'mongodb://localhost:27017/shop'; // подключаем базу данных "shop"
const app = express(); // инициализируем express

// подключаем hbs по умолчанию /layouts/main
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

// создаем в БД коллекцию shop при начале session
const store = new MongoStore({
  collection: 'sessions',
  url: MONGODB_URL,
});

app.engine('hbs', hbs.engine); // регестрируем движок
app.set('view engine', 'hbs'); // начинаем использовать
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public'))); //инициализируем папку public как static
app.use(express.urlencoded({ extended: true })); 
// инициализируем middleware session
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store,
}));
app.use(varMiddelware); // инициализируем middleware утентификации
app.use(userMiddeleware);  // инициализируем middleware юзера до ауентификации ???

app.use('/', homeRoutes); //инициализируем middleware роута главной страницы
app.use('/add', addRoutes); //инициализируем middleware роута добавления нового курса
app.use('/courses', coursesRoutes); //инициализируем middleware роута курсов
app.use('/card', cardRoutes); //инициализируем middleware роута корзины
app.use('/orders', ordersRoutes); //инициализируем middleware роута заказов
app.use('/auth', authRoutes); //инициализируем middleware роута аутентификации

const PORT = process.env.PORT || 8080; // создаем localhost:8080

// функция подключения БД
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
