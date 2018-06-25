const PlexDevice = require("./device");

class PlexAccount {
  constructor(connection, data) {
    this.connection = connection;
    this.data = data;
  }

  async getDevice(name) {
    let devices = await this.getDevices();
    for (let device of devices) {
      if (device.name == name) {
        return device;
      }
    }
  }

  async getDevices(provides = []) {
    let devices = [];
    let data = await this.connection.getDevices();
    for (let deviceData of data.MediaContainer.Device) {
      let device = new PlexDevice(deviceData);
      if (device.provides(provides)) {
        devices.push(device);
      }
    }

    return devices;
  }
}

module.exports = PlexAccount;
