const users = (req, res, next) => {
  res.send([
    { username: '@dejimania', name: 'Kamil dejimania', role: 'Maintainer' },
    {
      username: '@usmanoa',
      name: 'Usman Olarinoye Abdulraheem usmanoa',
      role: 'Maintainer',
    },
    { username: '@ann-mukundi', name: 'ann-mukundi', role: '???' },
    { username: '@lutitech', name: 'lutitech', role: 'Maintainer' },
    {
      username: '@niel98',
      name: 'Moses Daniel Kwaknat niel98',
      role: 'Maintainer',
    },
    { username: '@Busry', name: 'Busry', role: 'Maintainer' },
    { username: '@Jayclef', name: 'Mba James Jayclef', role: 'Maintainer' },
    {
      username: '@charlene04',
      name: 'Charles Ugbana charlene04',
      role: 'Maintainer',
    },
    { username: '@victornonso', name: 'victornonso', role: 'Maintainer' },
    { username: '@BigB97', name: 'MYusuf Bolaji BigB97', role: 'Maintainer' },
  ]);
};

module.exports = {
  users,
};
