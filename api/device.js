const PlexContainer = require("./container");
const PlexConnection = require("./connection");

/**
 * Represents a connected device. You can retrieve information and send commands
 * to the device.
 */
class PlexDevice extends PlexContainer {
  /**
   * Creates a new PlexDevice. Generally you wouldn't use this directly, instead
   * get a device from PlexAccount.getResource or call PlexDevice.connect.
   * 
   * @param {PlexConnection} connection the connection used to access the device.
   * @param {URL} baseuri the URI to connect to the device.
   * @param {Object} data data about the device.
   */
  constructor(connection, baseuri, data) {
    super(connection, baseuri, data);
  }

  /**
   * Returns the device name.
   * 
   * @returns {String}
   */
  get name() {
    return this._data.friendlyName;
  }

  /**
   * Attempts to connect to a Plex device.
   * 
   * @param client the PlexClient to use to connect.
   * @param {URL} baseuri the URI to connect to.
   * @param {String} authToken the authentication token to use.
   * @returns {Promise<PlexDevice>} the connected device on success.
   */
  static async connect(client, baseuri, authToken) {
    let data = await client.connection.getContainer(baseuri, authToken);
    return new PlexDevice(client.connection, baseuri, data.MediaContainer);
  }

  /**
   * A helper function to verify that the given provides data for a device
   * matches the requirements.
   * 
   * @param {String} deviceProvides the device provides string.
   * @param {String[]} provides the list of requirements.
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
    let data = await this.connection.getSyncStatus(this.baseuri);
    return data.SyncList.SyncItems[0].SyncItem.map(si => new PlexSyncItem(this.connection, this, si));
  }
}

class PlexClient extends PlexDevice {
}*/

module.exports = PlexDevice;
