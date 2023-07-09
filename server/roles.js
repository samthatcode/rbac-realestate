const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("user")
    .readOwn("profile")
    .updateOwn("profile")
    .readOwn("order");

  ac.grant("marketer")
    .extend("user")    
    .updateOwn("profile")
    .readAny("order")
    .updateAny("order")
    .readAny("property");

  ac.grant("admin")
    .extend("marketer")
    .readAny("profile")
    .updateAny("profile")
    .deleteAny("profile")
    .createAny("property")
    .updateAny("property")
    .deleteAny("property")
    .createAny("order")
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
