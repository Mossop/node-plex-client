class PlexContainer {
  constructor(client, baseuri, data) {
    this.client = client;
    this.baseuri = baseuri;
    this._data = data;
    this.device = null;
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
