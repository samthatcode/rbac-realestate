const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("user")
    .createAny("order")
    .readAny("product")
    .readOwn("profile")
    .updateOwn("profile")
    .readOwn("order");

  ac.grant("marketer")
    .extend("user")
    .updateOwn("profile")
    .readAny("order")
    .readAny("property");

  ac.grant("admin")
    .extend("marketer")
    .readAny("profile")
    .updateAny("profile")
    .updateAny("user")
    .deleteAny("profile")
    .createAny("property")
    .updateAny("property")
    .deleteAny("property")
    .createAny("product")
    .readAny("product")
    .updateAny("product")
    .deleteAny("product")
    .createAny("order")
    .updateAny("order")
    .deleteAny("order")
    .updateAny('role')
    .deleteAny("role");

  ac.grant("agent")
    .extend("user")
    .updateAny("order");

  ac.grant("agency")
    .extend("agent")
    .createAny("order")
    .deleteOwn("order");


  return ac;
})();
