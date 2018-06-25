class PlexDirectory {
  constructor(connection, baseuri, data) {
    this.connection = connection;
    this.baseuri = baseuri;
    this.data = data;
  }

  get name() {
    return this.data.$.title;
  }
}

class PlexContainer {
  constructor(connection, baseuri, data) {
    this.connection = connection;
    this.baseuri = baseuri;
    this.data = data;
  }

  get directories() {
    return this.data.Directory.map(d => new PlexDirectory(this.container, this.baseuri, d));
  }

  getDirectoryByName(name) {
    let dirs = this.data.Directory.filter(d => d.$.title == name);
    if (dirs.length == 1) {
      return new PlexDirectory(this.container, this.baseuri, dirs[0]);
    } else {
      return null;
    }
  }

  get items() {
    return [];
  }
}

module.exports = PlexContainer;
