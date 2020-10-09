const AccessControl = require('accesscontrol');

const ac = new AccessControl();

exports.roles = (function () {
  ac.grant('user')
    .readOwn('profile')
    .updateOwn('profile');

  ac.grant('hospital')
    .extend('user')
    .readAny('profile');

  ac.grant('admin')
    .extend('user')
    .extend('hospital')
    .updateAny('profile')
    .deleteAny('profile');

  return ac;
}());
