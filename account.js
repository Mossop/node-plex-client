const PlexDevice = require("./device");

class PlexAccount {
  constructor(connection, data) {
    this.connection = connection;
    this.data = data;
  }

  async getDevices() {
    let data = this.connection.getDevices();
    console.log(data);
  }

  async getResource(name) {
    let data = await this.connection.getResources();
    for (let deviceData of data.MediaContainer.Device) {
      if (deviceData.$.name != name) {
        continue;
      }

      return PlexDevice.connect(this.connection, deviceData);
    }

    return null;
  }

  async getResources(provides = []) {
    let connectPromises = [];
    let data = await this.connection.getResources();
    for (let deviceData of data.MediaContainer.Device) {
      if (!PlexDevice.checkProvides(deviceData.$.provides, provides)) {
        continue;
      }

      connectPromises.push(PlexDevice.connect(this.connection, deviceData).catch(() => null));
    }

    let connections = await Promise.all(connectPromises);
    return connections.filter(d => d);
  }

  getServers() {
    return this.getResources(["server"]);
  }
}

module.exports = PlexAccount;
