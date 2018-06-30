const PlexClient = require("./client");

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
   * @param {PlexClient} client the client used to retrieve the container.
   * @param {String} baseuri the URI representing the container.
   * @param {Object} data the container's data.
   */
  constructor(client, baseuri, data) {
    this.client = client;
    this.baseuri = baseuri;
    this._data = data;
    this.device = null;
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
    return new URL(this._data.art, this.baseuri);
  }

  /**
   * Gets a thumbnail to represent the container.
   * 
   * @returns {URL} the URL to the image.
   */
  get thumb() {
    return new URL(this._data.thumb, this.baseuri);
  }
}

module.exports = PlexContainer;
