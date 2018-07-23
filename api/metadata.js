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
    return new PlexMetadata(device, path, data.MediaContainer, sourceData);
  }
}

module.exports = PlexMetadata;
