const os = require("os");
const crypto = require("crypto");

const pkg = require("./package.json");
const PlexAccount = require("./account");
const PlexConnection = require("./connection");

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

class PlexClient {
  constructor(options = {}) {
    Object.defineProperty(this, "options", {
      value: {},
    });

    Object.assign(this.options, {
      platform: capitalize(os.platform()),
      platformVersion: os.release(),
      provides: "controller,sync-target",
      product: pkg.name,
      version: pkg.version,
      device: capitalize(os.platform()),
      name: os.hostname(),
      uuid: crypto.createHash("sha1").update(os.hostname()).digest("hex"),
    }, options);
  }

  async login(username, password) {
    Object.freeze(this.options);
    let connection = new PlexConnection(this);
    let data = await connection.getAccount(username, password);
    return new PlexAccount(connection, data);
  }
}

module.exports = { PlexClient };

