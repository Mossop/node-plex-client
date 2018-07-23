const { URL } = require("url");

/**
 * The basic building block for the Plex API. This class allows retrieving
 * information about the item.
 */
class PlexItem {
  /**
   * Do not construct this manually, instead get a PlexDevice which is an
   * instance of PlexItem and then use it to browse the device's contents.
   * 
   * @param {PlexDevice} device the device that owns this item or null if this is the device.
   * @param {String} path the path to this item.
   * @param {Object} data the item's data.
   */
  constructor(device, path, data) {
    this._device = device || this;
    this._path = path;
    this._data = data;
  }

  /**
   * Gets the device owning this item.
   * 
   * @returns {PlexDevice} the device.
   */
  get device() {
    return this._device;
  }

  /**
   * Gets the path identifying this item.
   * 
   * @returns {String} the path.
   */
  get path() {
    return this._path;
  }

  /**
   * Gets the item's name.
   * 
   * @returns {String} the name.
   */
  get name() {
    if (this._data.title2) {
      return `${this._data.title1} - ${this._data.title2}`;
    }
    return this._data.title || this._data.title1;
  }

  /**
   * Gets a banner picture to represent the item.
   * 
   * @returns {URL} the URL to the image.
   */
  get art() {
    if (this._data.art) {
      return this._device._getURL(this._data.art);
    }
    return null;
  }

  /**
   * Gets a thumbnail to represent the item.
   * 
   * @returns {URL} the URL to the image.
   */
  get thumb() {
    if (this._data.thumb) {
      return this._device._getURL(this._data.thumb);
    }
    return null;
  }
}

module.exports = PlexItem;
