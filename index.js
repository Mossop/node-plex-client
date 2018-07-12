const Registry = require("./api/registry");
const PlexClient = require("./api/client");
const PlexAccount = require("./api/account");

Registry.register("Directory", require("./api/directory"));

module.exports = {
  PlexClient,
  PlexAccount,
};
