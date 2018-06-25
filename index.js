const os = require("os");
const crypto = require("crypto");
const util = require("util");

const pkg = require("./package.json");

const request = require("request-promise-native");
const xml2js = require("xml2js");

const PLEX_URL_SIGNIN = "https://plex.tv/users/sign_in.xml";

const parseXML = util.promisify(xml2js.parseString);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

class PlexConnection {
  constructor(client, token) {
    this.client = client;
    this.token = token;
  }

  getHeaders() {
    let headers = this.client.getHeaders();
    if (this.token) {
      headers["X-Plex-Token"] = this.token;
    }
    return headers;
  }

  async request(url, auth = null) {
    let headers = this.getHeaders();

    let response = await request.post({
      url,
      resolveWithFullResponse: true,
      auth,
      headers,
    });

    return parseXML(response.body);
  }

  async getAccount(username, password) {
    let result = await this.request(PLEX_URL_SIGNIN, { username, password });
    this.token = result.user.$.authenticationToken;
    return result;
  }
}

class PlexClient {
  constructor(options = {}) {
    this.options = {};
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

  getHeaders() {
    return {
      "X-Plex-Platform": this.options.platform,
      "X-Plex-Platform-Version": this.options.platformVersion,
      "X-Plex-Provides": this.options.provides,
      "X-Plex-Product": this.options.product,
      "X-Plex-Version": this.options.version,
      "X-Plex-Device": this.options.device,
      "X-Plex-Device-Name": this.options.name,
      "X-Plex-Client-Identifier": this.options.uuid,
    };
  }
}

class PlexAccount {
  constructor(connection, data) {
    this.connection = connection;
    this.data = data;
  }

  static async login(client, username, password) {
    let connection = new PlexConnection(client);
    return new PlexAccount(connection, await connection.getAccount(username, password));
  }
}

module.exports = {
  PlexClient,
  PlexAccount,
};
