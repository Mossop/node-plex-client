const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const request = require("request-promise-native");
const MIMEType = require("whatwg-mimetype");

const parseXML = require("./xml");

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
   * @param {Object} options override the default options.
   */
  constructor(options = {}) {
    let pkg = {};
    if (!("product" in options) || !("version" in options)) {
      let pkgpath = path.resolve(__dirname, "..", "package.json");
      pkg = JSON.parse(require("fs").readFileSync(pkgpath, { encoding: "utf8" }));
    }

    this._options = Object.assign({}, {
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

    Object.freeze(this._options);
  }

  /**
   * Creates a new PlexClient but uses a set of defaults that makes it look like
   * an Android client.
   * 
   * @param {Object} options override options as described in the constructor.
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
   * @param {Object} options override options as described in the constructor.
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

  /**
   * Returns the headers to associate with any request to a Plex API.
   * 
   * @returns {Object.<String, String>} a map of header name to value.
   */
  getHeaders() {
    let headers = {
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "X-Plex-Platform": this._options.platform,
      "X-Plex-Platform-Version": this._options.platformVersion,
      "X-Plex-Provides": this._options.provides.join(","),
      "X-Plex-Product": this._options.product,
      "X-Plex-Version": this._options.version,
      "X-Plex-Device": this._options.device,
      "X-Plex-Device-Name": this._options.name,
      "X-Plex-Client-Identifier": this._options.uuid,
      "X-Plex-Client-Platform": this._options.platform,
    };

    if (this._options.provides.includes("sync-target")) {
      headers["X-Plex-Sync-Version"] = "2";
    }

    if (this._options.screenResolution) {
      headers["X-Plex-Device-Screen-Resolution"] = this._options.screenResolution;
    }

    if (this._options.screenDensity) {
      headers["X-Plex-Device-Screen-Density"] = this._options.screenDensity;
    }

    return headers;
  }

  /**
   * Makes a request to a Plex service and parses the response from JSON or XML
   * into a JS object.
   * 
   * @typedef {Object} RequestOptions
   * @property {string=} method the HTTP request method to use.
   * @property {Object=} form the form parameters to send.
   * @property {string=} token the authentication token to send.
   * @param {URL} url the url to request.
   * @param {RequestOptions} options options for the request.
   * @returns {Promise<Object>} the parsed data returned on success.
   */
  async request(url, { method = "GET", form = null, token = null } = {}) {
    let headers = this.getHeaders();
    if (token) {
      headers["X-Plex-Token"] = token;
    }

    let response = await request({
      url: url.toString(),
      resolveWithFullResponse: true,
      headers,
      form,
      method,
      timeout: 2000,
    });

    let body = response.body;
    let mimetype = MIMEType.parse(response.headers["content-type"]);
    if (mimetype && mimetype.essence == "application/json") {
      body = JSON.parse(body);
    } else {
      body = await parseXML(body);
    }
    return body;
  }
}

module.exports = PlexClient;

