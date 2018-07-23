const { URL } = require("url");

const PlexItem = require("./item");
const Registry = require("./registry");

/**
 * Many things in Plex are considered to be MediaContainers. This class allows
 * retrieving information about the container and its contents.
 */
class PlexContainer extends PlexItem {
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
