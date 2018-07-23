const PlexItem = require("./item");
const PlexContainer = require("./container");

/**
 * Most media is represented by the Metadata object. We split it out into
 * different types as necessary.
 */
class PlexMetadata extends PlexItem {
  get height() {
    return this._data.Media[0].height;
  }

  get width() {
    return this._data.Media[0].width;
  }

  get aspectRatio() {
    return this._data.Media[0].aspectRatio;
  }

  get container() {
    return this._data.Media[0].container;
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
    return new PlexContainer(device, path, data.MediaContainer, sourceData);
  }
}

class PlexMovie extends PlexMetadata {
}

class PlexEpisode extends PlexMetadata {
}

class PlexPhoto extends PlexMetadata {
}

module.exports = PlexMetadata;
