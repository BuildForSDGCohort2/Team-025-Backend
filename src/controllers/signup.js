const signup = (req, res, next) => {
  res.render('index', { title: 'Signup' });
};

module.exports = {
  signup
};
