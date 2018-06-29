class PlexContainer {
  constructor(connection, baseuri, data) {
    this.connection = connection;
    this.baseuri = baseuri;
    this._data = data;
  }

  get name() {
    return this._data.title || this._data.title1;
  }

  get art() {
    return this._data.art;
  }

  get thumb() {
    return this._data.thumb;
  }
}

module.exports = PlexContainer;
