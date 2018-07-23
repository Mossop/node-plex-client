const PlexContainer = require("./container");

class PlexDirectory extends PlexContainer {
  static create(device, path, data) {
    return new PlexDirectory(device, path, data);
  }
}

module.exports = PlexDirectory;
