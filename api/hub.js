const PlexContainer = require("./container");

/**
 * Hubs are effectively containers
 */
class PlexHub extends PlexContainer {
  static create(device, path, data, sourceData) {
    return new PlexHub(device, path, data.MediaContainer, sourceData);
  }
}

module.exports = PlexHub;
