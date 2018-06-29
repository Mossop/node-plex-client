const { URL } = require("url");

const request = require("request-promise-native");
const mimematch = require("mime-match");

const parseXML = require("./xml");

const PLEX_WEB_SIGNIN = "api/v2/users/signin";
const PLEX_WEB_RESOURCES = "api/resources?includeHttps=1&includeRelay=1";

class PlexConnection {
  constructor(client, token) {
    this.client = client;
    this.token = token;
  }

  getHeaders() {
    let headers = {
      "Accept": "application/json, text/javascript, */*; q=0.01",
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

    if (this.client.options.screenResolution) {
      headers["X-Plex-Device-Screen-Resolution"] = this.client.options.screenResolution;
    }

    if (this.client.options.screenDensity) {
      headers["X-Plex-Device-Screen-Density"] = this.client.options.screenDensity;
    }

    return headers;
  }

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
    if (mimematch("application/json", response.headers["content-type"])) {
      body = JSON.parse(body);
    } else {
      body = await parseXML(body);
    }
    return body;
  }

  async getAccount(username, password) {
    let url = new URL(PLEX_WEB_SIGNIN, this.client.options.plexWebURL);
    let result = await this.request(url, { method: "POST", form: { login: username, password }});
    return result;
  }

  getResources(token) {
    let url = new URL(PLEX_WEB_RESOURCES, this.client.options.plexWebURL);
    return this.request(url, { token });
  }

  getContainer(baseuri, token) {
    return this.request(baseuri, { token });
  }

  getSyncStatus(baseuri, token) {
    let url = new URL(`/sync/${this.client.options.uuid}/status`, baseuri);
    return this.request(url, { token });
  }
}

module.exports = PlexConnection;
