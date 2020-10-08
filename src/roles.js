const AccessControl = require('accesscontrol');
const { UserRole } = require("../src/models/user");

const ac = new AccessControl();

exports.roles = (function () {
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
}());
