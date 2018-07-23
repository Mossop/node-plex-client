const PlexItem = require("./item");

async function createItem(Registry, type, device, path, itemData) {
  try {
    let data = await device._loadItemData(path);
    return Registry.createItem(type, device, path, data, itemData);
  } catch (e) {
    return null;
  }
}

/**
 * Many things in Plex are considered to be MediaContainers. This class allows
 * retrieving information about the container and its contents.
 */
class PlexContainer extends PlexItem {
  /**
   * Retrieves the contents of this container
   */
  async getContents() {
    const Registry = require("./registry");

    let results = [];
    for (let type of Registry.types) {
      if (!(type in this._data)) {
        continue;
      }

      for (let itemData of this._data[type]) {
        let path = this._path;
        if (itemData.key.startsWith("/")) {
          path = itemData.key + "/";
        } else {
          path += itemData.key + "/";
        }

        results.push(createItem(Registry, type, this._device, path, itemData));
      }
    }

    return (await Promise.all(results)).filter(c => c);
  }
}

module.exports = PlexContainer;
