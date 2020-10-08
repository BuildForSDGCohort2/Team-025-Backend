const AccessControl = require('accesscontrol');
const { UserRole } = require('./models/user');

const ac = new AccessControl();

exports.roles = (() => {
  ac.grant(UserRole.User)
    .readOwn('profile')
    .updateOwn('profile');

  ac.grant(UserRole.Hospital)
    .extend(UserRole.User)
    .readAny('profile');

  ac.grant(UserRole.Admin)
    .extend(UserRole.User)
    .extend(UserRole.Hospital)
    .updateAny('profile')
    .deleteAny('profile');

  return ac;
});
