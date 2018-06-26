const os = require("os");
const crypto = require("crypto");

const pkg = require("../package.json");
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
      provides: ["controller"],
      product: pkg.name,
      version: pkg.version,
      device: capitalize(os.platform()),
      name: os.hostname(),
      uuid: crypto.createHash("sha1").update(os.hostname()).digest("hex"),
      screenResolution: "1920x1080 (Mobile)",
      screenDensity: "320",
    }, options);
  }

  async login(username, password) {
    Object.freeze(this.options);
    this.connection = new PlexConnection(this);
    let data = await this.connection.getAccount(username, password);
    this.account = new PlexAccount(this.connection, data);
    return this.account;
  }

  async getDevice() {
    if (!this.account) {
      throw new Error("Must be logged in first.");
    }

    let data = await this.connection.getDevices();
    let device = data.MediaContainer.Device.find(d => d.$.clientIdentifier == this.options.uuid);
  }
}

module.exports = PlexClient;

