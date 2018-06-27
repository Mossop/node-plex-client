const os = require("os");
const crypto = require("crypto");
const { URL } = require("url");

const pkg = require("../package.json");
const PlexConnection = require("./connection");

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * PlexClient is the first class that any API callers must instantiate. It is
 * responsible for holding details about the sort of device that is using the
 * API. Different settings will cause Plex to respond differently, for example
 * only certain product names will work for syncing.
 */
class PlexClient {
  /**
   * An optional options argument can be passed to override various defaults
   * for the settings which have the following defaults:
   * 
   * product
   *   "plex-client".
   * version
   *   plex-client's version.
   * platform
   *   The current OS.
   * platformVersion
   *   The current OS version.
   * device
   *   The current OS.
   * name
   *   The current hostname.
   * uuid
   *   A unique identified for the client, generated from the hostname.
   * provides
   *   An array of services the client provides.
   * screenResolution
   *   "1920x1080".
   * screenDensity
   *   undefined.
   * 
   * @param {object} options override the default options.
   */
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

  /**
   * Creates a new PlexClient but uses a set of defaults that makes it look like
   * an Android client.
   * 
   * @param {object} options override options as described in the constructor.
   */
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

  /**
   * Creates a new PlexClient but uses a set of defaults that makes it look like
   * a web browser client.
   * 
   * @param {object} options override options as described in the constructor.
   */
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

