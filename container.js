const { URL } = require("url");

class PlexDirectory {
  constructor(connection, baseuri, data) {
    this.connection = connection;
    this.baseuri = baseuri;
    this.data = data;
  }

  get name() {
    return this.data.$.title;
  }

  async getContainer() {
    let url = new URL(`${this.data.$.key}/`, this.baseuri);
    let containerData = await this.connection.request(url);
    return new PlexContainer(this.connection, url, containerData.MediaContainer);
  }
}

class PlexContainer {
  constructor(connection, baseuri, data) {
    this.connection = connection;
    this.baseuri = baseuri;
    this.data = data;
  }

  get name() {
    return this.data.$.title || this.data.$.title1;
  }

  get art() {
    return this.data.$.art;
  }

  get thumb() {
    return this.data.$.thumb;
  }

  async getItems() {
    let items = [];

    for (let prop of Object.keys(this.data)) {
      if (prop == "$") {
        return;
      }

      for (let itemData of this.data[prop]) {
        let url = new URL(`${itemData.$.key}/`, this.baseuri);
        items.push(this.device.getItem(url));
      }
    }

    return Promise.all(items);
  }

  get directories() {
    return this.data.Directory.map(d => new PlexDirectory(this.connection, this.baseuri, d));
  }

  getDirectoryByName(name) {
    let dirs = this.data.Directory.filter(d => d.$.title == name);
    if (dirs.length == 1) {
      return new PlexDirectory(this.connection, this.baseuri, dirs[0]);
    } else {
      return null;
    }
  }

  get items() {
    return [];
  }
}

module.exports = {
  PlexDirectory,
  PlexContainer,
};
