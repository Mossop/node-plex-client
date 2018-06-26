const util = require("util");
const { URL } = require("url");

const request = require("request-promise-native");
const xml2js = require("xml2js");

const PLEX_URL_SIGNIN = new URL("https://plex.tv/users/sign_in.xml");
const PLEX_URL_RESOURCES = new URL("https://plex.tv/api/resources?includeHttps=1&includeRelay=1");
const PLEX_URL_DEVICES = new URL("https://plex.tv/devices.xml");

const parseXML = util.promisify(xml2js.parseString);

class PlexConnection {
  constructor(client, token) {
    this.client = client;
    this.token = token;
  }

  getHeaders() {
    let headers = {
      "X-Plex-Platform": this.client.options.platform,
      "X-Plex-Platform-Version": this.client.options.platformVersion,
      "X-Plex-Provides": this.client.options.provides.join(","),
      "X-Plex-Product": this.client.options.product,
      "X-Plex-Version": this.client.options.version,
      "X-Plex-Device": this.client.options.device,
      "X-Plex-Device-Name": this.client.options.name,
      "X-Plex-Client-Identifier": this.client.options.uuid,
      "X-Plex-Client-Platform": this.client.options.platform,
    };

    if (this.client.options.provides.includes("sync-target")) {
      headers["X-Plex-Sync-Version"] = "2";
    }

    if (this.token) {
      headers["X-Plex-Token"] = this.token;
    }

    if (this.client.options.screenResolution) {
      headers["X-Plex-Device-Screen-Resolution"] = this.client.options.screenResolution;
    }

    if (this.client.options.screenDensity) {
      headers["X-Plex-Device-Screen-Density"] = this.client.options.screenDensity;
    }

    return headers;
  }

  async request(url, method = request, auth = null) {
    let headers = this.getHeaders();

    let response = await method({
      url: url.toString(),
      resolveWithFullResponse: true,
      auth,
      headers,
      timeout: 2000,
    });

    return parseXML(response.body);
  }

  async getAccount(username, password) {
    let result = await this.request(PLEX_URL_SIGNIN, request.post, { username, password });
    this.token = result.user.$.authenticationToken;
    return result;
  }

  getResources() {
    return this.request(PLEX_URL_RESOURCES);
  }

  getDevices() {
    return this.request(PLEX_URL_DEVICES);
  }

  getDevice(baseuri) {
    return this.request(baseuri);
  }

  getSyncStatus(baseuri) {
    let url = new URL(`/sync/${this.client.options.uuid}/status`, baseuri);
    return this.request(url);
  }
}

module.exports = PlexConnection;
