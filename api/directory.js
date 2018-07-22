const PlexContainer = require("./container");

class PlexDirectory extends PlexContainer {
  constructor(device, path, sourceData, data) {
    super(device, path, data);
    this._sourceData = sourceData;
  }

  get name() {
    return this._sourceData.title;
  }

  static create(device, path, sourceData, data) {
    return new PlexDirectory(device, path, sourceData, data.MediaContainer);
  }
}

module.exports = PlexDirectory;
