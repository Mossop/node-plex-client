const PlexItem = require("./item");
const PlexContainer = require("./container");

/**
 * Most media is represented by the Metadata object. We split it out into
 * different types as necessary.
 */
class PlexMetadata extends PlexContainer {
  /**
   * Gets the item's name.
   * 
   * @returns {String} the name.
   */
  get name() {
    return this._sourceData.title;
  }

  static create(device, path, data, sourceData) {
    if ("Media" in sourceData) {
      switch (sourceData.type) {
      case "movie":
        return new PlexMovie(device, path, data.MediaContainer.Metadata[0], sourceData);
      case "episode":
        return new PlexEpisode(device, path, data.MediaContainer.Metadata[0], sourceData);
      case "photo":
        return new PlexPhoto(device, path, data.MediaContainer.Metadata[0], sourceData);
      }
    }
    return new PlexMetadata(device, path, data.MediaContainer, sourceData);
  }
}

class PlexMovie extends PlexItem {
}

class PlexEpisode extends PlexItem {
}

class PlexPhoto extends PlexItem {
}

module.exports = PlexMetadata;
