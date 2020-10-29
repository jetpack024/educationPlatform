const { Router } = require('express');
const router = Router();

// Роут главной страницы "index.hbs"
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Главная страница',
    isHome: true,
  })
})

module.exports = router;
