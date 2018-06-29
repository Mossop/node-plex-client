const { URL } = require("url");

const { PlexDirectory, PlexContainer } = require("./container");
const { PlexSyncItem } = require("./sync");

function sortConnections(a, b) {
  if (a.relay != b.relay) {
    return a.relay ? 1 : -1;
  }

  if (a.local != b.local) {
    return a.local ? -1 : 1;
  }

  return 0;
}

class PlexDevice extends PlexContainer {
  constructor(connection, baseuri, data) {
    super(connection, baseuri, data);
    this.device = this;
  }

  get name() {
    return this.data.friendlyName;
  }

  async getItem(uri) {
    let data = this.connection.request(uri);
    for (let prop of Object.keys(data)) {
      for (let itemData of data[prop]) {
        if (prop == "MediaContainer") {
          let item = new PlexContainer(this.connection, uri, itemData);
          item.device = this;
          return item;
        }
      }
    }
  }

  static async connect(connection, resourceData) {
    let connections = resourceData.Connection.map(c => ({
      uri: new URL(c.uri),
      local: c.local == "1",
      relay: c.relay == "1",
    })).sort(sortConnections);

    for (let conn of connections) {
      try {
        let deviceData = await connection.getDevice(conn.uri);
        return new PlexDevice(connection, conn.uri, deviceData.MediaContainer);
      } catch (e) {
        // Ignore failures to connect
      }
    }

    throw new Error(`Unable to connect to device "${resourceData.name}".`);
  }

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

class PlexServer extends PlexDevice {
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
}

module.exports = PlexDevice;
