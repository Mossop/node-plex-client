const { URL } = require("url");

/**
 * The basic building block for the Plex API. Almost everything in Plex is a
 * MediaContainer filled with items. This class allows retrieving information
 * about the container and its contents.
 */
class PlexContainer {
  /**
   * Do not construct this manually, instead get a PlexDevice which is an
   * instance of PlexContainer and then use it to browse the device's contents.
   * 
   * @param {URL} baseuri the URI representing the container.
   * @param {Object} data the container's data.
   */
  constructor(baseuri, data) {
    this._baseuri = baseuri;
    this._data = data;
    this._device = null;
  }

  /**
   * Gets the container's name.
   * 
   * @returns {String} the name.
   */
  get name() {
    return this._data.title || this._data.title1;
  }

  /**
   * Gets a banner picture to represent the container.
   * 
   * @returns {URL} the URL to the image.
   */
  get art() {
    return new URL(this._data.art, this._baseuri);
  }

  /**
   * Gets a thumbnail to represent the container.
   * 
   * @returns {URL} the URL to the image.
   */
  get thumb() {
    return new URL(this._data.thumb, this._baseuri);
  }

  /**
   * Retrieves the contents of this container
   */
  async getContents() {
    // Plex's URL handling is bogus.
    let base = this._baseuri.toString();
    if (!base.endsWith("/")) {
      base += "/";
    }

    let results = [];
    for (let dir of this._data.Directory) {
      let url = new URL(dir.key, base);
      results.push(this._device.loadItem(url).catch(() => null));
    }

    return (await Promise.all(results)).filter(c => c);
  }
}

module.exports = PlexContainer;
