const os = require("os");
const crypto = require("crypto");
const { URL } = require("url");

const pkg = require("../package.json");
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
      product: pkg.name,
      version: pkg.version,
      platform: capitalize(os.platform()),
      platformVersion: os.release(),
      device: capitalize(os.platform()),
      name: os.hostname(),
      uuid: crypto.createHash("sha1").update(os.hostname()).digest("hex"),
      provides: ["controller"],
      screenResolution: "1920x1080",
      plexWebURL: new URL("https://plex.tv/")
    }, options);

    Object.freeze(this.options);
    this.connection = new PlexConnection(this);
  }

  static Android(options = {}) {
    let finalOptions = Object.assign({}, {
      product: "Plex for Android",
      version: "7.0.4.5618",
      platform: "Android",
      platformVersion: "8.1.0",
      device: "Android",
      provides: ["controller", "sync-target"],
      screenResolution: "1920x1080 (Mobile)",
      screenDensity: "320",
    }, options);

    return new PlexClient(finalOptions);
  }

  static WebBrowser(options = {}) {
    let finalOptions = Object.assign({}, {
      product: "Plex Web",
      version: "3.57.1",
      platform: "Firefox",
      platformVersion: "63.0",
      device: "OSX",
      screenResolution: "1920x1200",
    }, options);

    return new PlexClient(finalOptions);
  }
}

module.exports = PlexClient;

