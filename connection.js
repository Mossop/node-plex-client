const util = require("util");

const request = require("request-promise-native");
const xml2js = require("xml2js");

const PLEX_URL_SIGNIN = "https://plex.tv/users/sign_in.xml";
const PLEX_URL_RESOURCES = "https://plex.tv/api/resources?includeHttps=1&includeRelay=1";

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
      "X-Plex-Provides": this.client.options.provides,
      "X-Plex-Product": this.client.options.product,
      "X-Plex-Version": this.client.options.version,
      "X-Plex-Device": this.client.options.device,
      "X-Plex-Device-Name": this.client.options.name,
      "X-Plex-Client-Identifier": this.client.options.uuid,
    };

    if (this.token) {
      headers["X-Plex-Token"] = this.token;
    }

    return headers;
  }

  async request(url, method = request, auth = null) {
    let headers = this.getHeaders();

    let response = await method({
      url,
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

  getDevice(baseuri) {
    return this.request(baseuri);
  }
}

module.exports = PlexConnection;
