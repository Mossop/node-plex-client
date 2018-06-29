class PlexContainer {
  constructor(connection, baseuri, data) {
    this.connection = connection;
    this.baseuri = baseuri;
    this.data = data;
  }

  get name() {
    return this.data.title || this.data.title1;
  }

  get art() {
    return this.data.art;
  }

  get thumb() {
    return this.data.thumb;
  }
}

module.exports = PlexContainer;
