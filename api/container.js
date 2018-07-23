const PlexItem = require("./item");

function mergeArray(itemArray, sourceArray) {
  function mergeIn(sourceItem) {
    let prop = ["key", "id"].find(p => p in sourceItem);
    if (!prop) {
      console.error("Unable to find a property to match against.", sourceItem);
    }

    for (let item of itemArray) {
      if (item[prop] == sourceItem[prop]) {
        mergeData(item, sourceItem);
        return;
      }
    }

    itemArray.push(sourceItem);
  }

  sourceArray.forEach(mergeIn);
}

function mergeData(itemData, sourceData) {
  for (let key of Object.keys(sourceData)) {
    if (!(key in itemData)) {
      itemData[key] = sourceData[key];
      continue;
    }

    if (Array.isArray(itemData[key]) && Array.isArray(sourceData[key])) {
      mergeArray(itemData[key], sourceData[key]);
    }
  }
}

async function createItem(Registry, type, device, path, sourceData) {
  try {
    let data = (await device._loadItemData(path)).MediaContainer;
    mergeData(data, sourceData);
    return Registry.createItem(type, device, path, data);
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
   * 
   * @returns {Promise<PlexItem[]>} the container's contents.
   */
  async getContents() {
    const Registry = require("./registry");

    let results = [];
    for (let type of Registry.types) {
      if (!(type in this._data)) {
        continue;
      }

      for (let sourceData of this._data[type]) {
        let path = this._path;
        if (sourceData.key.startsWith("/")) {
          path = sourceData.key + "/";
        } else {
          path += sourceData.key + "/";
        }

        results.push(createItem(Registry, type, this._device, path, sourceData));
      }
    }

    return (await Promise.all(results)).filter(c => c);
  }
}

module.exports = PlexContainer;
