const { URL } = require("url");

const PlexContainer = require("./container");
const PlexClient = require("./client");

/**
 * Represents a connected device. You can retrieve information and send commands
 * to the device. PlexDevice is an instance of PlexContainer which allows
 * browsing the device's contents.
 */
class PlexDevice extends PlexContainer {
  /**
   * Creates a new PlexDevice. Generally you wouldn't use this directly, instead
   * get a device from PlexAccount.getResource or call PlexDevice.connect.
   * 
   * @param {PlexClient} client the client used to access the device.
   * @param {URL} baseuri the URI to connect to the device.
   * @param {String} token the authentication used to access this device.
   * @param {Object} data data about the device.
   */
  constructor(client, baseuri, token, data) {
    super(baseuri, data);
    this._client = client;
    this._token = token;
    this._device = this;
  }

  /**
   * Returns the device name.
   * 
   * @returns {String}
   */
  get name() {
    return this._data.friendlyName;
  }

  async loadItem(url) {
    let data = await this._client.request(url, { token: this._token });
    if ("MediaContainer" in data) {
      let container = new PlexContainer(url, data.MediaContainer);
      container._device = this;
      return container;
    } else {
      throw new Error(`Unexpected response: ${Object.keys(data)[0]}`);
    }
  }

  /**
   * Attempts to connect to a Plex device.
   * 
   * @param client the PlexClient to use to connect.
   * @param {URL} baseuri the URI to connect to.
   * @param {String} token the authentication token to use.
   * @returns {Promise<PlexDevice>} the connected device on success.
   */
  static async connect(client, baseuri, token) {
    let data = await client.request(baseuri, { token });
    return new PlexDevice(client, baseuri, token, data.MediaContainer);
  }

  /**
   * A helper function to verify that the given provides data for a device
   * matches the requirements.
   * 
   * @param {String} deviceProvides the device provides string.
   * @param {String[]} provides the list of requirements.
   * @returns {boolean} true if the device provides all of the things requested.
   */
  static checkProvides(deviceProvides, provides = []) {
    // Shortcut the empty case.
    if (provides.length == 0) {
      return true;
    }

    let list = deviceProvides.split(",");
    for (let item of provides) {
      if (!list.includes(item)) {
        return false;
      }
    }

    return true;
  }
}

/*class PlexServer extends PlexDevice {
  get library() {
    return new PlexDirectory(this.connection, this.baseuri, {
      attributes: {
        title: "Library Sections",
        key: "library/sections",
      },
    });
  }

  async getSyncStatus() {
    let url = new URL(`/sync/${this.client.options.uuid}/status`, this.baseuri)
    let data = await this.client.request(url, { token: this.token });
    return data.SyncList.SyncItems[0].SyncItem.map(si => new PlexSyncItem(this.connection, this, si));
  }
}

class PlexClient extends PlexDevice {
}*/

module.exports = PlexDevice;
