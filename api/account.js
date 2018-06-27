const PlexDevice = require("./device");

class PlexAccount {
  constructor(connection, data) {
    this.connection = connection;
    this.data = data;
  }

  static async login(client, username, password) {
    let data = await client.connection.getAccount(username, password);
    return new PlexAccount(client.connection, data);
  }

  get username() {
    return this.data.username;
  }

  get name() {
    return this.data.title;
  }

  get email() {
    return this.data.email;
  }

  async getResource(name) {
    let data = await this.connection.getResources();
    for (let deviceData of data.elements.Device) {
      if (deviceData.attributes.name != name) {
        continue;
      }

      return PlexDevice.connect(this.connection, deviceData);
    }

    return null;
  }

  async getResources(provides = []) {
    let connectPromises = [];
    let data = await this.connection.getResources();
    for (let deviceData of data.elements.Device) {
      if (!PlexDevice.checkProvides(deviceData.attributes.provides, provides)) {
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
