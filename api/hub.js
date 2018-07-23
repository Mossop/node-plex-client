const PlexContainer = require("./container");

/**
 * Hubs are effectively containers
 */
class PlexHub extends PlexContainer {
  static create(device, path, data) {
    return new PlexHub(device, path, data);
  }
}

module.exports = PlexHub;
