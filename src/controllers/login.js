const login = (req, res, next) => {
  res.render('index', { title: 'login' });
};

module.exports = {
  login
};
