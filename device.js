const { URL } = require("url");

const { PlexDirectory, PlexContainer } = require("./container");

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
  constructor(connection, baseuri, data, resourceData) {
    super(connection, baseuri, data);
    this.resourceData = resourceData;
  }

  get name() {
    return this.deviceData.$.friendlyName;
  }

  static async connect(connection, resourceData) {
    let cls = PlexDevice;
    if (PlexDevice.checkProvides(resourceData.$.provides, ["server"])) {
      cls = PlexServer;
    } else if (PlexDevice.checkProvides(resourceData.$.provides, ["client"])) {
      cls = PlexClient;
    }

    let connections = resourceData.Connection.map(c => ({
      uri: new URL(c.$.uri),
      local: c.$.local == "1",
      relay: c.$.relay == "1",
    })).sort(sortConnections);

    for (let conn of connections) {
      try {
        let deviceData = await connection.getDevice(conn.uri);
        return new cls(connection, conn.uri, deviceData.MediaContainer, resourceData);
      } catch (e) {
        // Ignore failures to connect
      }
    }

    throw new Error(`Unable to connect to device "${resourceData.$.name}".`);
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
      $: {
        title: "Library Sections",
        key: "library/sections",
      },
    });
  }
}

class PlexClient extends PlexDevice {
}

module.exports = PlexDevice;
