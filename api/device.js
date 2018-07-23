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
    super(null, "/", data);
    this._client = client;
    this._baseuri = baseuri;
    this._token = token;
  }

  /**
   * Returns the device ID.
   * 
   * @returns {String} the ID.
   */
  get id() {
    return this._data.machineIdentifier;
  }

  /**
   * Returns the device name.
   * 
   * @returns {String} the name.
   */
  get name() {
    return this._data.friendlyName;
  }

  /**
   * Gets a URL including any necessary authentication tokens that can be
   * accessed directly.
   * 
   * @param {String} path the path to be accessed.
   * @returns {URL} a URL that can be loaded to access the data.
   */
  _getURL(path) {
    let url = new URL(path, this._baseuri);
    url.searchParams.set("X-Plex-Token", this._token);
    return url;
  }

  /**
   * Returns a URL that when retrieved transcodes the original image, normally
   * altering its size, though other effects are available.
   * 
   * @typedef {Object} TranscodeOptions
   * @property {Number} height the desired maximum height.
   * @property {Number} width the desired maximum width.
   * @property {Number} minSize ???.
   * @property {String} format the image format (png or jpg).
   * @property {Number} opacity opacity of the image, 0-100.
   * @property {String} background html color for a background when not fully opaque.
   * @property {Number} blur how much to blur the image.
   * @property {Number} upscale whether to upscale the image.
   * @param {URL} url the URL of the image to transcode.
   * @param {TranscodeOptions} options options for transcoding
   */
  transcodeImage(url, options) {
    if (!options.width || !options.height) {
      throw new Error("Both 'width' and 'height' options must be specified.");
    }

    const parameters = [
      "height",
      "width",
      "minSize",
      "format",
      "opacity",
      "background",
      "blur",
      "upscale",
    ];

    let path = url.toString();
    let baseuri = this._baseuri.toString();
    if (path.startsWith(baseuri)) {
      path = path.substring(baseuri.length - 1);
    }

    let transcoded = new URL("/photo/:/transcode", this._baseuri);
    transcoded.searchParams.set("url", path);
    transcoded.searchParams.set("X-Plex-Token", this._token);
    for (let param of parameters) {
      if (param in options) {
        transcoded.searchParams.set(param, options[param]);
      }
    }

    return transcoded;
  }

  /**
   * Loads a Plex item's data. Normally only called internally.
   * 
   * @param {String} path the item's path.
   * @returns {Promise<Object>} the item data requested on success.
   */
  async _loadItemData(path) {
    let url = new URL(path, this._baseuri);
    return await this._client.request(url, { token: this._token });
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
