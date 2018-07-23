const PlexContainer = require("./container");

class PlexDirectory extends PlexContainer {
  get name() {
    return this._sourceData.title;
  }

  static create(device, path, data, sourceData) {
    return new PlexDirectory(device, path, data.MediaContainer, sourceData);
  }
}

module.exports = PlexDirectory;
