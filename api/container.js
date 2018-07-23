const { URL } = require("url");

const Registry = require("./registry");

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
   * @param {String} path the path to this container container.
   * @param {Object} data the container's data.
   */
  constructor(device, path, data) {
    this._device = device || this;
    this._path = path;
    this._data = data;
  }

  /**
   * Gets the path identifying this container. Always starts and ends with a '/'.
   * 
   * @returns {String} the path.
   */
  get path() {
    return this._path;
  }

  /**
   * Gets the container's name.
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
   * Gets a banner picture to represent the container.
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
   * Gets a thumbnail to represent the container.
   * 
   * @returns {URL} the URL to the image.
   */
  get thumb() {
    if (this._data.thumb) {
      return this._device._getURL(this._data.thumb);
    }
    return null;
  }

  /**
   * Retrieves the contents of this container
   */
  async getContents() {
    let results = [];
    for (let type of Registry.types) {
      if (!(type in this._data)) {
        continue;
      }

      for (let itemData of this._data[type]) {
        let path = this._path + itemData.key + "/";
        results.push((async() => {
          try {
            let data = await this._device._loadItemData(path);
            return Registry.createItem(type, this._device, path, itemData, data);
          } catch (e) {
            return null;
          }
        })());
      }
    }

    return (await Promise.all(results)).filter(c => c);
  }
}

module.exports = PlexContainer;
