const AccessControl = require('accesscontrol');

const ac = new AccessControl();

exports.roles = (function () {
  ac.grant('donor')
    .readOwn('profile')
    .updateOwn('profile');

  ac.grant('hospital')
    .extend('donor')
    .readAny('profile');

  ac.grant('admin')
    .extend('donor')
    .extend('hospital')
    .updateAny('profile')
    .deleteAny('profile');

  return ac;
}());
