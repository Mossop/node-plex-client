const { setTimeout } = require("timers");

function sortConnections(a, b) {
  if (a.relay != b.relay) {
    return a.relay ? 1 : -1;
  }

  if (a.local != b.local) {
    return a.local ? -1 : 1;
  }

  return 0;
}

class PlexDevice {
  constructor(connection, baseuri, data, deviceData) {
    this.connection = connection;
    this.baseuri = baseuri;
    this.data = data;
    this.deviceData = deviceData;
  }

  get name() {
    return this.deviceData.$.friendlyName;
  }

  static async connect(connection, data) {
    let connections = data.Connection.map(c => ({
      uri: c.$.uri,
      local: c.$.local == "1",
      relay: c.$.relay == "1",
    })).sort(sortConnections);

    for (let conn of connections) {
      try {
        let deviceData = await connection.getDevice(conn.uri);
        return new PlexDevice(connection, conn.uri, data, deviceData.MediaContainer);
      } catch (e) {
        // Ignore failures to connect
      }
    }

    throw new Error(`Unable to connect to device "${data.$.name}".`);
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

module.exports = PlexDevice;
