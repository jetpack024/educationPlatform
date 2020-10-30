module.exports = function (req, res, next) {
  res.locals.isAuth = req.session.isAuthenticated;
  res.locals.isAdmin = req.session.isAdmin;
  res.locals.isSuperUser = req.session.isSuperUser;
  console.log('res.locals', res.locals);
  console.log('req.session', req.session);
  next();
}
