const PlexDevice = require("./device");

/**
 * Represents a user's plex.tv account information. Used for listing associated
 * devices, see getResource, getResources or getServer.
 */
class PlexAccount {
  /**
   * This is an internal class and should not be instantiated directly. Instead
   * use PlexAccount.login to create an instance.
   * 
   * @param {PlexConnection} connection the connection info to use for API calls.
   * @param {*} data the parsed data for the account.
   */
  constructor(connection, data) {
    this.connection = connection;
    this.data = data;
  }

  /**
   * Logs in to a plex.tv account and returns a PlexAccount instance.
   * 
   * @param {PlexClient} client the client data to use to request login.
   * @param {String} username the user's username.
   * @param {String} password the user's password.
   * @returns {Promise<PlexAccount>} the account instance on success.
   */
  static async login(client, username, password) {
    let data = await client.connection.getAccount(username, password);
    return new PlexAccount(client.connection, data);
  }

  /**
   * The username associated with the account.
   */
  get username() {
    return this.data.username;
  }

  /**
   * The name associated with the account.
   */
  get name() {
    return this.data.title;
  }

  /**
   * The email address associated with the account.
   */
  get email() {
    return this.data.email;
  }

  /**
   * Retrieves a PlexDevice for a recently used resource. This generally means
   * API clients that can be controlled or accessed in some way.
   * 
   * @param {String} name the name of the device
   * @returns {Promise<PlexDevice>} the device on success.
   */
  async getResource(name) {
    let data = await this.connection.getResources();
    for (let deviceData of data.MediaContainer.Device) {
      if (deviceData.name != name) {
        continue;
      }

      return PlexDevice.connect(this.connection, deviceData);
    }

    throw new Error(`No resource named ${name}`);
  }

  /**
   * Retrieves a list of PlexDevice's that support the passed features.
   * 
   * @param {String[]} provides a list of features the resource should support.
   * @returns {Promise<PlexDevice[]>} a list of devices.
   */
  async getResources(provides = []) {
    let connectPromises = [];
    let data = await this.connection.getResources();
    for (let deviceData of data.MediaContainer.Device) {
      if (!PlexDevice.checkProvides(deviceData.provides, provides)) {
        continue;
      }

      connectPromises.push(PlexDevice.connect(this.connection, deviceData).catch(() => null));
    }

    let connections = await Promise.all(connectPromises);
    return connections.filter(d => d);
  }

  /**
   * A shortcut for getting the server resources.
   * 
   * @returns {Promise<PlexServer[]>} a list of servers.
   */
  getServers() {
    return this.getResources(["server"]);
  }
}

module.exports = PlexAccount;
