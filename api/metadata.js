const PlexItem = require("./item");
const PlexContainer = require("./container");

/**
 * Most media is represented by the Metadata object. We split it out into
 * different types as necessary.
 */
class PlexMetadata extends PlexItem {
  /**
   * Gets the height of this media item.
   * 
   * @returns {Number} the media's height.
   */
  get height() {
    return this._data.Media[0].height;
  }

  /**
   * Gets the width of this media item.
   * 
   * @returns {Number} the media's width.
   */
  get width() {
    return this._data.Media[0].width;
  }

  /**
   * Gets the aspect ratio of this media item.
   * 
   * @returns {Number} the media's aspect ratio.
   */
  get aspectRatio() {
    return this._data.Media[0].aspectRatio;
  }

  /**
   * Gets the container of this media item.
   * 
   * @returns {String} the media's container.
   */
  get container() {
    return this._data.Media[0].container;
  }

  static create(device, path, data) {
    if ("Media" in data) {
      switch (data.type) {
      case "movie":
        return new PlexMovie(device, path, data.Metadata[0]);
      case "episode":
        return new PlexEpisode(device, path, data.Metadata[0]);
      case "photo":
        return new PlexPhoto(device, path, data.Metadata[0]);
      }
    }
    return new PlexContainer(device, path, data);
  }
}

/**
 * Represents a movie.
 */
class PlexMovie extends PlexMetadata {
}

/**
 * Represents a TV episode.
 */
class PlexEpisode extends PlexMetadata {
  /**
   * Gets the expected thumbnail aspect ratio.
   * 
   * @returns {Number} the thumbnail's aspect ratio.
   */
  get thumbAspectRatio() {
    return this.aspectRatio;
  }
}

/**
 * Represents a photo.
 */
class PlexPhoto extends PlexMetadata {
  /**
   * Gets the expected thumbnail aspect ratio.
   * 
   * @returns {Number} the thumbnail's aspect ratio.
   */
  get thumbAspectRatio() {
    return this.aspectRatio;
  }
}

module.exports = {
  PlexMetadata,
  PlexMovie,
  PlexEpisode,
  PlexPhoto,
};
